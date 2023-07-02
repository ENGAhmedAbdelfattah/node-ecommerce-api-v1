// Nesting router (GET)
const setNestingFilterObjectMiddleware =
  (field, IdParentField) => (req, res, next) => {
    const { [IdParentField]: IdParent } = req.params; // destructering by variable should give new name for this variable or the same it because {q} = obj is shorthand for {q:q} = obj
    res.locals.filterObject = IdParent ? { [field]: IdParent } : {}; //used in getAll method in CURDFactory.js for getAll for subCategories and reviews
    next();
  };

module.exports = setNestingFilterObjectMiddleware;
