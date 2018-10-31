const upload = require('./uploadHandler');
const DBManager = require('./filesDBManager');
const objectTypes = require('./mongoObjectTypes');

module.exports = {
  upload,
  ...DBManager,
  objectTypes,
};
