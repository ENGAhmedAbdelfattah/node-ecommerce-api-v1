const multer = require("multer");
const ApiError = require("../../util/errors/errorClass");
// const { v4: uuidv4 } = require("uuid");
//  u can uuid package to get unique id or use id of user when login
//  get "mimetype" from req object ex: jpeg

const uploadImagesMiddleware = (method = "single", fields) => {
  // if (method === "fields") {
  //   fieldsArr = fields || [];
  // }
  
  // 1 - DiskStorage engine
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     // category-${id}-Date.now.${mimetype}
  //     const mimetype = file.mimetype.split("/")[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}.${mimetype}`;
  //     cb(null, filename);
  //   },
  // });
  // 2 - MulterFilter
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      return cb(null, true);
    }
    cb(new ApiError("Only Image Allowed", 400), false);
  };

  // 1 - memoryStorage engine
  const multerStorage = multer.memoryStorage();

  // const upload = multer({ dest: "uploads/categories" });
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload[method](fields);
};

module.exports = { uploadImagesMiddleware };
