const {
    createPhishing,
    getPhishing, 
    getPhishingById,
    deletePhishingCase
}  = require("../controllers/phishingController");
const requireAuth  = require("../middleware/authMiddleware");


const express = require("express");
const router = express.Router()

router.get("/", requireAuth, getPhishing);
router.get("/:id", requireAuth, getPhishingById);
router.post("/",  requireAuth, createPhishing );
router.delete("/:id", requireAuth, deletePhishingCase)

module.exports = router;