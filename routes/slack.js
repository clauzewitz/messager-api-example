'use strict'
const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET root listing. */
router.get('/', (req, res, next) => {
    res.sendFile('/slack/index.html');
});

router.post('/webhook', (req, res, next) => {
    var response = req.body;
    var payload = JSON.parse(response.payload);
    axios.post(payload.response_url, {
        text: (payload.message.text + ': 수신 완료')
    }).then(response => {
        if (response.status == 200) {
            res.json({result: 0});
        }
    }).catch(error => {
        var response = error.response;
        res.sendStatus(response.status);
    });
});

router.post('/send/webhooks', (req, res, next) => {
    const URL = "INCOMMING_WEBHOOK_URL";
    var params = {
        text: req.body.message,
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: req.body.message
                },
                accessory: {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "수신 확인"
                    },
                    style: "danger",
                    value: ("confirm#")
                }
            }
        ]
    };
    axios.post(URL, params).then(response => {
        if (response.status == 200) {
            res.json({result: 0});
        }
    }).catch(error => {
        var response = error.response;
        res.sendStatus(response.status);
    });
});

router.post('/send/message', (req, res, next) => {
    getChannelInfo('CLY6YPU6M');

    function getChannelInfo(channel) {
        try {
            axios.defaults.headers.common['Authorization'] = 'Bearer OAUTH_TOKEN';
            axios.get('https://slack.com/api/channels.info', { params: {
                channel: channel
            }}).then(response => {
                if (response.status == 200) {
                    if (response.data.ok) {
                        response.data.channel.members.forEach(member => {
                            sendMessage(member, req.body.message);
                        });
                    }
                    res.json({result: response.data.ok ? 0 : 1});
                }
            }).catch(error => {
                var response = error.response;
                res.sendStatus(response.status);
            });
        } catch (e) {
            console.log(e);
        }
    }

    function sendMessage(target, message) {
        const URL = "https://slack.com/api/chat.postMessage";
        var params = {
            channel: target,
            text: message,
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: message
                    },
                    accessory: {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "수신 확인"
                        },
                        style: "danger",
                        value: ("confirm#" + target)
                    }
                }
            ]
        };
        axios.defaults.headers.common['Authorization'] = 'Bearer OAUTH_TOKEN';
        axios.post(URL, params).then(response => {
            if (response.status == 200) {
                // res.json({result: response.data.ok ? 0 : 1});
            }
        }).catch(error => {
            // var response = error.response;
            // res.sendStatus(response.status);
        });
    }
});

router.post('/send/bot', (req, res, next) => {
    console.log(req.body);
    var message = req.body.message;
    // const URL = "https://slack.com/api/rtm.connect";
    // const URL = "https://slack.com/api/users.list";
    const URL = "https://slack.com/api/chat.postMessage";
    axios.defaults.headers.common['Authorization'] = 'Bearer BOT_OAUTH_TOKEN';
    // axios.get(URL, {}).then(response => {
    //     console.log(response);
    //     response.data.members.forEach(member => {
    //         console.log(member);
    //     });
    // }).catch(
    //     error => {
    //         console.log(error);
    //     }
    // );

    var params = {
        channel: 'UM4HYSWLD',
        text: message,
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: message
                },
                accessory: {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "수신 확인"
                    },
                    style: "danger",
                    value: ("confirm#" + 'UM4HYSWLD')
                }
            }
        ],
        
    };
    axios.post(URL, params).then(response => {
        if (response.status == 200) {
            res.json({result: response.data.ok ? 0 : 1});
        }
    }).catch(error => {
        var response = error.response;
        res.sendStatus(response.status);
    });
});

module.exports = router;
