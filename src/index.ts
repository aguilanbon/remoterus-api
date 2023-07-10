import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { UserModel } from "./model/users";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

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

// app.get("/create", async (req: express.Request, res: express.Response) => {
//   const newUser = new UserModel({
//     username: "bon aguilan",
//     email: "aguilanbon@gmail.com",
//     authentication: {
//       password: "amazing",
//       sessionToken: "abc123",
//     },
//   });

//   await newUser.save();
// });
