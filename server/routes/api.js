var express = require("express");
const path = require("path");
var router = express.Router();

// Handle GET requests to /api route
router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

module.exports = router;
