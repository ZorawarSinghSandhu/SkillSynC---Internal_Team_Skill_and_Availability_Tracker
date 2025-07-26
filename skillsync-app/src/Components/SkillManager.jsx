import { useState } from "react";

function SkillManager({ initialSkills, onSkillsUpdate }) {
  const [skills, setSkills] = useState(initialSkills || []);
  const [newSkill, setNewSkill] = useState("");

  // Handles adding a new skill to the local state
  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      const updatedSkills = [...skills, trimmedSkill];
      setSkills(updatedSkills);
      setNewSkill(""); // Clear the input field
      onSkillsUpdate(updatedSkills); // Pass the updated list to the parent
    }
  };

  // Handles removing a skill from the local state
  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    onSkillsUpdate(updatedSkills); // Pass the updated list to the parent
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">Manage Your Skills</h3>
      
      {/* Display current skills as tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 text-green-600 hover:text-green-800 font-bold"
              >
                &times;
              </button>
            </span>
          ))
        ) : (
          <p className="text-gray-500">You haven't added any skills yet.</p>
        )}
      </div>

      {/* Input to add a new skill */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
          placeholder="Add a new skill (e.g., React)"
          className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddSkill}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
        >
          Add Skill
        </button>
      </div>
    </div>
  );
}

export default SkillManager;
