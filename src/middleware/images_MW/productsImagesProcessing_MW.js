const { mkdirp } = require("mkdirp");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const {
  uploadToCloudinary,
} = require("../../util/cloudinary/uploadToCloudinary");

const productsImageProcessingMiddleware = asyncHandler(
  async (req, res, next) => {
    // 1- imageCover
    if (req.files) {
      if (req.files.imageCover && req.files.imageCover[0].buffer) {
        const fileAfterSharp = await sharp(req.files.imageCover[0].buffer)
          .resize(2000, 1333) //2000 * 1333 standard for image cover
          .toFormat("jpeg")
          .jpeg({ quality: 95 }) //95%
          .toBuffer();

        const uploadedUrl = await uploadToCloudinary(
          fileAfterSharp,
          "image/jpeg"
        );
        const imageCoverFileName = uploadedUrl;
        // const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        // const saveFolder = `./app/uploads/products`;

        // await mkdirp(saveFolder);
        // await sharp(req.files.imageCover[0].buffer)
        //   .resize(2000, 1333) //2000 * 1333 standard for image cover
        //   .toFormat("jpeg")
        //   .jpeg({ quality: 95 }) //95%
        //   .toFile(`${saveFolder}/${imageCoverFileName}`);

        req.body.imageCover = imageCoverFileName;
      }
      // 2- images
      if (req.files.images) {
        req.body.images = [];
        await Promise.all(
          await req.files.images.map(async (image, index) => {
            if (image.buffer) {
              const fileAfterSharp = await sharp(image.buffer)
                .resize(600, 600) //2000 * 1333 standard for image
                .toFormat("jpeg")
                .jpeg({ quality: 90 }) //90%
                .toBuffer();

              const uploadedUrl = await uploadToCloudinary(
                fileAfterSharp,
                "image/jpeg"
              );
              const imageFileName = uploadedUrl;
              // const imageFileName = `product-${uuidv4()}-${Date.now()}-${
              //   index + 1
              // }.jpeg`;
              // const saveFolder = `uploads/products`;

              // await mkdirp(saveFolder);
              // await sharp(image.buffer)
              //   .resize(600, 600) //2000 * 1333 standard for image
              //   .toFormat("jpeg")
              //   .jpeg({ quality: 90 }) //90%
              //   .toFile(`${saveFolder}/${imageFileName}`);

              req.body.images.push(imageFileName);
            }
          })
        );
      }
    }

    next();
  }
);

module.exports = productsImageProcessingMiddleware;
