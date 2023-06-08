const mongoose = require("mongoose");
const setImagesURL = require("./mongoose_MW/setImageURL");
const populateMongoose = require("./mongoose_MW/populate");

const productsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Product Title is required"],
      minLength: [3, "Too short product name"],
      maxLength: [100, "Too long product name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Product desciption is required"],
      minLength: [20, "Too short product desciption"],
      maxLength: [2000, "Too long product desciption"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      max: [200_000, "Product price is very high"],
    },
    priceAfterDicount: {
      type: Number,
      max: [200_000, "Product price is very high"],
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],
    ratingsAverage: {
      type: Number,
      min: [1, "Rating range mast be between or equal 1 to 5"],
      max: [5, "Rating range mast be between or equal 1 to 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: [true, "Products must be belong to main category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategories",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brands",
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose Middleware
populateMongoose(productsSchema, "category", "name -_id");
// productsSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "category",
//     select: "name -_id",
//   });
//   next();
// });

setImagesURL(productsSchema, "products", "imageCover", "images");

// const setImageURL = (doc) => {
//   if (doc.imageCover) {
//     doc.imageCover = `${process.env.BASE_URL}/assets/products/${doc.imageCover}`;
//   }
//   if (doc.images) {
//     const listImages = [];
//     doc.images.forEach((image) => {
//       const imageURL = `${process.env.BASE_URL}/assets/products/${image}`;
//       listImages.push(imageURL);
//     });
//     doc.images = listImages;
//   }
// };

// productsSchema.post("init", (doc) => {
//   setImageURL(doc);
// });

// productsSchema.post("save", (doc) => {
//   setImageURL(doc);
// });

const ProductsModel = mongoose.model("products", productsSchema);

module.exports = ProductsModel;
