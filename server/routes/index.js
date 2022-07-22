var express = require("express");
const path = require("path");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
  // res.render('index', { title: 'Express' });
});

router.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

module.exports = router;
