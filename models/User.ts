import mongoose from "mongoose";

const User = new mongoose.Schema({
  username: String,
  password: String,
});

mongoose.model("User", User);

export {};
