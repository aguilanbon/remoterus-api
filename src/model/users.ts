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
    name: {
      first: {
        type: String,
        required: true,
      },
      middle: {
        type: String,
        required: false,
      },
      last: {
        type: String,
        required: true,
      },
      suffix: {
        type: String,
        required: false,
      },
    },
    personalInformation: {
      mobileNo: {
        type: String,
        required: true,
      },
      birthdate: {
        type: Date,
        required: true,
      },
      address: {
        street: {
          type: String,
          required: false,
        },
        zipcode: {
          type: String,
          required: false,
        },
        city: {
          type: String,
          required: false,
        },
        state: {
          type: String,
          required: false,
        },
        country: {
          type: String,
          required: false,
        },
      },
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
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
