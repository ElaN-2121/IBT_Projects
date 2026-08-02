// src/api.js
const API_BASE = "/api/vulns";

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