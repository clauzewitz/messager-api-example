'use strict'
const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET root listing. */
router.get('/', (req, res, next) => {
    res.sendFile('/index.html');
});

module.exports = router;
