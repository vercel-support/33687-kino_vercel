const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async function (req, api) {
    const related = (await axios.get(`http://103.119.112.27/partner_api/film/${req.query.id}/related`,
        {
            headers: {
                "X-FX-Token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6ImZ4LTYwZDMxNTlhNWJjMGUifQ.eyJpc3MiOiJodHRwczpcL1wvZmlsbWl4Lm1lIiwiYXVkIjoiaHR0cHM6XC9cL2ZpbG1peC5tZSIsImp0aSI6ImZ4LTYwZDMxNTlhNWJjMGUiLCJpYXQiOjE2MjQ0NDYzNjIsIm5iZiI6MTYyNDQzNTU2MiwiZXhwIjoxNjI3MDM4MzYyLCJwYXJ0bmVyX2lkIjoiMiIsImhhc2giOiI2MzM0ZDE4YzJkNmY5YTZiZTkyNTMwZDE5ZTIwOTI5NTA3ZjQ4OWIwIiwidXNlcl9pZCI6bnVsbCwiaXNfcHJvIjpmYWxzZSwiaXNfcHJvX3BsdXMiOmZhbHNlLCJzZXJ2ZXIiOiIifQ.rek8uX9e6ENDUllFwWjjzSfZRp6J23UKUKqlzyzW8rM"
            }
        })).data

    api.send({ related: related.items })
});

module.exports = router;