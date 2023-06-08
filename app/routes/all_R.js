const express = require("express");
const allController = require("../controllers/all_C");

const router = express.Router();
router.all("*", allController);

module.exports = router;
