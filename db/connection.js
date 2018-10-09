const monk = require('monk');
const db = monk('localhost/auth-db');

module.exports = db;
