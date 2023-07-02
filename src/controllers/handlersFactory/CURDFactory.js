const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const ApiFeatures = require("../../util/apiFeatures/apiFeatures");
const ApiError = require("../../util/errors/errorClass");

/**
 * @desc    Get list of document
 * @route   GET /api/v1/{documents}
 * @access  Public
 */
const getAll = (Model, ...searchKeys) =>
  asyncHandler(async (req, res) => {
    const { filterObject } = res.locals; // from setFilterObject_MW
    const filter = filterObject ? filterObject : {};
    const countDocuments = await Model.find().countDocuments(); // from me: Is add filter here ?
    // 1) build query
    const documentFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(countDocuments)
      .filter()
      .search(...searchKeys)
      .limitFields()
      .sort();
    const { mongooseQuery, pagination } = documentFeatures;
    // 2) execute query
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
const getOne = (Model, populationOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { filterObject } = res.locals;
    const filter = filterObject ? { _id: id, ...filterObject } : { _id: id }; // from setFilterObject_MW
    // 1)bulid query
    let query = Model.findOne(filter);
    if (populationOptions) query = query.populate(populationOptions);
    // 2) execute query
    const document = await query;
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
const updateOne = (Model, deleteFields, options) =>
  asyncHandler(async (req, res, next) => {
    let bodyClone = { ...req.body };
    if (deleteFields) {
      deleteFields.forEach((field) => {
        delete bodyClone[`${field}`];
      });
    }
    if (options?.passowrdOnly === true) {
      bodyClone = {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      };
      // 2) generate new token
      // because time of change password > time of old token so create token to be logined to logout in protect function in auth_C ✔️
      // and then redirect on client side to logining page to reloginen again ( generate new token ) ✔️
    }

    const document = await Model.findByIdAndUpdate(req.params.id, bodyClone, {
      new: true,
    });

    if (!document)
      return next(
        new ApiError(`No document for this id: ${req.params.id}`, 404)
      );
    // Trigger "save" event when update document (which emit on mongoose post("save", ) middleware)
    await document.save();
    res.status(200).json({ status: "success", data: document });
  });

/**
 * @desc    Delete spicific document
 * @route   PUT /api/v1/{documents}/:id
 * @access  Private
 */
const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document)
      return next(new ApiError(`No document for this id: ${id}`, 404));
    res.status(204).json({ status: "success" });
  });

/**
 * @desc    Delete spicific document
 * @route   PUT /api/v1/{documents}/:id
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

// const getOne = (Model, populationOptions) =>
//   asyncHandler(async (req, res, next) => {
//     const filter = res.locals.filterObject ? res.locals.filterObject : {}; // from setNestingFilterObject_MW
//     const { id } = req.params;
//     // 1)bulid query
//     let query = Model.find({
//       $and: [filter, { _id: id }], //Error, should check if filter exist and correct
//     });
//     // let query = Model.findById(id);
//     if (populationOptions) query = query.populate(populationOptions);
//     // 2) execute query
//     const document = await query;
//     if (!document)
//       return next(new ApiError(`No document for this id: ${id}`, 404));
//     res.status(200).json({ data: document });
//   });
