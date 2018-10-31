const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const db = require('../db/connection');
const httpUtils = require('../utils/httpUtils');

const users = db.get('users');
users.createIndex('username', { unique: true });

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9_.-]*$/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#@$%&?*])[a-zA-Z0-9!#@$%&?*]{8,30}$/)
    .required(),
});

const router = express.Router();

const loginError = {
  msg: '😿 Invalid Username/Password 😿',
  status: 422,
};

router.get('/', (req, res) => {
  res.json({
    message: '🔐 Auth 🔐',
  });
});

router.post('/signup', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    users
      .findOne({
        username: req.body.username,
      })
      .then((user) => {
        if (user) {
          // User exists
          const signupError = {
            msg: '🙉 Username is taken 🙉',
            status: 409,
          };
          httpUtils.sendError(res, next, signupError);
        } else {
          bcrypt.hash(req.body.password.trim(), 12).then((hashedPass) => {
            const newUser = {
              username: req.body.username,
              password: hashedPass,
            };
            users.insert(newUser).then((insertedUser) => {
              const resUser = { ...insertedUser };
              delete resUser.password;
              httpUtils.sendUserToken(res, next, resUser);
            });
          });
        }
      });
  } else {
    const signupError = {
      msg: result.error,
      status: 422,
    };
    httpUtils.sendError(res, next, signupError);
  }
});

router.post('/login', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    users
      .findOne({
        username: req.body.username,
      })
      .then((user) => {
        if (user) {
          bcrypt.compare(req.body.password, user.password).then((match) => {
            if (match === true) {
              const resUser = { ...user };
              delete resUser.password;
              httpUtils.sendUserToken(res, next, resUser);
            } else {
              httpUtils.sendError(res, next, loginError);
            }
          });
        } else {
          httpUtils.sendError(res, next, loginError);
        }
      });
  } else {
    httpUtils.sendError(res, next, loginError);
  }
});

module.exports = router;
