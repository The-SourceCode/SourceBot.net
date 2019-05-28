const {Router} = require('express');
const {secret} = require('../config');
const router = Router();
const util = require('util');
const exec = util.promisify(require('child_process').exec);

router.get('/', function (req, res, next) {
    res.render('index', {title: 'SourceBot'}); // Renders the index.pug file from the views folder
});

router.get('/maintenance', function (req, res, next) {
    res.render('construction', {title: 'SourceBot'});
});

router.post('/deploy', function (req, res, next) {
    if (req.headers['X-Hub-Signature'] === secret) {

        async function execute() {
            console.log(`Pulling changes from Github!`);
            const commands = ["git fetch origin", "git pull origin testing"];
            await exec('npm run pm2_restart');
        }
        execute().catch(console.error);

        res.status(200).end();
    } else res.status(403).end();
});

module.exports = router;
