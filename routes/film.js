const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async function (req, api) {
    const film = (await axios.get(`https://d.appinfo.tk/ref/6/${req.query.id}`)).data

    api.send({ film })
});

module.exports = router;