const BrandsModel = require("../models/brands_M");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory/CURDFactory");

/**
 * @desc    Get list of brands
 * @route   GET /api/v1/brands
 * @access  Public/Admin-Manager-User
 */
const getBrands = getAll(BrandsModel, "name");

/**
 * @desc    Get spicific brands
 * @route   GET /api/v1/brands/:id
 * @access  Public/Admin-Manager-User
 */
const getBrand = getOne(BrandsModel);

/**
 * @desc    Create brands
 * @route   POST /api/v1/brands
 * @access  Private/Admin-Manager-User
 */
const postBrand = createOne(BrandsModel);

/**
 * @desc    Update spicific brands
 * @route   PUT /api/v1/brands/:id
 * @access  Private/Admin-Manager
 */
const updateBrand = updateOne(BrandsModel);

/**
 * @desc    Delete spicific brand
 * @route   PUT /api/v1/brands/:id
 * @access  Private/Admin
 */
const deleteBrand = deleteOne(BrandsModel);

module.exports = {
  getBrands,
  getBrand,
  postBrand,
  updateBrand,
  deleteBrand,
};
