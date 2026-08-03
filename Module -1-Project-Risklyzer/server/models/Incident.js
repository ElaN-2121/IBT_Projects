const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    description: { type: String, required: true},
    timestamp: { type: Date, required: true },
    stage: { type: String, enum: ['Reconnaissance', 'Weaponization', 'Delivery', 'Exploitation', 'Installation', 'Command and Control', 'Actions on Objectives'], required: true },
    suggestedStage: { type: String, enum: ['Reconnaissance', 'Weaponization', 'Delivery', 'Exploitation', 'Installation', 'Command and Control', 'Actions on Objectives'] },
    wasDetectedAtTime: { type: Boolean, required: true },
    relatedVulnerability: { type: mongoose.Schema.Types.ObjectId, ref: 'Vulnerability'}

});

const incidentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    events: [eventSchema],
}, { timestamps: true}
);

const Incident = mongoose.model('Incident', incidentSchema);
module.exports = Incident;