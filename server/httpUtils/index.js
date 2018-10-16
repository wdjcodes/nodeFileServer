const jwt = require("jsonwebtoken");

function sendError(res, next, errorObj) {
  res.status(errorObj.status);
  const error = new Error(errorObj.msg);
  next(error);
}

function sendUserToken(res, next, user) {
  const jwtPayload = {
    _id: user._id,
    username: user.username,
  };

  jwt.sign(
    jwtPayload,
    process.env.TOKEN_SECRET,
    { expiresIn: "1d" },
    (error, token) => {
      if (error) {
        const jwtError = {
          msg: error,
          status: 501,
        };
        sendError(res, next, jwtError);
      } else {
        res.json({ token, user });
      }
    }
  );
}

module.exports = {
  sendError,
  sendUserToken,
};
