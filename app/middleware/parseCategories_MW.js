const parseCategoriesMiddleware = (req, res, next) => {
  if (req.body.subcategories && typeof req.body.subcategories === "string")
    req.body.subcategories = Array.from(JSON.parse(req.body.subcategories));
  next();
};

module.exports = parseCategoriesMiddleware;
