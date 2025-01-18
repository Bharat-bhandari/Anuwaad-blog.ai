import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
require("dotenv").config();

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

// **********************************************************************************

// Api routes

// **********************************************************************************

// error middleware
import errorHandler from "./middlewares/error.middleware";
app.use(errorHandler);

// post running at 8000

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
