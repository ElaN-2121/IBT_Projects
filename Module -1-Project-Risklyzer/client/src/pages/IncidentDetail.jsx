import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getIncidentById,
  addEventToIncident,
  updateEventInIncident,
  deleteEventFromIncident,
  getVulnerabilities
} from "../utils/api";

const STAGE_ORDER = [
  "Reconnaissance",
  "Weaponization",
  "Delivery",
  "Exploitation",
  "Installation",
  "Command and Control",
  "Actions on Objectives"
];

function IncidentDetail() {
  const { id } = useParams();

  const [incident, setIncident] = useState(null);
  const [vulns, setVulns] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    timestamp: "",
    stage: STAGE_ORDER[0],
    wasDetectedAtTime: false,
    relatedVulnerability: ""
  });

  const [editingEventId, setEditingEventId] = useState(null);
  const [editData, setEditData] = useState({});

  const load = () => {
    getIncidentById(id)
      .then((data) => setIncident(data.incident))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
    getVulnerabilities().then(setVulns).catch(() => {});
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        relatedVulnerability: formData.relatedVulnerability || undefined
      };
      await addEventToIncident(id, payload);
      setFormData({
        description: "",
        timestamp: "",
        stage: STAGE_ORDER[0],
        wasDetectedAtTime: false,
        relatedVulnerability: ""
      });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (ev) => {
    setEditingEventId(ev._id);
    setEditData({
      description: ev.description,
      timestamp: ev.timestamp?.slice(0, 16),
      stage: ev.stage,
      wasDetectedAtTime: ev.wasDetectedAtTime,
      relatedVulnerability: ev.relatedVulnerability || ""
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({ ...editData, [name]: type === "checkbox" ? checked : value });
  };

  const saveEdit = async (ev) => {
    try {
      const payload = {
        ...editData,
        relatedVulnerability: editData.relatedVulnerability || undefined
      };
      await updateEventInIncident(id, ev._id, payload);
      setEditingEventId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEvent = async (ev) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEventFromIncident(id, ev._id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p className="error-text">{error}</p>;
  if (!incident) return <p>Loading...</p>;

  const sortedEvents = [...incident.events].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const firstDetectedIndex = sortedEvents.findIndex((e) => e.wasDetectedAtTime);
  const observedStages = new Set(sortedEvents.map((e) => e.stage));
  const furthestStageIndex = sortedEvents.length
    ? Math.max(...sortedEvents.map((e) => STAGE_ORDER.indexOf(e.stage)))
    : -1;

  return (
    <div className="incident-detail">
      <Link to="/killchain" className="back-link">&larr; Back to incidents</Link>
      <h1>{incident.title}</h1>
      <p className="vuln-meta">{incident.description}</p>

      <div className="coverage-summary">
        <span>{observedStages.size} of 7 Kill Chain stages observed</span>
        {furthestStageIndex >= 0 && (
          <span> · Furthest reached: <strong>{STAGE_ORDER[furthestStageIndex]}</strong></span>
        )}
        {firstDetectedIndex === -1 && sortedEvents.length > 0 && (
          <span className="undetected-flag"> · Not detected at any logged stage</span>
        )}
        {firstDetectedIndex > 0 && (
          <span className="undetected-flag">
            {" "}· Attack progressed through {firstDetectedIndex} stage(s) before detection
          </span>
        )}
      </div>

      <h3>Timeline</h3>
      <div className="timeline">
        {sortedEvents.map((ev) => (
          <div
            key={ev._id}
            className={`timeline-event ${ev.wasDetectedAtTime ? "detected" : "undetected"}`}
          >
            <div className="timeline-marker" />
            <div className="timeline-content">
              {editingEventId === ev._id ? (
                <div className="vuln-form">
                  <input
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                  />
                  <input
                    type="datetime-local"
                    name="timestamp"
                    value={editData.timestamp}
                    onChange={handleEditChange}
                  />
                  <select name="stage" value={editData.stage} onChange={handleEditChange}>
                    {STAGE_ORDER.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    name="relatedVulnerability"
                    value={editData.relatedVulnerability}
                    onChange={handleEditChange}
                  >
                    <option value="">No related vulnerability</option>
                    {vulns.map((v) => (
                      <option key={v._id} value={v._id}>{v.name}</option>
                    ))}
                  </select>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="wasDetectedAtTime"
                      checked={editData.wasDetectedAtTime}
                      onChange={handleEditChange}
                    />
                    Detected at the time
                  </label>
                  <button onClick={() => saveEdit(ev)}>Save</button>
                  <button onClick={() => setEditingEventId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="timeline-stage">
                    {ev.stage}
                    {ev.suggestedStage && ev.suggestedStage !== ev.stage && (
                      <span className="suggestion-note"> (suggested: {ev.suggestedStage})</span>
                    )}
                  </div>
                  <div className="timeline-desc">{ev.description}</div>
                  <div className="timeline-meta">
                    {new Date(ev.timestamp).toLocaleString()} ·{" "}
                    {ev.wasDetectedAtTime ? "Detected at the time" : "Not detected at the time"}
                    {ev.relatedVulnerability && " · Linked to a tracked vulnerability"}
                  </div>
                  <div className="event-actions">
                    <button className="edit-link" onClick={() => startEditing(ev)}>Edit</button>
                    <button className="edit-link danger-link" onClick={() => handleDeleteEvent(ev)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        {sortedEvents.length === 0 && <p>No events logged yet.</p>}
      </div>

      <h3>Add Event</h3>
      <form onSubmit={handleSubmit} className="vuln-form">
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What happened?"
        />
        <input
          type="datetime-local"
          name="timestamp"
          value={formData.timestamp}
          onChange={handleChange}
        />
        <select name="stage" value={formData.stage} onChange={handleChange}>
          {STAGE_ORDER.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select name="relatedVulnerability" value={formData.relatedVulnerability} onChange={handleChange}>
          <option value="">No related vulnerability</option>
          {vulns.map((v) => (
            <option key={v._id} value={v._id}>{v.name}</option>
          ))}
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="wasDetectedAtTime"
            checked={formData.wasDetectedAtTime}
            onChange={handleChange}
          />
          Detected at the time
        </label>
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
}

export default IncidentDetail;