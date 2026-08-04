import { useState, useEffect } from "react";
import {
  getPhishingCases,
  createPhishingCase,
  deletePhishingCase
} from "../utils/api";

function getRiskTier(score) {
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
}

function PhishingScorer() {
  const [cases, setCases] = useState([]);
  const [formData, setFormData] = useState({
    senderEmail: "",
    subject: "",
    body: "",
    linkText: "",
    linkUrl: ""
  });
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    getPhishingCases().then(setCases).catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createPhishingCase(formData);
      setLastResult(result);
      setFormData({ senderEmail: "", subject: "", body: "", linkText: "", linkUrl: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this phishing case?")) return;
    try {
      await deletePhishingCase(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="phishing-scorer">
      <h1>Phishing Red-Flag Scorer</h1>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="vuln-form">
        <input
          name="senderEmail"
          value={formData.senderEmail}
          onChange={handleChange}
          placeholder="Sender email address"
        />
        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject line"
        />
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          placeholder="Email body"
          rows={5}
          className="phishing-textarea"
        />
        <input
          name="linkText"
          value={formData.linkText}
          onChange={handleChange}
          placeholder="Link display text (optional)"
        />
        <input
          name="linkUrl"
          value={formData.linkUrl}
          onChange={handleChange}
          placeholder="Actual link URL (optional)"
        />
        <button type="submit">Analyze Email</button>
      </form>

      {lastResult && (
        <div className={`result-panel ${getRiskTier(lastResult.score)}`}>
          <div className="result-score">Risk Score: {lastResult.score}</div>
          {lastResult.flags.length > 0 ? (
            <ul className="flag-list">
              {lastResult.flags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          ) : (
            <p>No red flags detected.</p>
          )}
        </div>
      )}

      <h3>Analyzed Cases</h3>
      <table className="vuln-table">
        <thead>
          <tr>
            <th>Sender</th>
            <th>Subject</th>
            <th>Score</th>
            <th>Flags</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c._id}>
              <td>{c.senderEmail}</td>
              <td>{c.subject}</td>
              <td className={getRiskTier(c.score)}>{c.score}</td>
              <td>{c.flags.length} flag(s)</td>
              <td>
                <button className="edit-link danger-link" onClick={() => handleDelete(c._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PhishingScorer;