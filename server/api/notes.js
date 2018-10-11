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

router.post('/manage', (req, res, next) => {
  const localSchema = Joi.object().keys({
    title: Joi.string().min(1).max(100).required(),
    note: Joi.string().min(1).max(500).required(),
    _id: Joi.string().alphanum(),
    user_id: Joi.string().alphanum(),
    create_time: Joi.number().greater(0),
  });
  console.log(req.body);
  if(!req.body.action || !req.body.note ||
    !req.body.note._id || !req.body.note.user_id){

    httpUtils.sendError(res, next, {
      msg: 'Malformed request',
      status: 400,
    });
    return;
  }

  const action = req.body.action;
  const note = req.body.note;
  const result = Joi.validate(note, localSchema);
  if(note.user_id !== req.user._id){
    httpUtils.sendError(res, next, {
      msg: 'Unathorized',
      status: 401,
    });
    return;
  }

  if(result.error !== null){
    httpUtils.sendError(res, next, {
      msg: result.error,
      status: 422,
    });
    return;
  }

  notes.findOne(note).then((note) => {
    if(!note){
      httpUtils.sendError(res, next, {
        msg: 'Note not found',
        status: 410,
      })
      return;
    }
    if(action === 'delete'){
      res.json({status: 'Server deleting'});
    } else {
      httpUtils.sendError(res, next, {
        msg: 'Unrecognized Action',
        status: 400,
      })
    }
  });
  console.log(dbNote);
  res.json({status: 'OK'});
})

module.exports = router;