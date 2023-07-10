import { registerUser } from "../controller/users";
import express from "express";

const auth_router = express.Router();

auth_router.post("/register", registerUser);

export default auth_router;
