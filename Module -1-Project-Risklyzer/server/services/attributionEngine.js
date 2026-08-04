const actorProfiles = {
  "Nation-State / APT": {
    sophistication: "Very High",
    motivation: "Espionage or intelligence",
    targetSelection: "Specific, high-value target",
    persistence: "Sustained, long-term presence",
    attributionSignal: "Use of custom/novel tools"
  },
  "Cybercriminal": {
    sophistication: "Medium",
    motivation: "Financial gain",
    targetSelection: "Opportunistic, broad targeting",
    persistence: "Quick smash-and-grab",
    attributionSignal: "Use of off-the-shelf or leaked tools"
  },
  "Insider Threat": {
    sophistication: "Low",
    motivation: "Personal grievance or curiosity",
    targetSelection: "Internal system (already had access)",
    persistence: "Quick smash-and-grab",
    attributionSignal: "Legitimate credentials used, no malware needed"
  },
  "Hacktivist": {
    sophistication: "Medium",
    motivation: "Ideological or political",
    targetSelection: "Specific, high-value target",
    persistence: "Quick smash-and-grab",
    attributionSignal: "Use of off-the-shelf or leaked tools"
  },
  "Script Kiddie": {
    sophistication: "Low",
    motivation: "Unclear",
    targetSelection: "Opportunistic, broad targeting",
    persistence: "Quick smash-and-grab",
    attributionSignal: "Use of off-the-shelf or leaked tools"
  }
};

const FIELDS = ["sophistication", "motivation", "targetSelection", "persistence", "attributionSignal"];

const attributeThreatActor = (answers) => {
  const breakdown = Object.entries(actorProfiles).map(([category, profile]) => {
    const matchCount = FIELDS.reduce((count, field) => {
      return answers[field] === profile[field] ? count + 1 : count;
    }, 0);
    return {
      category,
      matchCount,
      matchPercent: Math.round((matchCount / FIELDS.length) * 100)
    };
  });

  breakdown.sort((a, b) => b.matchCount - a.matchCount);

  return {
    bestMatch: breakdown[0].category,
    breakdown
  };
};

module.exports = { attributeThreatActor, actorProfiles };