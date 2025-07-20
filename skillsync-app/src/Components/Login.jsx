import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allFilled = Object.values(formData).every(
      (value) => value.trim() != ""
    );
    if (!allFilled) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

        

        <label htmlFor="email" className="block mb-2 text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md mb-4 bg-gray-100 shadow-sm"
        />

        <label htmlFor="password" className="block mb-2 text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md mb-4 bg-gray-100 shadow-sm"
        />

        
        <div className="w-full flex justify-center p-8">
          <button
            type="submit"
            className="block shadow-md w-[80%] bg-blue-600 text-white font-semibold rounded-lg py-2.5 hover:bg-blue-700 transition-colors duration-200"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
