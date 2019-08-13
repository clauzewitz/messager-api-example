'use strict'
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const CONF_SERVER = require('./config/server.conf');

const main = require('./routes/main');
const kakaotalk = require('./routes/kakaotalk');
const slack = require('./routes/slack');
const telegram = require('./routes/telegram');

const app = express();

// helmet setup
app.use(helmet({
    noCache: true,
    referrerPolicy: true
}));

// Access-Control-Allow-Origin
app.use('/*', (req, res, next) => {
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Expose-Headers', 'pageTotal');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', main);
app.use('/kakao', kakaotalk);
app.use('/slack', slack);
app.use('/telegram', telegram);

// server port setup
app.listen(CONF_SERVER.PORT, () => {
    console.log(CONF_SERVER.NAME + ' app listening on port ' + CONF_SERVER.PORT);
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

