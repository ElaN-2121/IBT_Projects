const express = require("express");
const router = express.Router();

const {createIncident,
  getIncidents,
  getIncidentById,
  addEventToIncident,
  deleteIncident,
  updateEventIncident,
  deleteEventFromIncident
} = require("../controllers/killChainController");
const requireAuth  = require("../middleware/authMiddleware");


router.post("/", requireAuth, createIncident);
router.get("/", requireAuth, getIncidents);
router.get("/:id",requireAuth, getIncidentById);
router.post("/:id/events",requireAuth, addEventToIncident);
router.delete("/:id",requireAuth, deleteIncident);
router.patch("/:incidentId/events/:eventId", requireAuth, updateEventIncident);
router.delete("/:incidentId/events/:eventId", requireAuth, deleteEventFromIncident);
module.exports = router;