import mongoose from "mongoose";
import { UserModel } from "../model/users";
import express from "express";
import { ResponseProps } from "types/response.type";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
} from "../utils/jwtgenerator";
import jwt, { JwtPayload } from "jsonwebtoken";

export const registerUser = async (
  req: express.Request,
  res: express.Response
) => {
  const {
    username,
    email,
    authentication,
    personalInformation,
    role,
    isAdmin,
  } = req.body;

  try {
    const isEmailExisting = await getUserByEmail(email);
    const isUsernameExisting = await getUserByUserName(username);

    if (isEmailExisting) {
      const response: ResponseProps = {
        isError: true,
        message: "Email is already existing.",
      };
      res.status(400).json(response);
      return;
    }
    if (isUsernameExisting) {
      const response: ResponseProps = {
        isError: true,
        message: "Username is already taken.",
      };
      res.status(400).json(response);
      return;
    }
    if (username.includes(" ")) {
      const response: ResponseProps = {
        isError: true,
        message: "Username cannot contain spaces.",
      };
      res.status(400).json(response);
      return;
    }
    const newUser = await UserModel.create({
      username,
      email,
      authentication,
      personalInformation,
      role,
      isAdmin,
    });
    const response: ResponseProps = {
      isError: false,
      message: "Succesfully created user.",
    };
    // generateToken(res, newUser.id);
    res.status(200).json(response);
    return;
  } catch (error) {
    if (
      error.name === "ValidationError" &&
      error.errors &&
      error.errors["authentication.password"]
    ) {
      const passwordErrorMessage =
        error.errors["authentication.password"].message;
      const response: ResponseProps = {
        isError: true,
        message: passwordErrorMessage,
      };
      res.status(400).json(response);
    } else {
      // Handle other errors
      res.status(400).json(error.message);
    }
  }
};

export const signInUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { username, password } = req.body;

  try {
    let user = await getUserByEmail(username).select(
      "+authentication.password +authentication.accessToken"
    );

    if (!user) {
      user = await getUserByUserName(username).select(
        "+authentication.password +authentication.accessToken"
      );
    }
    if (!user) {
      const response: ResponseProps = {
        isError: true,
        message: "Invalid username or email",
      };
      res.status(400).json(response);
      return;
    }
    const passwordMatch = await bcrypt.compare(
      password,
      user.authentication.password
    );

    if (!passwordMatch) {
      const response: ResponseProps = {
        isError: true,
        message: "Invalid username/email or password",
      };
      res.status(400).json(response);
      return;
    }
    const response: ResponseProps = {
      isError: false,
      message: "Sign in successful",
      data: user,
    };
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    user.authentication.accessToken = accessToken;
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.SERVER_ENVIRONMENT !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const signOutUser = async (
  req: express.Request,
  res: express.Response
) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.SERVER_ENVIRONMENT !== "development",
    sameSite: "strict",
    maxAge: 1,
  });
  const response: ResponseProps = {
    isError: false,
    message: "Sign out successful",
  };
  res.status(200).json(response);
};

export const getUserProfile = async (
  req: express.Request,
  res: express.Response
) => {
  jwt.verify(
    req.cookies.jwt,
    process.env.JWT_SECRET,
    async function (err: Error, decoded: jwt.JwtPayload) {
      if (err) {
        const response: ResponseProps = {
          isError: true,
          message: "Missing token",
        };
        res.status(400).json(response);
      }
      try {
        const user = await getUserById(decoded.userId);
        if (!user) {
          res.status(400).json("User not found");
        }
        const response: ResponseProps = {
          isError: false,
          message: "Success",
          data: user,
        };
        res.status(200).json(response);
      } catch (error) {
        res.status(400).json(error);
      }
    }
  );
};

export const refreshToken = async (
  req: express.Request,
  res: express.Response
) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    const response: ResponseProps = {
      isError: true,
      message: "Unauthorized",
    };

    res.status(401).json(response);
  }

  const refreshToken = cookies.jwt;

  try {
    const decoded: any | JwtPayload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    if (!decoded) res.json({ message: "Forbidden" });

    const foundUser = await getUserById(decoded.userId).select(
      "+authentication.accessToken"
    );
    if (!foundUser) res.json({ message: "Unauthorized" });
    const accessToken = generateAccessToken(foundUser.id);
    res.json({ accessToken });
  } catch (error) {
    throw error;
  }
};

export const getUsers = () => UserModel.find({});

export const getUserByEmail = (email: String) => UserModel.findOne({ email });
export const getUserByUserName = (username: String) =>
  UserModel.findOne({ username });

export const getUserBySessionToken = (sessionToken: String) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const getUserById = (id: String) => UserModel.findById(id);

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: String) =>
  UserModel.findOneAndDelete({ _id: id });

export const updateUserById = (id: String, values: Record<string, any>) =>
  UserModel.findOneAndUpdate(id, values);
