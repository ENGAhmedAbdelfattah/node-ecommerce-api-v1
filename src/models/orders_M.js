const mongoose = require("mongoose");
// UsersModel
const ordersSchema = mongoose.Schema(
  {
    user: {
      // may populate it when creating or getting order
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "Order must belong to user"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "products",
        },
        quantity: { type: Number },
        color: String,
        price: Number,
      },
    ],
    taxPrice: { type: Number, default: 0 }, // create route for it in app setting page to make admin edite it
    shippingPrice: { type: Number, default: 0 }, // create route for it in app setting page to make admin edite it
    shippingAddress: {
      details: String,
      phone: Number,
      city: String,
      postalCode: Number,
    },
    totalOrderPrice: { type: Number },
    PaymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
);

ordersSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImage email phone",
  }).populate({
    path: "cartItems.product",
    select: "title imageCover",
  });
  next();
});

const OrdersModel = mongoose.model("orders", ordersSchema);

module.exports = OrdersModel;
