const { mkdirp } = require("mkdirp");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const userImageProcessingMiddleware = asyncHandler(async (req, res, next) => {
  if (req.file && req.file.buffer) {
    const imageFileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
    const saveFolder = `./app/uploads/users`;
    await mkdirp(saveFolder);
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 }) //90%
      .toFile(`${saveFolder}/${imageFileName}`);
    req.body.profileImage = imageFileName;
  }

  next();
});

module.exports = userImageProcessingMiddleware;
