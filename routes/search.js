const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async function (req, api) {
    try {
        const search = (await axios.get(`https://filmix.beer/api/v2/suggestions?search_word=${encodeURIComponent(req.query.q)}`,
            {
                headers: {
                    "x-requested-with": "XMLHttpRequest"
                }
            })).data

        api.send({ search: search.posts })
    } catch (err) {
        api.send({ error: err })
    }
});

module.exports = router;