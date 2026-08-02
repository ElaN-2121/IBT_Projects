import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getVulnerabilityById, updateVulnerability, deleteVulnerability } from "../utils/api";

const criticalityScore = { Low: 2, Medium: 4, High: 7, Critical: 10 };
const exposureScore = { Internal: 2, "Internet-facing": 5 };
const exploitAvailabilityScore = { None: 0, PoC: 3, Active: 7 };
const dataSensitivityScore = { Public: 2, Internal: 4, Confidential: 7, Restricted: 10 };

function VulnDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vuln, setVuln] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVulnerabilityById(id)
      .then((data) => {
        setVuln(data.vulnerability);
        setRiskScore(data.riskScore);
        setFormData(data.vulnerability);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updated = await updateVulnerability(id, formData);
      setVuln(updated);
      setIsEditing(false);
      // recalculate displayed score locally after edit
      const newScore =
        Number(updated.cvssScore) * 0.3 +
        (criticalityScore[updated.assetCriticality] || 0) * 0.25 +
        (exploitAvailabilityScore[updated.exploitAvailability] || 0) * 0.25 +
        (exposureScore[updated.exposure] || 0) * 0.1 +
        (dataSensitivityScore[updated.dataSensitivity] || 0) * 0.1;
      setRiskScore(Math.round(newScore * 100) / 100);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this vulnerability?")) return;
    try {
      await deleteVulnerability(id);
      navigate("/vulns");
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p className="error-text">{error}</p>;
  if (!vuln) return <p>Loading...</p>;

  const breakdown = [
    { label: "CVSS Score", raw: vuln.cvssScore, weight: 0.3, points: Number(vuln.cvssScore) },
    { label: "Asset Criticality", raw: vuln.assetCriticality, weight: 0.25, points: criticalityScore[vuln.assetCriticality] || 0 },
    { label: "Exploit Availability", raw: vuln.exploitAvailability, weight: 0.25, points: exploitAvailabilityScore[vuln.exploitAvailability] || 0 },
    { label: "Exposure", raw: vuln.exposure, weight: 0.1, points: exposureScore[vuln.exposure] || 0 },
    { label: "Data Sensitivity", raw: vuln.dataSensitivity, weight: 0.1, points: dataSensitivityScore[vuln.dataSensitivity] || 0 },
  ];

  return (
    <div className="vuln-detail">
      <Link to="/vulns" className="back-link">&larr; Back to list</Link>

      {!isEditing ? (
        <>
          <h1>{vuln.name}</h1>
          <p className="vuln-meta">{vuln.cveId}</p>
          <div className="risk-score-badge">Risk Score: {riskScore}</div>

          <table className="breakdown-table">
            <thead>
              <tr><th>Factor</th><th>Value</th><th>Score</th><th>Weight</th><th>Contribution</th></tr>
            </thead>
            <tbody>
              {breakdown.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.raw}</td>
                  <td>{row.points}</td>
                  <td>{row.weight}</td>
                  <td>{(row.points * row.weight).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="detail-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} className="danger">Delete</button>
          </div>
        </>
      ) : (
        <div className="vuln-form">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input name="cveId" value={formData.cveId} onChange={handleChange} placeholder="CVE ID" />
          <input name="cvssScore" value={formData.cvssScore} onChange={handleChange} placeholder="CVSS Score" />
          <input name="assetCriticality" value={formData.assetCriticality} onChange={handleChange} placeholder="Asset Criticality" />
          <input name="exposure" value={formData.exposure} onChange={handleChange} placeholder="Exposure" />
          <input name="exploitAvailability" value={formData.exploitAvailability} onChange={handleChange} placeholder="Exploit Availability" />
          <input name="dataSensitivity" value={formData.dataSensitivity} onChange={handleChange} placeholder="Data Sensitivity" />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default VulnDetail;