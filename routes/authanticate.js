const jwt = require("jsonwebtoken");

// // Middleware to verify token
// function verifyToken(req, res, next) {
//     const token = req.headers['authorization'];
//     if (typeof token !== 'undefined') {
//       jwt.verify(token, `${process.env.JWT_SECRET}`, (err, authData) => {
//         if (err) {
//           res.sendStatus(403);
//         } else {
//           req.authData = authData;
//           next();
//         }
//       });
//     } else {
//       res.sendStatus(401);
//     }
//   }

//   module.exports = verifyToken;
module.exports = (req, res, next) => {
  // Extracting JWT secret from environment variable
  const JWT_SECRET = process.env.JWT_SECRET;
  //Extracting token from authorization header
  const { authorization } = req.headers;
  // Checking if authorization header is present
  //authorization === 'Bearer "token"'
  if (!authorization) {
    return res.status(404).send({ error: "Must be logged in" });
  }

  // Removing 'Bearer ' prefix to get the token
  const token = authorization.replace("Bearer ", "");
  //Verifying if the token is valid.
  const decoded = jwt.verify(token, JWT_SECRET);
  // Adding user information to the request object
  req.user = decoded;
  console.log("logging auth decoded: ", decoded);
  next();
};
