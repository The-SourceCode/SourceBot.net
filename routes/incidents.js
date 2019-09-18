const {Router} = require('express');
const createError = require('http-errors');
const router = Router();
const {incidentsData} = require('../database/DataHandler');

router.get('/', async function (req, res, next) {
    try {
        //let incidents = await getData(parseInt(req.body.limit) || 10);
        res.render('incidents', {title: "Incidents", theme: req.cookies.theme || 'dark'});
    } catch (e) {
        console.error(e);
        next(createError(500));
    }
});

router.post("/?", async function (req, res, next) {
    const q = req.query.q;
    if (q === "more_data") {
        try {
            const data = await getData(parseInt(req.body.limit) || 10, parseInt(req.body.skip) || 0);
            res.status(200).send(data);
        } catch (e) {
            console.error(e);
            next(createError(500));
        }
    } else res.status(404).send("Not Found!");
});

async function getData(limit, skip) {
    const data = await incidentsData(
        {},
        {TIME_IN_MS: -1},
        {limit, skip, lean: true}
    );

    return {
        more: data.length > 0,
        data: data.filter(incident => (!Object.values(incident).includes(null) ||
            !Object.values(incident).includes(undefined)) && incident.TYPE !== "ROLE UPDATE" && incident.TYPE !== "CLEAR")
    }
}

module.exports = router;
