const express = require('express');
const db = require('../db/connection');
const Joi = require('joi');
const httpUtils = require('../httpUtils');

const schema = Joi.object().keys({
  title: Joi.string().min(1).max(100).required(),
  note: Joi.string().min(1).max(500).required(),
});


const notes = db.get('notes');

const router = express.Router();

router.get("/", (req, res) => {
  const noteTemp = {
    user_id: req.user._id,
  };
  notes.find(noteTemp)
    .then((notes) => {
      notes.sort((a, b) => {
        const keyA = a.create_time;
        const keyB = b.create_time;
        if(keyA < keyB) {
          return 1;
        }
        if(keyA > keyB) {
          return -1;
        }
        return 0;
      });
      res.json(notes);
    });
});

router.post('/', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if(result.error === null) {
    //insert into db
    const note = {
      ...req.body,
      user_id: req.user._id,
      create_time: Date.now(),
    };
    notes.insert(note).then((note) => {
      res.json(note);
    });
  } else {
    const error = {
      msg: result.error,
      status: 422,
    };
    httpUtils.sendError(res, next, error);
  }
});

module.exports = router;