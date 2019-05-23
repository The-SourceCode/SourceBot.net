module.exports = function (app) {
    const rateLimit = require("express-rate-limit");
    const {amount, time} = require('./config').ratelimiter;

    const limiter = rateLimit({
        windowMs: time,
        max: amount
    });

    app.use(limiter);
};