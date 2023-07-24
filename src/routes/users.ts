import { isLoggedIn } from "../middleware/auth.middleware";
import {
  getUserProfile,
  refreshToken,
  registerUser,
  signInUser,
  signOutUser,
} from "../controller/users";
import express from "express";

const auth_router = express.Router();

auth_router.post("/register", registerUser);
auth_router.post("/signin", signInUser);
auth_router.get("/profile", isLoggedIn, getUserProfile);
auth_router.post("/signout", isLoggedIn, signOutUser);
auth_router.get("/refresh", isLoggedIn, refreshToken);

export default auth_router;
