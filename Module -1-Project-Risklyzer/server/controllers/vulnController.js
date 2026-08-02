const Vulnerability = require('../models/Vulnerability');
const {calculateRiskScore} = require('../services/vulnScoring');


const createVulnerability = async (req, res) => {
    try{
        const {name, cveId, cvssScore, assetCriticality, exposure, exploitAvailability, dataSensitivity} = req.body;

        const newVulnerability = new Vulnerability({
            name,
            cveId,
            cvssScore,
            assetCriticality,
            exposure,
            exploitAvailability,
            dataSensitivity
        });

        const savedVuln = await newVulnerability.save();
        const riskScore = calculateRiskScore(savedVuln);

        res.status(201).json({ ...savedVuln._doc, riskScore });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllVulnerabilities = async (req, res) => {
    try{
        const vulnerabilities = await Vulnerability.find({});
        const results = vulnerabilities.map(vuln => ({
        ...vuln._doc,
        riskScore: calculateRiskScore(vuln)
        }));
        res.status(200).json(results);
    }catch (err) {
        console.error(err);
        res.status(500).json({error: "An error occurred while fetching vulnerabilities."});
    }
    
};

const getVulnerability = async (req, res) => {
    try{
            const {id} = req.params;
            const vulnerability = await Vulnerability.findOne({_id: id});
            const riskScore = vulnerability ? calculateRiskScore(vulnerability) : null;
            if (!vulnerability) {
                return res.status(404).json({message: "Vulnerability not found"});
            }
            res.status(200).json({message: "Vulnerability found", vulnerability, riskScore});
    }catch(err){
        console.error(err)
        res.status(500).json({error: "An error occurred while fetching the vulnerability."});
    }
};

const updateVulnerability = async (req, res) => {
    try{
        const {id} = req.params;
        const updates = req.body;

        const updatedVuln = await Vulnerability.findOneAndUpdate({_id: id}, updates, {new: true});
        if (!updatedVuln) {
            return res.status(404).json({message: "Vulnerability not found"});
        }
        res.status(200).json(updatedVuln);
    }catch(err){
        console.error(err)
        res.status(500).json({error: "An error occurred while updating the vulnerability."});
    }
};

const deleteVulnerability = async (req, res) => {
    try{
        const {id} = req.params;
        const deletedVuln = await Vulnerability.findOneAndDelete({_id: id});
        if (!deletedVuln) {
            return res.status(404).json({message: "Vulnerability not found"});
        }
        res.status(200).json({message: "Vulnerability deleted successfully"});
    }catch(err){
        console.error(err)
        res.status(500).json({error: "An error occurred while deleting the vulnerability."});
    }  
};

module.exports = {
    createVulnerability,
    deleteVulnerability,
    getAllVulnerabilities,
    getVulnerability,
    updateVulnerability
}
