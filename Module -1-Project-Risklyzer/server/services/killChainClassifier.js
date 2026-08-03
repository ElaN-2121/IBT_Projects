const stageKeywords = {
  Reconnaissance: ["scan", "recon", "footprint", "osint", "enumerate", "probe", "reconnaissance", "surveillance", "research", "gathered information"],
  Weaponization: ["payload", "weaponize", "crafted malware", "built exploit", "malicious document", "malicious macro", "trojan created", "packaged"],
  Delivery: ["email", "phishing", "usb", "attachment", "delivered", "sent", "message", "link clicked", "downloaded", "website visited", "smishing", "vishing"],
  Exploitation: ["exploit", "triggered", "executed", "macro ran", "vulnerability exploited", "code execution", "buffer overflow", "injection"],
  Installation: ["installed", "backdoor", "persistence", "dropped", "implant", "rootkit", "scheduled task", "registry key", "service created"],
  "Command and Control": ["c2", "command and control", "beacon", "callback", "remote access", "reverse shell", "outbound connection", "external server"],
  "Actions on Objectives": ["exfiltrat", "ransomware", "stole", "leaked", "encrypted files", "lateral movement", "wiped", "destroyed", "data breach", "credentials dumped"]
};

const suggestStage = (description) => {
  const lowerDescription = description.toLowerCase();
  const counts = {};

  for (const stage of Object.keys(stageKeywords)) {
    counts[stage] = 0;

    for (const keyword of stageKeywords[stage]){

      if (lowerDescription.includes(keyword)){
        counts[stage] += 1;
      }
    }

  }


  const entries = Object.entries(counts);

  const [bestStage, bestCount] = entries.reduce((best, current) => {
    return current[1] > best[1] ? current : best;
  }, entries[0]);

  if (bestCount === 0){
    return null;
  }

  return bestStage
};

module.exports = suggestStage;