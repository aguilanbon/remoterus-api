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
