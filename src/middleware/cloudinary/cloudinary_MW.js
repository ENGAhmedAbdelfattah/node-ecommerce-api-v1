const asyncHandler = require("express-async-handler");
const { cloudinary } = require("../../util/cloudinary/cloudinary");

const uploadToCloudinary = asyncHandler(async (req, res, next) => {
  if (req.file && req.file.buffer) {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const imageUploaded = await cloudinary.uploader.upload(
      dataURI,
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Error: Fail upload Images to cloudinary",
          });
        }
      }
    );
    //  secure_url => save to DB
  }
  next();
});

module.exports = uploadToCloudinary;
