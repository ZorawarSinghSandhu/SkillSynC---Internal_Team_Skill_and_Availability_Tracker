import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      default: "employee",
      enum: ["admin", "manager", "employee"],
    },

    skills: {
      type: [String],
      default: [],
    },

    availability: {
      type: String,
      enum: ["Available", "Busy", "On Leave"],
      default: "Available"
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
