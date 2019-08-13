'use strict'
const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET root listing. */
router.get('/', (req, res, next) => {
    res.sendFile('/kakao/index.html');
});

router.get('/webhook', (req, res, next) => {
    res.json({
        'result': 0,
        'message': 'confirm by ' + req.query.token
    });
});

router.post('/send/me', (req, res, next) => {
    const URL = "https://kapi.kakao.com/v2/api/talk/memo/default/send";
    var params = {
        template_object: {
            object_type: 'text',
            text: req.body.message,
            link: {
                "web_url": "http://127.0.0.1:3100/kakao/webhook?token=" + req.body.accessToken,
                "mobile_web_url": "http://127.0.0.1:3100/kakao/webhook?token=" + req.body.accessToken
            },
            button_title: '확인'
        }
    };
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + req.body.accessToken;
    axios.post(URL, undefined, {params: params}).then(response => {
        if (response.status == 200) {
            res.json({result: response.data.result_code});
        }
    }).catch(error => {
        var response = error.response;
        res.sendStatus(response.status);
    });
});

module.exports = router;
