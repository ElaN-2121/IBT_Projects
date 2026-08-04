const express = require("express");
const router = express.Router();
const { analyzeThreatActor } = require("../controllers/attributionController");

router.post("/", analyzeThreatActor);

module.exports = router;