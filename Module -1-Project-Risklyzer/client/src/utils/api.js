const API_BASE = "/api/vulns";
const INCIDENT_BASE = "/api/incidents";
const PHISHING_BASE = "/api/phishing";
const AUTH_BASE = "/api/auth";

// ---- Auth ----

export async function loginUser(data) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }
  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Registration failed");
  }
  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${AUTH_BASE}/logout`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${AUTH_BASE}/me`, { credentials: "include" });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

// ---- Vulnerability Risk Prioritizer ----

export async function getVulnerabilities() {
  const res = await fetch(API_BASE, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch vulnerabilities");
  return res.json();
}

export async function getVulnerabilityById(id) {
  const res = await fetch(`${API_BASE}/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch vulnerability");
  return res.json();
}

export async function createVulnerability(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create vulnerability");
  return res.json();
}

export async function updateVulnerability(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update vulnerability");
  return res.json();
}

export async function deleteVulnerability(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error("Failed to delete vulnerability");
  return res.json();
}

// ---- Kill Chain Mapper ----

export async function getIncidents() {
  const res = await fetch(INCIDENT_BASE, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
}

export async function getIncidentById(id) {
  const res = await fetch(`${INCIDENT_BASE}/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch incident");
  return res.json();
}

export async function createIncident(data) {
  const res = await fetch(INCIDENT_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create incident");
  return res.json();
}

export async function addEventToIncident(incidentId, eventData) {
  const res = await fetch(`${INCIDENT_BASE}/${incidentId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(eventData)
  });
  if (!res.ok) throw new Error("Failed to add event");
  return res.json();
}

export async function updateEventInIncident(incidentId, eventId, data) {
  const res = await fetch(`${INCIDENT_BASE}/${incidentId}/events/${eventId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

export async function deleteEventFromIncident(incidentId, eventId) {
  const res = await fetch(`${INCIDENT_BASE}/${incidentId}/events/${eventId}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to delete event");
  return res.json();
}

export async function deleteIncident(id) {
  const res = await fetch(`${INCIDENT_BASE}/${id}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error("Failed to delete incident");
  return res.json();
}

export async function getIncidentStats() {
  const res = await fetch(`${INCIDENT_BASE}/stats`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch incident stats");
  return res.json();
}

// ---- Phishing Scorer ----

export async function getPhishingCases() {
  const res = await fetch(PHISHING_BASE, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch phishing cases");
  return res.json();
}

export async function getPhishingCaseById(id) {
  const res = await fetch(`${PHISHING_BASE}/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch phishing case");
  return res.json();
}

export async function createPhishingCase(data) {
  const res = await fetch(PHISHING_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create phishing case");
  return res.json();
}

export async function deletePhishingCase(id) {
  const res = await fetch(`${PHISHING_BASE}/${id}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error("Failed to delete phishing case");
  return res.json();
}

// ---- Attribution Engine ----

export async function analyzeThreatActor(data) {
  const res = await fetch("/api/attribution", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to analyze threat actor");
  return res.json();
}