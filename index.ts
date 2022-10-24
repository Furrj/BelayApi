import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.json("Hi");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.json('Successful post request')
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});
