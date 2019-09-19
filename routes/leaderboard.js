const createError = require('http-errors');
const {Router} = require('express');
const router = Router();
const {userData} = require('../database/DataHandler');

// Leaderboard page
router.get('/?', async function (req, res, next) {
    try {
        res.render('leaderboard', {title: "User Leaderboard", theme: req.cookies.theme || 'dark'});
    } catch (e) {
        console.error(e);
        next(createError(500));
    }
});

router.post("/?", async function (req, res, next) {
    const q = req.query.q;
    try {
        if (q === "more_data") {
            const data = await getData({limit: parseInt(req.body.limit) || 10, skip: parseInt(req.body.skip) || 0});
            res.status(200).send(data);
        } else if (q === "search") {
            const search = req.query.search;

            const data = await getData({
                limit: parseInt(req.body.limit) || 10,
                skip: parseInt(req.body.skip) || 0,
                search: {
                    name: new RegExp(search, 'i')
                }
            });
            res.status(200).send(data);
        } else res.status(404).send("Not Found!");
    } catch (e) {
        console.error(e);
        next(createError(500));
    }
});

async function getData(opts) {
    const data = await userData(
        {...opts.search},
        "name id xp level rank -_id coins bio badges",
        {xp: -1},
        {limit: opts.limit, skip: opts.skip, lean: true}
    );
    return {
        more: data.length > 0,
        data: data.filter(user => !Object.values(user).includes(null) || !Object.values(user).includes(undefined))
    };
}

module.exports = router;
