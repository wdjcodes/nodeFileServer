const Express = require('express');
const Joi = require('joi');

const db = require('../db/connection');
const httpUtils = require('../utils/httpUtils');
const upload = require('../utils/uploadHandler');

const filesDB = db.get('files');

const router = Express.Router();

router.post('/', upload.single('uploads'), (req, res, next) => {
  console.log('Hello from api/v1/files');
  console.log(req.body);
  // console.log(req.file);
  // TODO: Get the parentPath from the client
  // const parentPath = '/';
  // const
  // createFileInDB()
  res.status(200);
  res.json({ message: 'ok' });
});

module.exports = router;
