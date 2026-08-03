const Incident = require('../models/Incident');
const suggestStage = require('../services/killChainClassifier');

const createIncident = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newIncident = new Incident ({ title, description});
        const savedIncident = await newIncident.save()
        res.status(201).json({message: "Incident registered successfully.", ...savedIncident._doc})
    }catch (err) {
        res.status(500).json({ err: "Failed to create the incident"})
    }
};

const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find({})
        res.status(200).json({message: "Incidents loaded successfully.", incidents})
    }catch (err) {
        res.status(500).json({ error: "Unable to load the incident"})       
    }
};

const getIncidentById = async (req, res) => {
    try {
        const {id} = req.params
        const incident = await Incident.findOne({_id: id});
        if (!incident) {
            return res.status(404).json({message: "Incident not found"});
        }
        res.status(200).json({ incident})
    }catch (err) {
        res.status(500).json({ error: "Unable to load the incident"})       
    }
};

const addEventToIncident = async ( req, res ) => {
    try {
        const {id} = req.params;
        const {description, timestamp, stage, wasDetectedAtTime, relatedVulnerability } = req.body;
        const incident = await Incident.findOne({_id: id});

        if (!incident) {
            return res.status(404).json({message: "Incident Event not found"});
        }

        const suggested = suggestStage(description);

        const newEvent = {
            description,
            timestamp, 
            stage,
            suggestedStage: suggested,
            wasDetectedAtTime,
            relatedVulnerability
        };

        incident.events.push(newEvent)
        await incident.save()
        res.status(201).json(incident);
    }catch (err) {
        console.error(err);   // <-- add this line temporarily
        res.status(500).json({ error: "Failed to add event to incident" });
    }
};

const updateEventIncident = async (req, res) => {
    try{
        const {incidentId, eventId} = req.params;
        const updatedData = req.body;

        const incident = await Incident.findById(incidentId);

        if (!incident) {
            return res.status(404).json({error: "Event not found"})
        }

        const event = incident.events.id(eventId)

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        Object.assign(event, updatedData);

        if (updatedData.description) {
            event.suggestedStage = suggestStage(event.description);
        }

        await incident.save();

        res.status(200).json(incident);
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update event" });
}
};

const deleteEventFromIncident = async (req, res) => {
    try {
        const { incidentId, eventId } = req.params;

        const incident = await Incident.findById(incidentId);
        if (!incident) {
            return res.status(404).json({ message: "Incident not found" });
        }

        const event = incident.events.id(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        event.deleteOne();
        await incident.save();

        res.status(200).json(incident);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete event" });
    }
};

const deleteIncident = async (req, res) => {
    try {
        const {id}  =req.params;
        const deletedIncident = await Incident.findOneAndDelete({_id: id});
        if (!deletedIncident){
            return res.status(404).json({message: "Incident Not Found"});
        }
        res.status(200).json({message: "Incident Deleted Successfully"});
    }catch (err) {
        return res.status(500).json({ message: "Server Unreachable"});
    }
};

module.exports = {
    createIncident,
    getIncidents,
    getIncidentById,
    addEventToIncident, 
    deleteIncident,
    updateEventIncident,
    deleteEventFromIncident
};