const {Router} = require('express');
const router = Router();

// redirect to our discord server
router.all('/discord', function (req, res, next) {
    res.redirect("https://discordapp.com/invite/w24CQMR");
});

router.get('/', function (req, res, next) {
    res.render('index', {title: 'SourceBot'}); // Renders the index.pug file from the views folder
});

router.get('/maintenance', function (req, res, next) {
    res.render('construction', {title: 'SourceBot'});
});

module.exports = router;
