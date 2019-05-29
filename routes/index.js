const {Router} = require('express');
const {secret, branch} = require('../config').autodeploy;
const router = Router();
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const crypto = require('crypto');

// auto deploy if changes are pushed to github
router.all('/deploy', function (req, res, next) {
    if (compareSignatures(req.body, req.headers['x-hub-signature'])) {
        if (req.body.ref !== `refs/heads/${branch}`) return res.status(406).end();
        async function execute() {
            console.log(`Pulling changes from Github!`);
            const commands = ["git fetch origin", `git pull origin ${branch}`];
            for (let i = 0; i < commands.length; i++) await exec(commands[i]);
        }

        res.status(200).end();
        execute().catch(console.error);
    } else res.status(403).end();
});

router.get('/', function (req, res, next) {
    res.render('index', {title: 'SourceBot'}); // Renders the index.pug file from the views folder
});

router.get('/maintenance', function (req, res, next) {
    res.render('construction', {title: 'SourceBot'});
});

function compareSignatures(body, header) {
    if (!body) return false;
    if (!header) return false;
    const hmac = crypto.createHmac('sha1', secret);
    const self_signature = hmac.update(JSON.stringify(body)).digest('hex');
    const signature = `sha1=${self_signature}`;

    const source = Buffer.from(header);
    const comparison = Buffer.from(signature);
    return crypto.timingSafeEqual(source, comparison);
}

module.exports = router;
