const mongoose = require("mongoose");

const couponsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon's name is required"],
      unique: [true, "Coupon's name must be unique"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon's expire time is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon's discount value is required"],
    },
  },
  { timestamps: true }
);

const CouponsModel = mongoose.model("coupons", couponsSchema);

module.exports = CouponsModel;
