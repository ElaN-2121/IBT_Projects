import React, {useState, useEffect } from "react";
import { getVulnerabilities, createVulnerability} from "../utils/api"

function VulnPrioritizer(){
  const [vulns, setVulns] = useState([]);
  const [formData, setFormData] = useState({
    name:"",
    cveId:"",
    cvssScore: "",
    assetCriticality: "",
    exposure: "",
    exploitAvailability: "",
    dataSensitivity: ""
  });

  useEffect(()=> {
    getVulnerabilities().then(setVulns).catch(err => console.error(err));
  }, []);
  
  const handleChange  = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit  = async (e) => {
    e.preventDefault();
    try{
      const newVuln = await createVulnerability(formData);
      setVulns([...vulns, newVuln]);
      setFormData({
        name:"",
        cveId:"",
        cvssScore: "",
        assetCriticality: "",
        exposure: "",
        exploitAvailability: "",
        dataSensitivity: ""
      });
    }catch(err){
      console.error(err);
    };
  }

  return(
    <div className="vuln-prioritizer">
      <h1>Vulnerability Prioritizer</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="vuln-form">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input name="cveId" value={formData.cveId} onChange={handleChange} placeholder="CVE ID" />
        <input name="cvssScore" value={formData.cvssScore} onChange={handleChange} placeholder="CVSS Score" />
        <input name="assetCriticality" value={formData.assetCriticality} onChange={handleChange} placeholder="Asset Criticality" />
        <input name="exposure" value={formData.exposure} onChange={handleChange} placeholder="Exposure" />
        <input name="exploitAvailability" value={formData.exploitAvailability} onChange={handleChange} placeholder="Exploit Availability" />
        <input name="dataSensitivity" value={formData.dataSensitivity} onChange={handleChange} placeholder="Data Sensitivity" />
        <button type="submit">Add Vulnerability</button>
      </form>

      <table className="vuln-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>CVE ID</th>
            <th>CVSS</th>
            <th>Criticality</th>
            <th>Exposure</th>
            <th>Exploit</th>
            <th>Sensitivity</th>
            <th>Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {vulns.map(v => (
            <tr key={v._id}>
              <td>{v.name}</td>
              <td>{v.cveId}</td>
              <td>{v.cvssScore}</td>
              <td>{v.assetCriticality}</td>
              <td>{v.exposure}</td>
              <td>{v.exploitAvailability}</td>
              <td>{v.dataSensitivity}</td>
              <td>{v.riskScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VulnPrioritizer;
