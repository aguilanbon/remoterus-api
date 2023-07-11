import mongoose from "mongoose";
import { UserModel } from "../model/users";
import express from "express";
import { ResponseProps } from "types/response.type";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwtgenerator";
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
      res.status(400).send(response);
      return;
    }
    if (isUsernameExisting) {
      const response: ResponseProps = {
        isError: true,
        message: "Username is already taken.",
      };
      res.status(400).send(response);
      return;
    }
    if (username.includes(" ")) {
      const response: ResponseProps = {
        isError: true,
        message: "Username cannot contain spaces.",
      };
      res.status(400).send(response);
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
      data: newUser,
    };
    generateToken(res, newUser.id);
    res.status(200).send(response);
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
      res.status(400).send(response);
    } else {
      // Handle other errors
      res.status(400).send(error.message);
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
      "+authentication.password"
    );

    if (!user) {
      user = await getUserByUserName(username).select(
        "+authentication.password"
      );
    }
    if (!user) {
      const response: ResponseProps = {
        isError: true,
        message: "Invalid username or email",
      };
      res.status(400).send(response);
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
      res.status(400).send(response);
      return;
    }
    const response: ResponseProps = {
      isError: false,
      message: "Sign in successful",
      data: user,
    };

    generateToken(res, user.id);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const signOutUser = async (
  req: express.Request,
  res: express.Response
) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  const response: ResponseProps = {
    isError: true,
    message: "Sign out successful",
  };
  res.status(200).send(response);
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
        res.status(400).send(response);
      }
      try {
        const user = await getUserById(decoded.userId);
        if (!user) {
          res.status(400).send("User not found");
        }
        const response: ResponseProps = {
          isError: false,
          message: "Success",
          data: user,
        };
        res.status(200).send(response);
      } catch (error) {
        res.status(400).send(error);
      }
    }
  );
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
