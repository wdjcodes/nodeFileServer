const Joi = require('joi');

const Schemas = require('./schemas');
const db = require('../db/connection');

const files = db.get('files');
files.createIndex(
  {
    owner_id: 1,
    parent_id: 1,
    name: 1,
  },
  { unique: true },
);
const directories = db.get('directories');
directories.createIndex(
  {
    owner_id: 1,
    parent_id: 1,
    name: 1,
  },
  { unique: true },
);

async function getChildren(userId, dirId) {
  const subDirs = await directories.find(
    { owner_id: userId, parent_id: dirId },
    { name: 1, type: 1 },
  );
  const subFiles = await files.find({ owner_id: userId, parent_id: dirId }, { name: 1, type: 1 });
  return subDirs.concat(subFiles);
}

async function getDirectory(userId, dirId) {
  console.log(dirId);
  console.log(dirId.valueOf());
  const dir = await directories.findOne({ _id: dirId });
  if (dir && !dir.owner_id.equals(userId)) {
    throw new Error('Unauthorized file access.');
  }

  return dir;
}

async function createFile(file) {
  console.log(file.local_path);
  const validate = Joi.validate(file, Schemas.mongoFileSchema);
  if (validate.error) {
    throw new Error(validate.error.message);
  }

  try {
    const insertedFile = await files.insert(file);
    if (insertedFile) {
      return insertedFile;
    }
    throw new Error('Failed to create file.');
  } catch (error) {
    throw error;
  }
}

async function createDirectory(dir) {
  try {
    const newDir = await directories.findOneAndUpdate(
      { owner_id: dir.owner_id, parent_id: dir.parent_id, name: dir.name },
      { $setOnInsert: { ...dir } },
      { new: true, upsert: true },
    );
    if (newDir) {
      return newDir;
    }
    throw new Error('Failed to create directory.');
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getDirectory,
  createFile,
  createDirectory,
  getChildren,
};
