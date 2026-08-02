const express = require("express");
const router = express.Router();
const { createVulnerability, deleteVulnerability, getAllVulnerabilities, getVulnerability, updateVulnerability } = require("../controllers/vulnController");
const requireAuth  = require("../middleware/authMiddleware");

router.post("/", createVulnerability);
router.get("/", getAllVulnerabilities);
router.get("/:id", getVulnerability);
router.put("/:id", updateVulnerability);
router.delete("/:id", deleteVulnerability);

module.exports = router;