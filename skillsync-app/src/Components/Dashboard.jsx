import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SkillManager from "./SkillManager.jsx";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          // If the token is invalid or expired, clear it and redirect to login
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user data: ", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSkillsUpdate = async (updatedSkills) => {
    const token = localStorage.getItem("token");
    setMessage("Saving...");

    try {
      const res = await fetch("http://localhost:3000/api/users/me/skills", {
        method: "PUT",
        headers: {
          "Content-Type": "appication/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skills: updatedSkills }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setMessage("Skills updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update skills");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">SkillSync Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        {user && (
          <div>
            <div className="mb-5">
              <h2 className="text-2xl mb-4">
                Welcome, <span className="font-semibold">{user.name}</span>!
              </h2>
              <p className="text-lg">
                You are logged in as an:{" "}
                <span className="capitalize bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full">
                  {user.role}
                </span>
              </p>
            </div>
            {user.role == "employee" && (
              <SkillManager
                initialSkills={user.skills}
                onSkillsUpdate={handleSkillsUpdate}
              />
            )}

            {message && (
              <p className="mt-4 text-center text-sm text-gray-600">
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
