const { check } = require("express-validator");
const valitatiorMiddleware = require("../../middleware/validator_MW");
const ProductsModel = require("../../models/products_M");

const idRules = check("productId")
  .isMongoId()
  .withMessage("Invalid product id format");

const creatRules = check("productId")
  .isMongoId()
  .withMessage("Invalid product id format")
  .notEmpty()
  .withMessage("productId required")
  .custom(async (productId) => {
    const product = await ProductsModel.findById(productId);
    if (!product)
      throw new Error(`There is no product with this is id: ${productId}`);
    return true;
  });

const addToWishlistValitatior = [creatRules, valitatiorMiddleware];
const removeFromWishlistValitatior = [idRules, valitatiorMiddleware];

module.exports = {
  addToWishlistValitatior,
  removeFromWishlistValitatior,
};
