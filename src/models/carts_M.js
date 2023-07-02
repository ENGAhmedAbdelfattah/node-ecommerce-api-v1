const mongoose = require("mongoose");

const cartsSchema = mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "products",
        },
        quantity: { type: Number, default: 1 },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "Review must belong to user"],
    },
  },
  { timestamps: true }
);

const CartsModel = mongoose.model("carts", cartsSchema);

module.exports = CartsModel;
