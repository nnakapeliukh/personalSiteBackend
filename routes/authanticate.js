const jwt = require("jsonwebtoken");

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (typeof token !== 'undefined') {
      jwt.verify(token, `${process.env.JWT_SECRET}`, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          req.authData = authData;
          next();
        }
      });
    } else {
      res.sendStatus(401);
    }
  }

  module.exports = verifyToken;