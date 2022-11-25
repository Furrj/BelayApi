import * as dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import bcrypt from "bcrypt";

//MONGO
import "./models/User";
const User = mongoose.model("User");

const PORT = process.env.PORT || 5000;
const app = express();

process.env.MONGO_URI && mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

//SESSION
process.env.SESSION_SECRET &&
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { httpOnly: true, maxAge: 60 },
    })
  );

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "..", "client", "build")));

//ROUTES
// app.get("/*", (req, res): void => {
//   res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
// });

app.post(
  "/register",
  async (req, res): Promise<Response<any, Record<string, any>>> => {
    const { username, password } = req.body;
    const check = await User.findOne({ username });
    if (check) {
      return res.json("Username already in use");
    }

    const hash: string = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      password: hash,
    });

    await newUser.save();
    return res.json("Succesfully registered");
  }
);

app.post("/login", (req, res): void => {
  console.log("Success");
});

app.listen(PORT, (): void => {
  console.log(`Listening on ${PORT}...`);
});
