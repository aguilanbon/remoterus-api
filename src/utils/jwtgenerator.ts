import jwt from "jsonwebtoken";
import express from "express";

export const generateToken = (res: express.Response, userId: String) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "2 days",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.SERVER_ENVIRONMENT !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const generateAccessToken = (userId: String) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return accessToken;
};
export const generateRefreshToken = (userId: String) => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1day",
  });
  return refreshToken;
};
