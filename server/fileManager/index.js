const upload = require('./uploadHandler');
const DBManager = require('./filesDBManager');

module.exports = {
  upload,
  ...DBManager,
  // insertFileIntoDB,
  // getChildrenOfPath,
};
