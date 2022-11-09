import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const User = new mongoose.Schema({
  username: String,
  password: String,
});

mongoose.model("User", User);

export {};
