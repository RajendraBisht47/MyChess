const JWT = require("jsonwebtoken");
async function auth(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      // console.log(`${process.env.UI_URL}/login`);
      return res.redirect(`${process.env.UI_URL}/signin`);
    }
    const payload = JWT.verify(token, process.env.SECRET_KEY);
    if (!payload.username || !payload.id) {
      // console.log(`${process.env.UI_URL}/login`);
      return res.redirect(`${process.env.UI_URL}/signin`);
    }
    next();
  } catch (error) {
    console.log(error);
  }
}
module.exports = auth;
