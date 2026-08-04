const {
    createPhishing,
    getPhishing, 
    getPhishingById,
    deletePhishingCase
}  = require("../controllers/phishingController");

const express = require("express");
const router = express.Router()

router.get("/", getPhishing);
router.get("/:id", getPhishingById);
router.post("/", createPhishing );
router.delete("/:id", deletePhishingCase)

module.exports = router;