import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
require("dotenv").config();
import path from "path";

import { PrismaClient } from "@prisma/client";
import errorHandler from "./middlewares/error.middleware";

const prisma = new PrismaClient();

const app: Express = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the template engine
app.set("view engine", "ejs");
const test = app.set("views", path.join(__dirname, "../views"));

// **********************************************************************************

// app.get("/", (req: Request, res: Response) => {
//   res.render("login", {
//     title: "Home",
//     message: "Welcome to EJS with Test",
//   });
// });

// app.post("/login", async (req, res) => {});

// // **********************************************************************************

// app.get("/register", (req, res) => {
//   // Pass an error if you want to show anything else
//   res.render("register");
// });

// **********************************************************************************
import authRouter from "./routes/auth.route";
import blogRouter from "./routes/blog.route";

app.use("/api/auth", authRouter);
app.use("/blog", blogRouter);

// post running at 7777

app.use(errorHandler);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
