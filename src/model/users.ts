import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
      sessionToken: { type: String, select: false },
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const saltRoundes = 10;
  this.authentication.password = await bcrypt.hash(
    this.authentication.password,
    saltRoundes
  );
  next();
});

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
