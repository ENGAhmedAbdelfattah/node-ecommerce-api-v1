const CategoriesModel = require("../models/categories_M");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory/CURDFactory");

/**
 * @desc    Get list of categories
 * @route   GET /api/v1/categories
 * @access  Public/Admin-Manager-User
 */
const getCategories = getAll(CategoriesModel, "name");

/**
 * @desc    Get spicific category
 * @route   GET /api/v1/categories/:id
 * @access  Public/Admin-Manager-User
 */
const getCategory = getOne(CategoriesModel);

/**
 * @desc    Create category
 * @route   POST /api/v1/categories
 * @access  Private/Admin-Manager
 */
const postCategory = createOne(CategoriesModel);

/**
 * @desc    Update spicific category
 * @route   PUT /api/v1/categories/:id
 * @access  Private/Admin-Manager
 */
const updateCategory = updateOne(CategoriesModel);

/**
 * @desc    Delete spicific category
 * @route   PUT /api/v1/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = deleteOne(CategoriesModel);

module.exports = {
  getCategories,
  getCategory,
  postCategory,
  updateCategory,
  deleteCategory,
};
