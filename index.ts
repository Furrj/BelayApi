import * as dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

//MONGO
import "./models/User";
const User = mongoose.model("User");

const PORT = process.env.PORT || 5000;
const app = express();

process.env.MONGO_URI && mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req, res): void => {
  res.json("Hi");
});

app.post("/login", (req, res): void => {
  console.log(req.body);
  res.json("Successful post request");
});

app.get("/user", async (req, res): Promise<void> => {
  const newUser = new User({
    username: "Poemmys",
    password: "ballz",
  });

  await newUser.save();
});

app.listen(PORT, (): void => {
  console.log(`Listening on ${PORT}...`);
});
