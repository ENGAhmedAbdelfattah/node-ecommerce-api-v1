const mongoose = require("mongoose");
const setImagesURL = require("./mongoose_MW/setImageURL");

const brandsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minLength: [3, "Category name is too short"],
      maxLength: [32, "Category name is too long"],
    },
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

setImagesURL(brandsSchema, "brands", "image");


  // const setImageURL = (doc) => {
  //   if (doc.image) {
  //     doc.image = `${process.env.BASE_URL}/assets/brands/${doc.image}`;
  //   }
  // };
  // brandsSchema.post("init", (doc) => {
  //   setImageURL(doc);
  // });

  // brandsSchema.post("save", (doc) => {
  //   setImageURL(doc);
  // });
const BrandsModel = mongoose.model("brands", brandsSchema);
module.exports = BrandsModel;
