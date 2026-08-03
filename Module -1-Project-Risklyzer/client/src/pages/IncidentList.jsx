import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getIncidents, createIncident } from "../utils/api";

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  const loadIncidents = () => {
    getIncidents()
      .then((data) => setIncidents(data.incidents))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await createIncident(formData);
      setFormData({ title: "", description: "" });
      loadIncidents();
      navigate(`/killchain/${created._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="incident-list">
      <Link to="/killchain-overview" className="back-link">View stage overview &rarr;</Link>
      <h1>Kill Chain Mapper</h1>

      <form onSubmit={handleSubmit} className="vuln-form">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Incident title" />
        <input name="description" value={formData.description} onChange={handleChange} placeholder="Short description" />
        <button type="submit">Create Incident</button>
      </form>

      <div className="incident-cards">
        {incidents.map((inc) => (
          <Link to={`/killchain/${inc._id}`} key={inc._id} className="incident-card">
            <h3>{inc.title}</h3>
            <p>{inc.description}</p>
            <span className="incident-meta">{inc.events?.length || 0} event(s) logged</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default IncidentList;