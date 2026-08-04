import { useState } from "react";
import { analyzeThreatActor } from "../utils/api";

const OPTIONS = {
  sophistication: ["Low", "Medium", "High", "Very High"],
  motivation: [
    "Financial gain",
    "Espionage or intelligence",
    "Ideological or political",
    "Personal grievance or curiosity",
    "Unclear"
  ],
  targetSelection: [
    "Specific, high-value target",
    "Opportunistic, broad targeting",
    "Internal system (already had access)"
  ],
  persistence: ["Quick smash-and-grab", "Sustained, long-term presence"],
  attributionSignal: [
    "Use of custom/novel tools",
    "Use of off-the-shelf or leaked tools",
    "Legitimate credentials used, no malware needed"
  ]
};

const LABELS = {
  sophistication: "Sophistication observed",
  motivation: "Primary motivation",
  targetSelection: "Target selection",
  persistence: "Persistence / patience",
  attributionSignal: "Attribution signal"
};

function AttributionEngine() {
  const [formData, setFormData] = useState({
    sophistication: "",
    motivation: "",
    targetSelection: "",
    persistence: "",
    attributionSignal: ""
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await analyzeThreatActor(formData);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const allAnswered = Object.values(formData).every((v) => v !== "");

  return (
    <div className="attribution-engine">
      <h1>Threat Actor Attribution Engine</h1>
      <p className="vuln-meta">
        Answer what you've observed about an incident to see which threat actor category it most resembles.
      </p>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="vuln-form">
        {Object.keys(OPTIONS).map((field) => (
          <select key={field} name={field} value={formData[field]} onChange={handleChange}>
            <option value="">{LABELS[field]}...</option>
            {OPTIONS[field].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ))}
        <button type="submit" disabled={!allAnswered}>Attribute Threat Actor</button>
      </form>

      {result && (
        <div className="result-panel">
          <div className="result-score">Most Likely: {result.bestMatch}</div>

          <table className="breakdown-table">
            <thead>
              <tr><th>Category</th><th>Match</th><th>Confidence</th></tr>
            </thead>
            <tbody>
              {result.breakdown.map((row) => (
                <tr key={row.category}>
                  <td>{row.category}</td>
                  <td>{row.matchCount} / 5</td>
                  <td>{row.matchPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttributionEngine;