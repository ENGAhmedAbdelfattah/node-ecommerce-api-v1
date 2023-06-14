const ProductsModel = require("../models/products_M");

const {
  updateOne,
  deleteOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory/CURDFactory");

/**
 * @desc    Get list of products
 * @route   GET /api/v1/products
 * @access  Public/Admin-Manager-User
 */
const getProducts = getAll(ProductsModel, "title", "description");

/**
 * @desc    Get spicific product
 * @route   GET /api/v1/products/:id
 * @access  Public/Admin-Manager-User
 */
const getProduct = getOne(ProductsModel);

/**
 * @desc    Create product
 * @route   POST /api/v1/products
 * @access  Private/Admin-Manager
 */
const postProduct = createOne(ProductsModel);

/**
 * @desc    Update spicific product
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin-Manager
 */
const updateProduct = updateOne(ProductsModel);

/**
 * @desc    Delete spicific product
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin
 */
const deleteProduct = deleteOne(ProductsModel);

module.exports = {
  getProducts,
  getProduct,
  postProduct,
  updateProduct,
  deleteProduct,
};
