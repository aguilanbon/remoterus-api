import mongoose from "mongoose";
import { UserModel } from "../model/users";
import express from "express";
import { ResponseProps } from "types/response.type";

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
    if (isEmailExisting) {
      const response: ResponseProps = {
        isError: true,
        responseMessage: "Email is already existing.",
        responseData: {},
      };
      res.status(400).send(response);
      return;
    }
    if (username.includes(" ")) {
      const response: ResponseProps = {
        isError: true,
        responseMessage: "Username cannot contain spaces.",
        responseData: {},
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
  } catch (error) {}
};

export const getUsers = () => UserModel.find({});

export const getUserByEmail = (email: String) => UserModel.findOne({ email });

export const getUserBySessionToken = (sessionToken: String) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const getUserById = (id: String) => UserModel.findById(id);

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: String) =>
  UserModel.findOneAndDelete({ _id: id });

export const updateUserById = (id: String, values: Record<string, any>) =>
  UserModel.findOneAndUpdate(id, values);
