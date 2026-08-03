import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getIncidentStats } from "../utils/api";

const STAGE_ORDER = [
  "Reconnaissance", "Weaponization", "Delivery", "Exploitation",
  "Installation", "Command and Control", "Actions on Objectives"
];

function IncidentDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getIncidentStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <p>Loading...</p>;

  const chartData = STAGE_ORDER.map((stage) => ({
    stage,
    count: stats.stageCounts[stage] || 0
  }));

  return (
    <div className="incident-dashboard">
      <h1>Kill Chain Overview</h1>
      <p className="vuln-meta">{stats.totalIncidents} incident(s) tracked</p>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3844" />
            <XAxis dataKey="stage" tick={{ fill: "#8B98A5", fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
            <YAxis tick={{ fill: "#8B98A5" }} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#16212B", border: "1px solid #2A3844" }} />
            <Bar dataKey="count" fill="#E8A33D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IncidentDashboard;