const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../../util/apiFeatures/apiFeatures");
const ApiError = require("../../util/errors/errorClass");

/**
 * @desc    Get list of document
 * @route   GET /api/v1/{documents}
 * @access  Public
 */
const getAll = (Model, ...searchKeys) =>
  asyncHandler(async (req, res) => {
    const filter = res.locals.filterObject ? res.locals.filterObject : {}; // from setFilterObject_MW
    const countDocuments = await Model.find().countDocuments();
    const documentFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(countDocuments)
      .filter()
      .search(...searchKeys)
      .limitFields()
      .sort();
    const { mongooseQuery, pagination } = documentFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, pagination, data: documents });
  });

/**
 * @desc    Get spicific document
 * @route   GET /api/v1/{documents}/:id
 * @access  Public
 */
const getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document)
      return next(new ApiError(`No document for this id: ${id}`, 404));
    res.status(200).json({ data: document });
  });

/**
 * @desc    Create document
 * @route   POST /api/v1/documents
 * @access  Private
 */
const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

/**
 * @desc    Update spicific document
 * @route   PUT /api/v1/{documents}/:id
 * @access  Private
 */
const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document)
      return next(
        new ApiError(`No document for this id: ${req.params.id}`, 404)
      );
    res.status(200).json({ data: document });
  });

/**
 * @desc    Delete spicific dovument
 * @route   PUT /api/v1/{dovuments}/:id
 * @access  Private
 */
const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const dovument = await Model.findByIdAndDelete(id);
    if (!dovument)
      return next(new ApiError(`No document for this id: ${id}`, 404));
    res.status(204).json({ status: "success" });
  });

/**
 * @desc    Delete spicific dovument
 * @route   PUT /api/v1/{dovuments}/:id
 * @access  Private
 */
const deactivateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(
      req.params.id,
      { active: false },
      {
        new: true,
      }
    );
    if (!document)
      return next(
        new ApiError(`No document for this id: ${req.params.id}`, 404)
      );
    res.status(204).json({ status: "success" });
  });

module.exports = {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  deactivateOne,
};

// note: in most update route in current applications in jobs
// make route for update all fileds expect password
// and make another route for update password only.
