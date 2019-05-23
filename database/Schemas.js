const {Schema, model} = require('mongoose');
const {userData, incidents} = require('../config').mongo.collections;

// Initiate user schema
const user = new Schema({
    name: String,
    xp: Number,
    level: Number,
    rank: Number,
    coins: Number,
    xpbooster: Number,
    coinbooster: Number,
    dailystreak: Number,
    github: String,
    bio: String
}, {collection: userData});

// Initiate history schema
const history = new Schema({
    TYPE: String,
    DATE_TIME: String,
    TARGET_ID: String,
    REASON: String,
    DURATION: String
}, {collection: incidents});

// export models
module.exports = {
    Users: model(userData, user),
    Incidents: model(incidents, history)
};