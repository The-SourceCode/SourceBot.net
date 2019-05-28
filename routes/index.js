const {Router} = require('express');
const {secret} = require('../config');
const router = Router();

router.get('/', function (req, res, next) {
    res.render('index', {title: 'SourceBot'}); // Renders the index.pug file from the views folder
});

router.get('/maintenance', function (req, res, next) {
    res.render('construction', {title: 'SourceBot'});
});

router.post('/deploy', function (req, res, next) {
    if (req.headers['X-Hub-Signature'] === secret) {}//TODO
    console.log(req)
    res.end(200);
});

module.exports = router;
