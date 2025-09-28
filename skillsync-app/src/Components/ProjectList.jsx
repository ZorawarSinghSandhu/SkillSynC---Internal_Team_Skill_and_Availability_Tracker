import { useState } from "react";

function ProjectList({ projects, users, onProjectUpdate }) {
  const [selectedUsers, setSelectedUsers] = useState({});

  // Stores which employee is selected for which project
  const handleSelectChange = (projectId, userId) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [projectId]: userId,
    }));
  };

  // Handles the API call when the "Assign" button is clicked
  const handleAssign = async (projectId) => {
    const userId = selectedUsers[projectId];
    if (!userId) {
      alert("Please select an employee to assign.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:3000/api/projects/${projectId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        // Pass the updated project data back to the Dashboard
        onProjectUpdate(data.project);
      } else {
        throw new Error(data.message || "Failed to assign project");
      }
    } catch (err) {
      console.error("Assign project error:", err);
      alert(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Not Started":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Projects Overview</h2>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {project.projectName}
                </h3>
                <p className="text-gray-600 mb-4 h-20 overflow-y-auto">
                  {project.description || "No description provided."}
                </p>
                <div className="mb-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Assignment Section */}
              <div className="mt-auto pt-4 border-t">
                {project.assignedTo ? (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Assigned To:
                    </p>
                    <p className="text-gray-900">
                      {users.find((u) => u._id === project.assignedTo)?.name ||
                        "Unknown User"}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                      onChange={(e) =>
                        handleSelectChange(project._id, e.target.value)
                      }
                      value={selectedUsers[project._id] || ""}
                    >
                      <option value="" disabled>
                        Select Employee
                      </option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAssign(project._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg"
                    >
                      Assign
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
          <p className="text-gray-500">No projects have been created yet.</p>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
