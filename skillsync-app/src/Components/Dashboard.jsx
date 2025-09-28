import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SkillManager from "./SkillManager.jsx";
import ProjectList from "./ProjectList.jsx";
import CreateProject from "./CreateProject.jsx";
import UserList from "./UserList.jsx";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  
  // State for manager/admin filters
  const [skillFilter, setSkillFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAllData = async () => {
      try {
        // 1. Fetch current user's data
        const userRes = await fetch("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error("Session expired. Please log in again.");
        
        const userData = await userRes.json();
        setUser(userData);

        // 2. If user is a manager or admin, fetch projects and users
        if (userData.role !== "employee") {
          // Construct the query string for users
          const userQuery = new URLSearchParams({
            skill: skillFilter,
            availability: availabilityFilter,
          }).toString();

          // Fetch both projects and users in parallel for efficiency
          const [projectRes, usersRes] = await Promise.all([
            fetch("http://localhost:3000/api/projects", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:3000/api/users?${userQuery}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          if (!projectRes.ok || !usersRes.ok) throw new Error("Failed to fetch manager data.");

          const projectData = await projectRes.json();
          const usersData = await usersRes.json();

          setProjects(projectData.projects);
          setUsers(usersData.users);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate, skillFilter, availabilityFilter]); // Re-run effect when filters change

  const handleProjectCreated = (newProject) => {
    setProjects((prevProjects) => [newProject, ...prevProjects]);
  };

  const handleProjectUpdate = (updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p._id === updatedProject._id ? updatedProject : p))
    );
  };

  const handleSkillsUpdate = async (updatedSkills) => {
    // ... (Your existing code for this is perfect)
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAvailabilityChange = async (e) => {
    // ... (Your existing code for this is perfect)
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">SkillSync Dashboard</h1>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Logout</button>
          </div>
          {user && (
            <div className="mt-4">
              <h2 className="text-2xl">Welcome, <span className="font-semibold">{user.name}</span>!</h2>
              <p className="text-lg text-gray-600">
                You are logged in as a:{" "}
                <span className="capitalize bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full">{user.role}</span>
              </p>
            </div>
          )}
        </div>

        {user && user.role === "employee" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">My Availability</h3>
                <select value={user.availability} onChange={handleAvailabilityChange} className="block w-full bg-gray-100 border-gray-300 rounded-lg p-2.5">
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <SkillManager initialSkills={user.skills} onSkillsUpdate={handleSkillsUpdate} />
            </div>
          </div>
        )}

        {user && user.role !== "employee" && (
          <div className="space-y-8">
            {/* Team Overview & Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Team Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Filter by skill (e.g., React)..."
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Filter by availability</option>
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <UserList users={users} />
            </div>

            {/* Project Management */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <CreateProject onProjectCreated={handleProjectCreated} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <ProjectList projects={projects} users={users} onProjectUpdate={handleProjectUpdate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
