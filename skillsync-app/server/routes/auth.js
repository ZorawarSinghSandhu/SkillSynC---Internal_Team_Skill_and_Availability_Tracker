import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

const router = express.Router();

router.post("/signup", async (req, res) => {
    // console.log("Signup route hit");
    const {name, email, password, role} = req.body;



    try {
        const userExists =  await User.findOne({email});
        if (userExists) {
            return res.status(409).json({ message: "User Already Exists"});
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const newUser = new User({name, email, password: hashedPassword, role});
        await newUser.save();
        res.status(201).json({message: "User Created Successfully"});

    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }

});

router.post("/login",  async (req, res) => {
    try{
    const {email, password} = req.body;

    const userExists = await User.findOne({email});

    if(!userExists){
        return res.status(404).json({message: "User not found"});
    }

    const passwordValid = await bcrypt.compare(password, userExists.password);

    if(!passwordValid){
        return res.status(401).json({message: "Invalid Password"});
    }

    const token = jwt.sign(
        {userId: userExists._id},
        SECRET_KEY,
        {expiresIn: "1h"}
    );

    res.status(200).json({message: "Login Successful", token});

}catch(err){
    console.log(err);
    res.status(500).json({message: "Server Error"});
}
});

export default router;