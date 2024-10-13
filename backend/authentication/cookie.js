const JWT = require("jsonwebtoken");

function cookies(user) {
  const payload = {
    username: user.username,
    userID: user._id,
  };
  const cookie = JWT.sign(payload, process.env.SECRET_KEY);
  return cookie;
}

function decode(cookie) {
  const payload = JWT.verify(cookie, process.env.SECRET_KEY);
  return payload;
}

module.exports = { cookies, decode };
