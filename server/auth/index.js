const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const db = require('../db/connection');
const jwt = require('jsonwebtoken');

const users = db.get('users');
users.createIndex('username', { unique: true });

const schema = Joi.object().keys({
    username: Joi.string().regex(/^[a-zA-Z0-9\_\.\-]*$/).min(2).max(30).required(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#@$%&?*])[a-zA-Z0-9!#@$%&?*]{8,30}$/).required()
});

const router = express.Router();

const loginError = {
  msg: "😿 Invalid Username/Password 😿",
  status: 422,
};

router.get("/", (req, res) => {
    res.json({
        message: "🔐 Auth 🔐"
    });
});

function sendError(res, next, errorObj){
  res.status(errorObj.status);
  const error = new Error(errorObj.msg);
  next(error);
}

function sendUserToken(res, next, user) {
  const jwtPayload = {
    _id: user._id,
    username: user.username,
  };

  jwt.sign(jwtPayload, process.env.TOKEN_SECRET, { expiresIn: '1d' },
  (error, token) => {
    if (error) {
      sendError(res, next, loginError);
    } else {
      res.json({ token });
    }
  });
};

router.post("/signup", (req, res, next) => {
    console.log('body', req.body);
    const result = Joi.validate(req.body, schema);
    if(result.error === null){
        users.findOne({
            username: req.body.username
        }).then(user => {
            if(user){
                //User exists
              const signupError = {
                msg: '🙉 Username is taken 🙉',
                status: 409,
              }
              sendError(res, next, signupError);
            } else {
                bcrypt.hash(req.body.password.trim(), 12).then(hashedPass =>{
                    const newUser = {
                        username: req.body.username,
                        password: hashedPass
                    };
                    users.insert(newUser).then(insertedUser =>{
                        delete insertedUser.password;
                        sendUserToken(res, next, insertedUser);
                    })
                })
            }
        })
    } else {
      const signupError = {
        msg: result.error,
        status: 422,
      };
      sendError(res, next, signupError);
    }

    //res.json(result);
});

router.post("/login", (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if(result.error === null){
    users.findOne( {
      username: req.body.username,
    }).then((user) => {
      if(user){
        bcrypt.compare(req.body.password, user.password).then((match) => {
          if(match === true){
            sendUserToken(res, next, user);
          } else {
            sendError(res, next, loginError);
          }
        })
      } else {
        sendError(res, next, loginError);
      }
    })
  } else {
    sendError(res, next, loginError);
  }
})

module.exports = router;