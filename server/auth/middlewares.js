const jwt = require('jsonwebtoken');

function checkTokenSetUser(req, res, next) {
  const authHeader = req.get('authorization');
  if (authHeader) {
    // console.log(authHeader);
    const token = authHeader.split(' ')[1];
    if (token) {
      console.log(token);
      jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
          console.log(error);
          res.status(401);
          next(error.errorMessage);
        }

        req.user = user;
        next();
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
