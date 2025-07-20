import { Navigate, useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

  return (
    <div>
      <h1>This is the Home Page</h1>
      <button
        onClick={() => navigate("/login")}
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Login Page
      </button>
      <button
        onClick={() => navigate("/signup")}
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Signup Page
      </button>
    </div>
  );
}

export default Home;
