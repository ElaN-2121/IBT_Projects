const criticalityScore = {
    Low: 2,
    Medium: 4,
    High: 7,
    Critical: 10
};

const exposureScore = {
    Internal:2,
    'Internet-facing':5
};

const exploitAvailabilityScore = {
    None: 0,
    PoC: 3,
    Active: 7
};

const dataSensitivityScore = {
    Public: 2,
    Internal: 4,
    Confidential: 7,
    Restricted: 10
};

function calculateRiskScore(vulnerability) {
    const criticality = criticalityScore[vulnerability.assetCriticality] || 0;
    const exposure = exposureScore[vulnerability.exposure] || 0;
    const exploitAvailability = exploitAvailabilityScore[vulnerability.exploitAvailability] || 0;
    const dataSensitivity = dataSensitivityScore[vulnerability.dataSensitivity] || 0;
    const cvssScore = vulnerability.cvssScore || 0;

    const score = (cvssScore * 0.3)
      + (criticality * 0.25)
      + (exploitAvailability * 0.25)
      + (exposure * 0.1)
      + (dataSensitivity * 0.1)

    return Math.round(score * 100) / 100;
};

module.exports = {
    criticalityScore,
    exposureScore,
    exploitAvailabilityScore,
    dataSensitivityScore,
    calculateRiskScore
};