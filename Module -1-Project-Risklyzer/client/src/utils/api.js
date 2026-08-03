// src/api.js
const API_BASE = "/api/vulns";
const INCIDENT_BASE = "/api/incidents";

export async function getIncidents() {
  const res = await fetch(INCIDENT_BASE);
  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
}

export async function getIncidentById(id) {
  const res = await fetch(`${INCIDENT_BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch incident");
  return res.json();
}

export async function createIncident(data) {
  const res = await fetch(INCIDENT_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create incident");
  return res.json();
}

export async function addEventToIncident(incidentId, eventData) {
  const res = await fetch(`${INCIDENT_BASE}/${incidentId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData)
  });
  if (!res.ok) throw new Error("Failed to add event");
  return res.json();
}

export async function deleteIncident(id) {
  const res = await fetch(`${INCIDENT_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete incident");
  return res.json();
}


export async function updateEventInIncident(incidentId, eventId, data) {
  const res = await fetch(`${INCIDENT_BASE}/${incidentId}/events/${eventId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

export async function deleteEventFromIncident(incidentId, eventId) {
  const res = await fetch(`${INCIDENT_BASE}/${incidentId}/events/${eventId}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete event");
  return res.json();
}

export async function getIncidentStats() {
  const res = await fetch(`${INCIDENT_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch incident stats");
  return res.json();
}

export async function getVulnerabilities() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch vulnerabilities");
  return res.json();
}

export async function createVulnerability(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create vulnerability");
  return res.json();
}

export async function updateVulnerability(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update vulnerability");
  return res.json();
}

export async function deleteVulnerability(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete vulnerability");
  return res.json();
}
export async function getVulnerabilityById(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch vulnerability");
  return res.json();
}