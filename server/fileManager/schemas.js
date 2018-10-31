const JoiBase = require('joi');
const JoiObjectID = require('joi-mongodb-objectid');

const mot = require('./mongoObjectTypes');

const Joi = JoiBase.extend(JoiObjectID);

const mongoObjectSymbols = {
  file: [mot.file, Symbol('file')],
  directory: [mot.directory, Symbol('directory')],
};

const mongoFileSchema = Joi.object().keys({
  owner_id: Joi.objectId(),
  local_path: Joi.string()
    .uri({ scheme: 'file' })
    .regex(/^(?!.*\.\.([^a-zA-Z0-9_]|$)).*$/),
  name: Joi.string()
    .trim()
    .min(1)
    .max(45),
  parent_id: Joi.objectId(),
  access_list: Joi.array().items(Joi.objectId()),
  type: Joi.symbol().map([mongoObjectSymbols.file]),
  create_time: Joi.date()
    .timestamp('javascript')
    .max('now'),
  modified_time: Joi.date()
    .timestamp('javascript')
    .max('now'),
});

const mongoDirectorySchema = Joi.object().keys({
  owner_id: Joi.objectId(),
  name: Joi.string()
    .trim()
    .min(1)
    .max(45),
  parent_id: Joi.objectId(),
  access_list: Joi.array().items(Joi.objectId()),
  type: Joi.symbol().map([mongoObjectSymbols.directory]),
  create_time: Joi.date()
    .timestamp('javascript')
    .max('now'),
  modified_time: Joi.date()
    .timestamp('javascript')
    .max('now'),
});

module.exports = {
  mongoFileSchema,
  mongoDirectorySchema,
};
