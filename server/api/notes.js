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
      console.log('Notes: ', notes);
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