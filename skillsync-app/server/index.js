import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB Connection failed:", err));


app.get("/", (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});