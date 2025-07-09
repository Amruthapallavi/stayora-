import express from "express";
import cors from "cors";
import routes from "./routes";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',         // rotate daily
  maxFiles: 30,           // keep logs for 30 days
  path: path.join(__dirname, 'logs') // logs directory
});

app.use(morgan("dev"));

app.use(morgan("combined", { stream: accessLogStream }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);


export default app;






