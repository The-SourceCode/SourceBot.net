const {Router} = require('express');
const createError = require('http-errors');
const router = Router();
const {userData, incidentsData} = require('../database/DataHandler');
const got = require("got");
const {bot_token} = require("../config");

router.get('/:id', async function (req, res, next) {
    let error = false;
    const id = req.params.id;

    if (!(/^\d+$/.test(id))) return next(createError(404)); // Test if the parameter id contains a letter and create a 404 error if it does.

    const data = await userData({id: req.params.id}, "name id xp level rank bio github coins dailystreak -_id")
        .catch(e => {
            console.error(e.stack);
            error = true;
        });
    if (!data || data.length < 1) return next(createError(404));

    let incidents = await incidentsData({TARGET_ID: req.params.id})
        .catch(e => {
            console.error(e.stack);
            error = true;
        });

    if (error) return next(createError(500));

    if (incidents || incidents.length > 0) incidents = incidents.sort((a, b) => new Date(b.DATE_TIME).getTime() - new Date(a.DATE_TIME).getTime());
    data[0].avatar = await avatar(req.params.id);

    res.render('user', {title: `${data[0].name}'s Profile`, data: data[0], incidents});
});

async function avatar(user_id) {
    const {body} = await got("https://discordapp.com/api/users/" + user_id, {
        headers: {
            'User-Agent': `DiscordBot (SourceBot Website, v${process.env.npm_package_version})`,
            'Authorization': 'Bot ' + bot_token
        },
        json: true,
        method: "GET"
    }).catch(console.error);

    // Return the image url as png or gif accordingly.
    return `https://cdn.discordapp.com/avatars/${user_id}/${body.avatar + (body.avatar.startsWith("a_") ? ".gif" : ".png")}?size=2048`;
}

module.exports = router;
