const express = require('express');;
const path = require('path');
const film = require('./routes/film.js');
const geturl = require('./routes/geturl.js');
const search = require('./routes/search.js');
const related = require('./routes/related.js');
const details = require('./routes/details.js');
const app = express();
const port = 8000;

//const queryString = require('query-string');

//const token = './token');

/*const helmet = 'helmet');
const cors = 'cors');

app.use(helmet());

app.use(cors());
app.options('*', cors());*/

app.use('/api/film', film);
app.use('/api/geturl', geturl);
app.use('/api/search', search);
app.use('/api/related', related);
app.use('/api/details', details);
//app.use('/token', token);

//if (process.env.NODE_ENV === 'production') {
const buildPath = path.normalize(path.join(__dirname, './client/build'));
app.use(express.static(buildPath));

app.get('(/*)?', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
})
//}

app.listen(port, () => console.log(`App is listening on port ${port}!`))

module.exports = app;