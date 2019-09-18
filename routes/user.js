const {Router} = require('express');
const createError = require('http-errors');
const router = Router();
const {userData, incidentsData} = require('../database/DataHandler');
const got = require("got");
const {bot_token, discord} = require("../config");

router.get('/:id', async function (req, res, next) {
    const id = req.params.id;

    // Test if the parameter id contains a letter and create a 404 error if it does.
    if (!(/^\d+$/.test(id))) return next(createError(404));

    try {
        const data = await userData(
            {id},
            "name id xp level rank bio github coins dailystreak -_id badges",
            null,
            {lean: true}
        );
        if (!data || data.length < 1) return next(createError(404));

        let incidents = await incidentsData({TARGET_ID: id}, null, {lean: true});

        if (incidents && incidents.length > 0) {
            incidents = incidents.sort((a, b) => new Date(b.DATE_TIME).getTime() - new Date(a.DATE_TIME).getTime());
        }

        const dUser = await discordUser(id);

        res.render('user', {
            title: `${data[0].name}'s Profile`,
            user: {...data[0], discordUser: dUser},
            incidents,
            theme: req.cookies.theme || 'dark'
        });
    } catch (e) {
        console.error(e);
        next(createError(500));
    }
});

async function discordRoles() {
    try {
        const request = await discordRequest(`guilds/${discord.guild_id}/roles`);
        return request.body;
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function discordUser(user_id) {
    try {
        const request = await discordRequest(`guilds/${discord.guild_id}/members/${user_id}`);
        const body = request.body;
        const user = body.user;

        const roles = await discordRoles();
        body.roles = roles
            .filter(role => body.roles.includes(role.id))
            .map(role => {
                role.color = rgbToHex(role.color);
                if (role.color === "00") role.color = "99aab5";
                return role;
            })
            .sort(((a, b) => b.position - a.position));
        // Checks if the user has an avatar
        if (user && user.avatar) {
            // Get the path for the avatar (png or gif accordingly)
            const avatar_path = user.avatar + (user.avatar.startsWith("a_") ? ".gif" : ".png");
            // Return the image url as png or gif accordingly if avatar found
            return {
                ...body,
                avatar_url: `https://cdn.discordapp.com/avatars/${user_id}/${avatar_path}?size=2048`
            }
        }
        return {
            ...body,
            avatar_url: "/images/sourcebot/purple.png"
        };
    } catch (e) {
        console.error(e);
    }
    // Return Source's image if there is no avatar was found (or on error)
    return {
        avatar_url: "/images/sourcebot/purple.png"
    };
}

async function discordRequest(path) {
    return got(`https://discordapp.com/api/${path}`, {
        headers: {
            'User-Agent': `DiscordBot (SourceBot Website, v${process.env.npm_package_version})`,
            'Authorization': 'Bot ' + bot_token
        },
        json: true,
        method: "GET"
    });
}

function rgbToHex(rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

module.exports = router;
