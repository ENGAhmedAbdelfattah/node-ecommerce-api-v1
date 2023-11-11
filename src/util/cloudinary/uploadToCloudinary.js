const asyncHandler = require("express-async-handler");
const { cloudinary } = require("./cloudinary");

const uploadToCloudinary = async (fileBuffer, mimetype) => {
  if (fileBuffer) {
    const b64 = Buffer.from(fileBuffer).toString("base64");
    const dataURI = `data:${mimetype};base64,${b64}`;
    const imageUploaded = await cloudinary.uploader.upload(dataURI);

    console.log("imageUploaded.secure_url", imageUploaded.secure_url);
    if (imageUploaded) return imageUploaded.secure_url; //  we will save secure_url to DB
  }
};

module.exports = { uploadToCloudinary };
