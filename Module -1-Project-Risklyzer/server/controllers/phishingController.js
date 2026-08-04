const phishing = require("../models/PhishingCase");
const analyzePhishing = require("../services/phishingScoring");

const createPhishing = async (req, res) => {
    try{
        const { senderEmail, subject, body, linkText, linkUrl } = req.body;

        const newPhishing = new phishing({
            senderEmail,
            subject,
            body,
            linkText,
            linkUrl
        });

        const savedPhish = await newPhishing.save();
        const { score, flags } = analyzePhishing(savedPhish);

        res.status(201).json({ ...savedPhish._doc, score, flags });

    } catch (err) {
        res.status(500).json({error: err.message});
    }  
};

const getPhishing = async (req, res) => {
    try {
        const allPhish = await phishing.find({});
        const results = allPhish.map(phish => {
            const { score, flags } = analyzePhishing(phish);
            return { ...phish._doc, score, flags };
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getPhishingById = async (req, res) => {
    try{
        const {id} = req.params;
        const phish = await phishing.findOne({_id: id});
        if (!phish) {
                return res.status(404).json({message: "Phishing not found"});
            }
            res.status(200).json({message: "Phishing found", phish});

    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

const deletePhishingCase = async (req, res) =>  {
    try{
        const {id} = req.params;
        const deletedPhish = await phishing.findOneAndDelete({_id: id});
        if (!deletedPhish) {
            return res.status(404).json({message: "Phishing not found"});
        }
        res.status(200).json({message: "Phishing deleted successfully"});

    } catch (err) {
        res.status(500).json({error: err.message});
    }

}

module.exports = {
    createPhishing,
    getPhishing, 
    getPhishingById,
    deletePhishingCase
};
