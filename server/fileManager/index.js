const upload = require('./uploadHandler');
const { insertFileIntoDB, getChildrenOfPath } = require('./filesDBManager');

module.exports = {
  upload,
  insertFileIntoDB,
  getChildrenOfPath,
};
