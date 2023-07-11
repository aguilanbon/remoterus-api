import jwt from "jsonwebtoken";
import express from "express";

export const generateToken = (res: express.Response, userId: String) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.SERVER_ENVIRONMENT !== "development",
    sameSite: "strict",
    maxAge: 86400,
  });
};
