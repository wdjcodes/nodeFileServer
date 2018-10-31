const jwt = require('jsonwebtoken');
const db = require('../db/connection');

const users = db.get('users');

function checkTokenSetUser(req, res, next) {
  const authHeader = req.get('authorization');
  if (authHeader) {
    // console.log(authHeader);
    const token = authHeader.split(' ')[1];
    if (token) {
      // console.log(token);
      jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
          console.log(error);
          res.status(401);
          next(error.errorMessage);
        }
        users.findOne({ username: user.username }, { password: 0 }).then((storedUser) => {
          if (storedUser) {
            req.user = storedUser;
            next();
          } else {
            res.status(401);
            next(new Error('Unauthorized Access'));
          }
        });
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    const errorMessage = new Error('🙈🙉🙊 Unauthorized 🙈🙉🙊');
    res.status(401);
    next(errorMessage);
  }
}

module.exports = {
  checkTokenSetUser,
  isLoggedIn,
};
