const moment = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a'),
        background: (username === 'your_username') ? 'blue' : 'transparent'
    }
}

module.exports = formatMessage;