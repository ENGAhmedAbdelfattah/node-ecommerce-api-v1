const SubCategoriesModel = require("../models/subCategories_M");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory/CURDFactory");

/**
 * @desc    Get list of subcategories
 * @route   GET /api/v1/subcategories
 * @access  Public/Admin-Manager-User
 */
const getSubCategories = getAll(SubCategoriesModel, "name");

/**
 * @desc    Get spicific subcategory
 * @route   GET /api/v1/subcategories/:id
 * @access  Public/Admin-Manager-User
 */
const getSubCategory = getOne(SubCategoriesModel);

/**
 * @desc    Create subcategory
 * @route   POST /api/v1/subcategories
 * @access  Private/Admin-Manager
 */
const postSubCategory = createOne(SubCategoriesModel);

/**
 * @desc    Update spicific subcategory
 * @route   PUT /api/v1/subcategories/:id
 * @access  Private/Admin-Manager
 */
const updateSubCategory = updateOne(SubCategoriesModel);

/**
 * @desc    Delete spicific subcategory
 * @route   PUT /api/v1/subcategories/:id
 * @access  Private/Admin
 */
const deleteSubCategory = deleteOne(SubCategoriesModel);

module.exports = {
  getSubCategories,
  getSubCategory,
  postSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
