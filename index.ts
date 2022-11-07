// import * as dotenv from "dotenv";
// dotenv.config();
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import path from "path";

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

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "..", "build")));

//ROUTES
app.get("/", (req, res): void => {
  res.sendFile(
    path.join(__dirname, "..", "build", "index.html")
  );
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

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const regCheck = await User.exists({ username: username });
    if (regCheck) {
      res.json("Taken");
      console.log("Taken");
    } else {
      const newUser = new User({
        username,
      });
      const regUser = await User.register(newUser, password);
      res.json("Registered");
      console.log(regUser);
    }
  } catch (e) {
    console.log(`Error: ${e}`);
    res.json(`Error: ${e}`);
  }
});

app.listen(PORT, (): void => {
  console.log(`Listening on ${PORT}...`);
});
