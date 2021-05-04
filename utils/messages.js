const moment = require("moment");

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("DD/MM/YYYY, h:mm:ss"),
  };
}

module.exports = formatMessage;
