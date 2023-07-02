// Nesting router (create)
const setNestingParentIdToBodyMiddleware =
  (field, IdParent, userField) => (req, res, next) => {
    if (!req.body[field]) req.body[field] = req.params[IdParent]; // used in post Route in subCategories_R.js and review_R.js
    if (userField === true && !req.body.user) req.body.user = req.user._id; // when it is protect route
    next();
  };

module.exports = setNestingParentIdToBodyMiddleware;