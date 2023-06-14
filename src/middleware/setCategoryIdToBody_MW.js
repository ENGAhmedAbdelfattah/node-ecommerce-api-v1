// Nesting router (create)
const setCategoryIdToBodyMiddleware = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.idcategory; // used in post Route in subCategories_R.js
  next();
};

module.exports = setCategoryIdToBodyMiddleware;
