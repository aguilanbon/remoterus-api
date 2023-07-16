import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import auth_router from "./routes/users";

const app = express();
const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  // whatever port for next.js
  origin: process.env.DOMAIN_HOST,
  preflightContinue: true,
};
app.use(cors(options));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.listen(8080, () =>
  console.log(`server is running on: ${process.env.SERVER_HOST}`)
);

mongoose
  .connect(process.env.MONGO_COMPASS_URL)
  .then(() => console.log("connected to db"));
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/api/auth", auth_router);
