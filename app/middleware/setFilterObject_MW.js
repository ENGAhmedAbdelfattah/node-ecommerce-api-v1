// Nesting router (GET)
const setFilterObjectMiddleware = (req, res, next) => {
  const { idcategory } = req.params;
  res.locals.filterObject = idcategory ? { category: idcategory } : {}; //used in getAll method in CURDFactory.js
  next();
};

module.exports = setFilterObjectMiddleware;
