const mongoose = require("mongoose");
const setImagesURL = require("./mongoose_MW/setImageURL");

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minLength: [3, "Category name is too short"],
      maxLength: [32, "Category name is too long"],
    },
    // A and B => a_and_B
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

setImagesURL(categoriesSchema, "categories", "image");

// const setImageURL = (doc) => {
//   if (doc.image) {
//     doc.image = `${process.env.BASE_URL}/assets/categories/${doc.image}`;
//   }
// };
// categoriesSchema.post("init", (doc) => {
//   setImageURL(doc);
// });

// categoriesSchema.post("save", (doc) => {
//   setImageURL(doc);
// });

const CategoriesModel = mongoose.model("categories", categoriesSchema);
module.exports = CategoriesModel;
