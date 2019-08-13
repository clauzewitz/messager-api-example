'use strict'
const express = require('express');
const axios = require('axios');
const router = express.Router();
axios.defaults.baseURL = 'https://api.telegram.org/bot' + 'TELEGRAM_BOT_TOKEN';

/* GET root listing. */
router.get('/', (req, res, next) => {
    res.sendFile('/telegram/index.html');
});

router.post('/webhook', (req, res, next) => {
    var response = req.body;

    var params = requestCommand({
        type: response.message.text,
        chatId: response.message.from.id
    });
    params.chat_id = response.message.from.id;

    axios.post('/sendMessage', params).then(response => {
        if (response.status == 200) {
            res.json({result: response.data.ok ? 0 : 1});
        }
    }).catch(error => {
        console.log(error);
        res.sendStatus(200);
    });
});

router.post('/send/message', (req, res, next) => {
    var params = requestCommand(req.body);
    params.chat_id = req.body.chatId;
    axios.post('/sendMessage', params).then(response => {
        if (response.status == 200) {
            res.json({result: response.data.ok ? 0 : 1});
        }
    }).catch(error => {
        console.log(error);
        res.sendStatus(200);
    });
});

function requestCommand(request) {
    var params = {
        chat_id: undefined,
        text: undefined,
        reply_markup: {
            remove_keyboard: true
        }
    };
    switch (request.type) {
        case '/regist':
            params.text = '등록되었습니다(chatId: ' + request.chatId + ')';
            break;
        case '/unregist':
            params.text = '삭제되었습니다';
            break;
        case '수신 확인':
            params.text = '수신이 확인되었습니다';
            break;
        case '/error':
            params.text = request.message;
            params.reply_markup = {
                keyboard: [
                    [
                        {
                            text:'수신 확인'
                        }
                    ]
                ]
            };
            break;
        default :
            params.text = '올바른 명령어가 아닙니다';
            break;
    }

    return params;
}

module.exports = router;
