const phishMeasure = {
    genericGreeting: ['dear customer', 'dear user', 'dear valued customer'],
    urgencyLanguage: ["urgent", "immediately", "verify", "suspended", "act now","limited time"],
    sensitiveInfoRequest: ["password", "social security", "ssn", "credit card", "verify your account", "confirm your account"],
    urlShortners: ["bit.ly", "tinyurl", "t.co"]

}
const phishCount = {
    genericGreeting:1,
    urgencyLanguage: 2,
    sensitiveInfoRequest:3,
    urlShortners:2
}
const analyzePhishing = (phishingCase) => {
    const { senderEmail, subject, body, linkText, linkUrl } = phishingCase;
    const lowerSubject = subject.toLowerCase();
    const lowerBody = body.toLowerCase();
    const lowerLinkUrl = (linkUrl || "").toLowerCase();

    let score = 0;
    const flags = [];

    const hasUrgency = phishMeasure.urgencyLanguage.some(
        (word) => lowerSubject.includes(word) || lowerBody.includes(word)
    );

    if (hasUrgency) {
        score += 2;
        flags.push("Uses urgency/pressure language");
    }

    const hasGenericGreeting = phishMeasure.genericGreeting.some(
        (word) => lowerSubject.includes(word) || lowerBody.includes(word)
    );
    if (hasGenericGreeting) {
        score += 1
        flags.push("Greets in a generic way");
    }

    const hasSensitiveInfoRequest = phishMeasure.sensitiveInfoRequest.some(
        (word) => lowerBody.includes(word) || lowerSubject.includes(word)
    );

    if (hasSensitiveInfoRequest) {
        score += 3;
        flags.push("Asks for sensitive information");
    };

    const hasUrlShortner = phishMeasure.urlShortners.some(
        (word) => lowerBody.includes(word) || lowerLinkUrl.includes(word)
    )

    if (hasUrlShortner){
        score +=2;
        flags.push("It includes url shorners")
    }

    return {flags, score}


}

module.exports = analyzePhishing;