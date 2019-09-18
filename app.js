const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const incidentsRouter = require('./routes/incidents');
const leaderboardRouter = require('./routes/leaderboard');

const app = express();
// connect to database
require('./database/connector.js');

// enable rate limiter
require('./ratelimiter')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
    src: '/public',
    root: __dirname,
    outputStyle: 'compressed',
}));
app.use(express.static(path.join(__dirname, 'public')));

// setup routes
app.use(function (req, res, next) {
    if (require("./config").underConstruction && req.originalUrl !== "/maintenance") res.redirect('/maintenance');
    else next();
});
app.use('/', indexRouter);

app.use(function (req, res, next) {
    next(!global.connected ? createError(500) : "");
});
app.use('/leaderboard', leaderboardRouter);
app.use('/incidents', incidentsRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');

    console.error(err);
});

module.exports = app;

Number.prototype.addCommas = function () {
    const n = this.toString().split(".");
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return n.join(".");
};