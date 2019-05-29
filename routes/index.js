const {Router} = require('express');
const {secret} = require('../config');
const router = Router();
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const crypto = require('crypto');

router.get('/', function (req, res, next) {
    res.render('index', {title: 'SourceBot'}); // Renders the index.pug file from the views folder
});

router.get('/maintenance', function (req, res, next) {
    res.render('construction', {title: 'SourceBot'});
});

// auto deploy if changes are pushed to github
router.post('/deploy', function (req, res, next) {
    if (compareSignatures(req.body, req.headers['x-hub-signature'])) {
        async function execute() {
            console.log(`Pulling changes from Github!`);
            const commands = ["git fetch origin", "git pull origin testing"];
            for (let i = 0; i < commands.length; i++) await exec(commands[i]);
            console.log(`Changes pull from Github! Restarting server!`);
        }

        execute().catch(console.error);
        res.status(200).end();
    } else res.status(403).end();
});

function compareSignatures(body, header) {
    const hmac = crypto.createHmac('sha1', secret);
    const self_signature = hmac.update(JSON.stringify(body)).digest('hex');
    const signature = `sha1=${self_signature}`;

    const source = Buffer.from(header);
    const comparison = Buffer.from(signature);
    return crypto.timingSafeEqual(source, comparison);
}

module.exports = router;
