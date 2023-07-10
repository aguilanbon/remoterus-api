import mongoose from "mongoose";
import { UserModel } from "../model/users";
import express from "express";
import { ResponseProps } from "types/response.type";
import bcrypt from "bcrypt";

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
        responseMessage: "Email is already existing.",
      };
      res.status(400).send(response);
      return;
    }
    if (isUsernameExisting) {
      const response: ResponseProps = {
        isError: true,
        responseMessage: "Username is already taken.",
      };
      res.status(400).send(response);
      return;
    }
    if (username.includes(" ")) {
      const response: ResponseProps = {
        isError: true,
        responseMessage: "Username cannot contain spaces.",
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
      responseMessage: "Succesfully created user.",
      responseData: newUser,
    };
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
        responseMessage: passwordErrorMessage,
      };
      res.status(400).send(response);
    } else {
      // Handle other errors
      res.status(400).send(error.message);
    }
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
