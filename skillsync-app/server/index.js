import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";

dotenv.config();

const PORT = 3000;
const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB Connection failed:", err));


// app.get("/api/dashboard", authMiddleware, (req, res) => {
//     res.json({message: `Hello ${req.user.name}, your email is ${req.user.email} and your position in the company is ${req.user.role}. This is your dashboard`});
// });

app.get("/", (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});