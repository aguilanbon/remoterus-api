import jwt from "jsonwebtoken";
import { UserModel } from "../model/users";
import express from "express";

export const isLoggedIn = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};

export const isAuthorized = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded);
      next();
    } catch (error) {
      res.status(401).send("Invalid token");
    }
  } else {
    res.status(401).send("Unauthorized");
  }
};
