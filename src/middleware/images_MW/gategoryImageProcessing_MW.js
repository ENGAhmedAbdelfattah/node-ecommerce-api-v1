const { mkdirp } = require("mkdirp");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const {
  uploadToCloudinary,
} = require("../../util/cloudinary/uploadToCloudinary");

const gategoryImageProcessingMiddleware = asyncHandler(
  async (req, res, next) => {
    if (req.file && req.file.buffer) {
      const fileAfterSharp = await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 }) //90%
        .toBuffer();

      const uploadedUrl = await uploadToCloudinary(
        fileAfterSharp,
        "image/jpeg"
      );
      const imageFileName = uploadedUrl;

      // const imageFileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
      // const saveFolder = `./app/uploads/categories`;

      // await mkdirp(saveFolder);
      // await sharp(req.file.buffer)
      //   .resize(600, 600)
      //   .toFormat("jpeg")
      //   .jpeg({ quality: 90 }) //90%
      //   .toFile(`${saveFolder}/${imageFileName}`);

      req.body.image = imageFileName;
    }

    next();
  }
);

module.exports = gategoryImageProcessingMiddleware;
