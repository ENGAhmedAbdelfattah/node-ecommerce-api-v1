const {validationResult } = require("express-validator");

const valitatiorMiddleware = [
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = valitatiorMiddleware;
