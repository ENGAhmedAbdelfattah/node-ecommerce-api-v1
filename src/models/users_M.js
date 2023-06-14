const mongoose = require("mongoose");
const valid = require("validator");
const setImagesURL = require("./mongoose_MW/setImageURL");
const encryptPass = require("./mongoose_MW/encryptPass");

const usersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name required"],
      tirm: true,
      minLength: 3,
      maxLength: 50,
      // validate: {
      //   validator: (val) => valid.isAlpha(val),
      //   message: "{VALUE} is not valid name",
      // },
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      require: [true, "email required"],
      unique: true,
      validate: {
        validator: (val) => valid.isEmail(val),
        message: "{VALUE} is not valid email",
      },
    },
    password: {
      type: String,
      validate: {
        validator: (val) => valid.isStrongPassword(val),
        message: "{VALUE} is not strong password",
      },
      require: [true, "password is required"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpiration: Date,
    passwordResetCodeIsVerified: Boolean,
    phone: {
      type: String,
      validate: {
        validator: (val) => valid.isMobilePhone(val, "ar-EG"),
        message: "{VALUE} is not valid mobile phone",
      },
    },
    profileImage: {
      type: String,
    },
    role: { type: String, enum: ["admin", "manager", "user"], default: "user" },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

setImagesURL(usersSchema, "users", "profileImage");
encryptPass(usersSchema);

const UsersModel = mongoose.model("users", usersSchema);

module.exports = UsersModel;
