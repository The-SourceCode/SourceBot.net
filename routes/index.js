const config = require('../config');
const maintenance = config.underConstruction;
const {Router} = require('express');
const router = Router();

router.get('/', function (req, res, next) {
    res.render(maintenance ? 'construction' : 'index', {title: 'SourceBot'});
});

router.get('/maintenance', function (req, res, next) {
    res.render('construction', {title: 'SourceBot'});
});

module.exports = router;
