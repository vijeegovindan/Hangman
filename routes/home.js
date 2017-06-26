// Define my Router
const express = require('express');
const router = express.Router();

// Posting the page
router.post("/", function(req, res){
  req.session.mode = req.body.selLevel;
  res.redirect("/index");
});

//Module Exports
module.exports = router;
