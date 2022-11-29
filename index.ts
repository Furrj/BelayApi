import * as dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import mongoose, { Mongoose, Model } from "mongoose";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import session from "express-session";
import path from "path";
import bcrypt from "bcrypt";

//MONGO
import { IUser } from "./models/User";
import "./models/User";
const User: Model<IUser> = mongoose.model<IUser>("User");

const PORT = process.env.PORT || 5000;
const app = express();

process.env.MONGO_URI && mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use(
  cookieSession({
    httpOnly: false,
    keys: ["doasthouwilt"],
  })
);

//SESSION
declare module "express-session" {
  interface SessionData {
    user_id: string;
  }
}

process.env.SESSION_SECRET &&
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 100 * 60 * 15 },
    })
  );

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "..", "build")));

//TYPES
type userInfo = {
  username: string;
  password: string;
};

//ROUTES
app.get("/*", (req, res): void => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.post(
  "/register",
  async (req, res): Promise<Response<any, Record<string, any>>> => {
    const { username, password }: userInfo = req.body;
    const check: Model<IUser> | any = await User.findOne({ username });
    if (check) {
      return res.json("Taken");
    }

    const hash: string = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      password: hash,
    });

    await newUser.save();

    req.session.user_id = newUser._id;
    return res.json("Succesfully registered: " + req.session.user_id);
  }
);

app.post(
  "/login",
  async (req, res): Promise<Response<any, Record<string, any>>> => {
    const { username, password }: userInfo = req.body;
    const userQuery: Model<IUser> | any = await User.findOne({ username });
    if (!userQuery) {
      return res.json("Invalid");
    }

    const checkPassword: boolean = await bcrypt.compare(
      password,
      userQuery.password
    );
    if (checkPassword) {
      req.session.user_id = userQuery._id;
      res.cookie("user_id", req.session.user_id);
      return res.json("Logged in: " + req.session.user_id);
    } else {
      return res.json("Invalid");
    }
  }
);

app.listen(PORT, (): void => {
  console.log(`Listening on ${PORT}...`);
});
