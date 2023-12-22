import dotenv from "dotenv";
import express, { Express } from "express";
import cors, { CorsOptions } from "cors";

dotenv.config();

export const app: Express = express();

const options : CorsOptions = {
    credentials: true,
    origin: process.env.APP_URL
}

app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

export default app;