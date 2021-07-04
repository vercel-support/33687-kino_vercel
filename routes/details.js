const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async function (req, api) {
    const details = (await axios.get(`http://103.119.112.27/partner_api/film/${req.query.id}/details`,
        {
            headers: {
                "X-FX-Token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6ImZ4LTYwZDQ1Y2NjNzk3NWMifQ.eyJpc3MiOiJodHRwczpcL1wvZmlsbWl4Lm1lIiwiYXVkIjoiaHR0cHM6XC9cL2ZpbG1peC5tZSIsImp0aSI6ImZ4LTYwZDQ1Y2NjNzk3NWMiLCJpYXQiOjE2MjQ1MzAxMjQsIm5iZiI6MTYyNDUxOTMyNCwiZXhwIjoxNjI3MTIyMTI0LCJwYXJ0bmVyX2lkIjoiMiIsImhhc2giOiJhYmQxMmYxZDIzMjIzNGI0ZDNmMDMyZTI4OTBmZjBlMjYxODg2ZTg5IiwidXNlcl9pZCI6bnVsbCwiaXNfcHJvIjpmYWxzZSwiaXNfcHJvX3BsdXMiOmZhbHNlLCJzZXJ2ZXIiOiIifQ.Ug6a8WWjYmTjWYdloLl7p3cWqEitEKc7yJnLlZac5k4"
            }
        })).data

    api.send({ details: details })
});

module.exports = router;