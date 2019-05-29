// To make this work you must clone it and rename it to "config.js"

module.exports = {
    mongo: {
        ip: "",
        user: "",
        pwd: "",
        port: "27017",
        db: "sourcebot",
        collections: {
            userData: "UserData",
            incidents: "IncidentReports"
        }
    },
    ratelimiter: {
        time: 1000, // time in ms
        amount: 10 // amount of requests per {time}
    },
    PORT: 1234,
    bot_token: "", // to get user's discord data.
    autodeploy: {
        branch: "production", // branch to auto deploy
        secret: "" // secret keywords for github's webhooks
    },
    underConstruction: false
};