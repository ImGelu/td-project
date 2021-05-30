const moment = require("moment");

function formatMessage(user, text) {
  return {
    username: user.username,
    role: user.role,
    text,
    time: moment().format("DD/MM/YYYY, h:mm:ss"),
  };
}

module.exports = formatMessage;
