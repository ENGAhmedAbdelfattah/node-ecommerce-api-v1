const mongoose = require("mongoose");
const valid = require("validator");
// const setImagesURL = require("./mongoose_MW/setImageURL");
const encryptPass = require("./mongoose_MW/encryptPass");

// embedded schema in user schema
const addressesSchema = mongoose.Schema({
  alias: {
    type: String,
    require: [true, "address alias is required"],
    // unique: [true, "address alias must be unique"], //don't work here so make it in validation layer
    minLength: [3, "address alias is too short"],
    maxLength: [32, "address alias is too long"],
  },
  details: { type: String, require: [true, "address details required"] },
  phone: Number,
  city: String,
  postalCode: Number,
});

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
    // child referance (wishlist(products) contain several product=>child) => when [] little #(one to many)
    // validate about productId exist or not
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: "products" }], // from me: we can creat it in seperate model and ref to user similar to review but make here becuae it one wishlist only
    // Embedded (use Embedded because we don't use address in any another model and address is a little)
    addresses: [addressesSchema],
  },
  {
    timestamps: true,
  }
);

// setImagesURL(usersSchema, "users", "profileImage");
encryptPass(usersSchema);

const UsersModel = mongoose.model("users", usersSchema);

module.exports = UsersModel;
