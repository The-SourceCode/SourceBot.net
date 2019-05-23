const {Router} = require('express');
const router = Router();
const {userData} = require('../database/DataHandler');

// Leaderboard page
router.get('/?', async function (req, res, next) {
    const data = await userData({}, "name id xp level rank -_id coins", {xp: -1})
        .catch(console.error);

    res.render('leaderboard', {title: "User Leaderboard", data, query: req.query.search});
});

module.exports = router;
