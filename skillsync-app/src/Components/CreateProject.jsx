import { useState } from "react";

function CreateProject({ onProjectCreated }) {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.projectName.trim() === "") {
      setError("Project name is required.");
      return;
    }
    setError(""); // Clear previous errors

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        onProjectCreated(data.project);
        setFormData({ projectName: "", description: "" }); // Clear form
      } else {
        throw new Error(data.message || "Failed to create project");
      }
    } catch (err) {
      console.error("Failed to create project:", err);
      setError(err.message);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Create a New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="projectName"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Project Name
          </label>
          <input
            id="projectName"
            name="projectName"
            type="text"
            placeholder="Enter project title"
            onChange={handleChange}
            value={formData.projectName}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Provide a brief project description"
            onChange={handleChange}
            value={formData.description}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold rounded-lg py-2.5 hover:bg-blue-700 transition-colors duration-200"
        >
          Create Project
        </button>
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}
      </form>
    </div>
  );
}

export default CreateProject;
