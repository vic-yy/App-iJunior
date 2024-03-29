import dotenv from "dotenv";
import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import UserRouter from "../source/domains/User/controllers/index";
import cookieParser = require("cookie-parser");

dotenv.config();

export const app: Express = express();

const options : CorsOptions = {
    credentials: true,
    origin: process.env.APP_URL
}

app.use(cors(options));
app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use("/api/users", UserRouter)

export default app;