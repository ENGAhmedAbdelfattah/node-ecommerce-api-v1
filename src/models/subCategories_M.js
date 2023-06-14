const mongoose = require("mongoose");

const subCategoriesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name of subCategory is required"],
      unique: [true, "SubCategory must be unique"],
      minLength: [2, "Too short subCategory name"],
      maxLength: [32, "Too long subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: [true, "SubCategory must be belong to main category"],
    },
  },
  {
    timestamps: true,
  }
);

const SubCategoriesModel = mongoose.model("subCategories", subCategoriesSchema);

module.exports = SubCategoriesModel;
