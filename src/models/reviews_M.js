const mongoose = require("mongoose");
const populateMongoose = require("./mongoose_MW/populate");
const ProductsModel = require("./products_M");

const reviewSchema = mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      min: [1, "Minimum rate value is 1.0"],
      max: [5, "Maximum rate value is 5.0"],
      required: [true, "Review rating required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "Review must belong to user"],
    },
    // parent referance (product=>parent contain several reviews) => when [] alote #(one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "products",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

populateMongoose(reviewSchema, "user", "name");
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  // this =>is reviews model, if console.log(this) print reviews collections
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  // console.log("result", result);
  if (result.length > 0) {
    await ProductsModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await ProductsModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  await this.model.calcAverageRatingsAndQuantity(doc.product);
});

const ReviewsModel = mongoose.model("reviews", reviewSchema);
module.exports = ReviewsModel;

// schema.post(/Many$/, function (res) {
//   console.log("this fired after you ran `updateMany()` or `deleteMany()`");
// });

// await this.schema.statics.calcAverageRatingsAndQuantity(this.product);
// (async function (productId) {
//   const result = await reviewSchema.aggregate([
//     {
//       $match: { product: productId },
//     },
//     {
//       $group: {
//         _id: "$product",
//         avgRatings: { $avg: "$ratings" },
//         ratingsQuantity: { $sum: 1 },
//       },
//     },
//   ]);
//   // console.log("result", result);
//   if (result.length > 0) {
//     await ProductsModel.findByIdAndUpdate(productId, {
//       ratingsAverage: result[0].avgRatings,
//       ratingsQuantity: result[0].ratingsQuantity,
//     });
//   } else {
//     await ProductsModel.findByIdAndUpdate(productId, {
//       ratingsAverage: 0,
//       ratingsQuantity: 0,
//     });
//   }
// })();
