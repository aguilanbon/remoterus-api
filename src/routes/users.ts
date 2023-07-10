import { registerUser, signInUser } from "../controller/users";
import express from "express";

const auth_router = express.Router();

auth_router.post("/register", registerUser);
auth_router.post("/signin", signInUser);

export default auth_router;
