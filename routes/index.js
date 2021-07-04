const express = require('express');
const app = express();
const port = 5000;
const film = require('./film');
const geturl = require('./geturl');
const search = require('./search');
const related = require('./related');
const details = require('./details');
//const token = require('./token');

/*const helmet = require('helmet');
const cors = require('cors');

app.use(helmet());

app.use(cors());
app.options('*', cors());*/

app.get('/', (req, res) => {
    res.send('Отказано в доступе')
})

app.use('/film', film);
app.use('/geturl', geturl);
app.use('/search', search);
app.use('/related', related);
app.use('/details', details);
//app.use('/token', token);

app.listen(port, () => console.log(`App is listening on port ${port}!`))