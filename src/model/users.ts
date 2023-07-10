import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    authentication: {
      password: {
        type: String,
        required: true,
        select: false,
      },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);

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

///Name - fName,lName, mName, suffix
///Address - St, zipcode, state, city, country
///bday
///gender
///age = auto compute
///work = [{
// company, position, start, end, isPresent,
// }]
///fName
///fName
///fName
///fName
///fName
///fName
///fName
