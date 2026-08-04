const { attributeThreatActor } = require("../services/attributionEngine");

const analyzeThreatActor = (req, res) => {
  try {
    const { sophistication, motivation, targetSelection, persistence, attributionSignal } = req.body;

    if (!sophistication || !motivation || !targetSelection || !persistence || !attributionSignal) {
      return res.status(400).json({ error: "All five fields are required" });
    }

    const result = attributeThreatActor({
      sophistication,
      motivation,
      targetSelection,
      persistence,
      attributionSignal
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyzeThreatActor };