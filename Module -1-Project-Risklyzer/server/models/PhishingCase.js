const mongoose = require('mongoose');

const PhishingCaseSchema = mongoose.Schema({
    senderEmail: { type: String, required: true },
    subject: { type: String, required: true},
    body: { type: String, required: true},
    linkText: { type: String, default: ""},
    linkUrl: { type: String, default:""}
}, { timestamps: true });

module.exports = mongoose.model("PhishingCase", PhishingCaseSchema);