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

router.post("/", createIncident);
router.get("/", getIncidents);
router.get("/:id", getIncidentById);
router.post("/:id/events", addEventToIncident);
router.delete("/:id", deleteIncident);
router.patch("/:incidentId/events/:eventId", updateEventIncident);
router.delete("/:incidentId/events/:eventId", deleteEventFromIncident);
module.exports = router;