const express = require("express");
const router = express.Router();
const { createVulnerability, deleteVulnerability, getAllVulnerabilities, getVulnerability, updateVulnerability } = require("../controllers/vulnController");
const requireAuth  = require("../middleware/authMiddleware");

router.post("/", requireAuth, createVulnerability);
router.get("/", requireAuth, getAllVulnerabilities);
router.get("/:id",requireAuth,  getVulnerability);
router.put("/:id", requireAuth, updateVulnerability);
router.delete("/:id",requireAuth,  deleteVulnerability);

module.exports = router;