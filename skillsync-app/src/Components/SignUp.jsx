import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function SignUp() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const handleChange = (e) => {

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))

    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        const allFilled = Object.values(formData).every(value => value.trim() != '');
        if(!allFilled){
            alert("Please fill all the fields.");
            return;
        }
        console.log(formData);

        

    }

    

    

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <label htmlFor = "full-name" className="block mb-2 text-sm font-medium">Full Name</label>
        <input type="text" name="name" id = "full-name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded-md mb-4 bg-gray-100 shadow-sm"/>

        <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
        <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-md mb-4 bg-gray-100 shadow-sm"/>

        <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 rounded-md mb-4 bg-gray-100 shadow-sm" />

        <label htmlFor="role" className="block mb-2 text-sm font-medium">Role</label>
        <select name="role" id="role"  value={formData.role} onChange={handleChange} className="block w-[50%] bg-gray-100 shadow-sm px-4 py-1 rounded-md mb-6">
        <option value="" disabled hidden>Choose your role</option>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="employee">Employee</option>
        
        </select>
        <div className="w-full flex justify-center p-8">
        <button type="submit" className="block shadow-md w-[80%] bg-blue-600 text-white font-semibold rounded-lg py-2.5 hover:bg-blue-700 transition-colors duration-200">Create Account</button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
