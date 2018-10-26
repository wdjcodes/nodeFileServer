const AwaitLock = require('await-lock');

const db = require('../db/connection');

const users = db.get('users');
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

const dbLock = new AwaitLock();

/**
 * We might be able to remove this
 * @param {Object} parentDir mongodb object representing the parent directory
 * @param {String} childName name of the child to be inserted
 *
 * @returns True if name is unique within the parentDir, false otherwise
 */
function isChildNameUnique(parentDir, childName) {
  for (let i = 0; i < parentDir.sub_dirs.length; i++) {
    if (parentDir.sub_dirs[i].name === childName) {
      return false;
    }
  }

  for (let i = 0; i < parentDir.files.length; i++) {
    if (parentDir.files[i].name === childName) {
      return false;
    }
  }

  return true;
}

// async function createDirectory(userId, parentId, dirName) {
//   const newDir = {
//     name: dirName.endsWith('/') ? dirName : `${dirName}/`,
//     sub_dirs: [],
//     files: [],
//     parent_id: parentId,
//     owner_id: userId,
//     access_list: [],
//     create_time: Date.now(),
//     modified_time: Date.now(),
//   };

//   if (parentId) {
//     const parentDir = await directories.findOne({ _id: parentId });
//     if (isChildNameUnique(parentDir, dirName)) {
//       const insertedDir = await directories.insert(newDir);
//       await directories.findOneAndUpdate(
//         { _id: parentId },
//         { $push: { sub_dirs: { id: insertedDir._id, name: insertedDir.name } } },
//       );
//       return insertedDir;
//     }
//     return directories.findOne({ parent_id: parentId, name: dirName });
//   }
//   const rootDir = await directories.findOne({
//     owner_id: userId,
//     parent_id: null,
//   });
//   if (!rootDir) {
//     return directories.insert(newDir);
//   }
//   return rootDir;
// }

async function getUserRootDir(userId) {
  const user = await users.findOne({ _id: userId });
  if (user) {
    if (user.root_dir_id) {
      const rootDir = await directories.findOne({ _id: user.root_dir_id });
      if (rootDir && rootDir.owner_id === userId) {
        return rootDir;
      }
      throw new Error(`User: ${userId}, has lost their root directory!`);
    }
    const rootDir = await createDirectory(userId, null, '/');
    await users.findOneAndUpdate(user, { $set: { root_dir_id: rootDir._id } });
    return rootDir;
  }
  throw new Error(`User: ${userId} was not found`);
}

/**
 * Returns the mongo entry of the lowest level subdirectory in path.
 * Creates mongo entries for any directories that do not exist.
 *
 * @param {number} userId The mongodb unique identifier for the owner of the directories.
 * @param {string} path A string representing the path to the file as seen by the client.
 *
 * @returns {object} An object representing the mongo entry for the lowest level
 *                   directory in the path.
 */
async function findDirByPath(userId, path) {
  const pathElements = path.split('/').filter(string => string !== '');
  const userRootDir = await getUserRootDir(userId);
  let parentDir = userRootDir;
  for (let i = 0; i < pathElements.length; i++) {
    const dirQuery = {
      name: `${pathElements[i]}/`,
      parent_id: parentDir._id,
    };
    const dirObject = await directories.findOne(dirQuery);
    if (dirObject) {
      parentDir = dirObject;
    } else {
      const newDir = await createDirectory(userId, pathElements[i], parentDir._id);
      parentDir = newDir;
    }
  }
  return parentDir;
}

/**
 * Returns the mongo entry of the lowest level subdirectory in path.

 *
 * @param {number} userId The mongodb unique identifier for the owner of the directories.
 * @param {string} path A string representing the path to the file as seen by the client.
 *
 * @returns {object} An object representing the mongo entry for the lowest level
 *                   directory in the path, if it exists; otherwise, null.
 */
async function getDirByPath(userId, path) {
  const pathElements = path.split('/').filter(string => string !== '');
  const userRootDir = await getUserRootDir(userId);
  let parentDir = userRootDir;

  for (let i = 0; i < pathElements.length; i++) {
    const dirQuery = {
      name: `${pathElements[i]}/`,
      parent_id: parentDir._id,
    };
    const dirObject = await directories.findOne(dirQuery);
    if (dirObject) {
      parentDir = dirObject;
    } else {
      return null;
    }
  }
  return parentDir;
}

async function getChildrenOfPath(userId, path) {
  let parentDir = null;
  await dbLock.acquireAsync();
  try {
    parentDir = await getDirByPath(userId, path);
  } finally {
    dbLock.release();
  }

  if (!parentDir) {
    throw new Error(`Path: ${path} does not exist`);
  }
  const children = [];
  for (let i = 0; i < parentDir.sub_dirs.length; i++) {
    const child = parentDir.sub_dirs[i];
    children.push({ name: child.name, type: 'directory' });
  }

  for (let i = 0; i < parentDir.files.length; i++) {
    const child = parentDir.files[i];
    children.push({ name: child.name, type: 'file' });
  }

  return children;
}

async function getChildren(userId, dirId) {
  const subDirs = await directories.find(
    { owner_id: userId, parent_id: dirId },
    { name: 1, type: 1 },
  );
  const subFiles = await files.find({ owner_id: userId, parent_id: dirId }, { name: 1, type: 1 });
  return subDirs.concat(subFiles);
}

async function getDirectory(userId, dirId) {
  const dir = await directories.findOne({ _id: dirId });

  if (dir && dir.owner_id.valueOf() !== userId) {
    throw new Error('Unauthorized file access.');
  }

  return dir;
}

async function createFile(file) {
  try {
    const insertedFile = await files.insert(file);
    if (insertedFile) {
      // await directories.findOneAndUpdate(
      //   { _id: parentId },
      //   {
      //     $push: { files: { id: insertedFile._id, name: insertedFile.name } },
      //     $set: { modified_time: Date.now() },
      //   },
      // );
      return insertedFile;
    }
    throw new Error('Failed to create file.');
  } catch (error) {
    throw error;
  }
}

async function createDirectory(dir) {
  // const newDir = {
  //   name: dirName.endsWith('/') ? dirName : `${dirName}/`,
  //   sub_dirs: [],
  //   files: [],
  //   parent_id: parentId,
  //   owner_id: userId,
  //   access_list: [],
  //   create_time: Date.now(),
  //   modified_time: Date.now(),
  // };
  try {
    const newDir = await directories.findOneAndUpdate(
      { owner_id: dir.owner_id, parent_id: dir.parent_id, name: dir.name },
      { $setOnInsert: { ...dir } },
      { new: true, upsert: true },
    );
    // const newDir = await directories.insert(dir);
    if (newDir) {
      // await directories.findOneAndUpdate(
      //   { _id: parentId },
      //   {
      //     $push: { files: { id: newDir._id, name: newDir.name } },
      //     $set: { modified_time: Date.now() },
      //   },
      // );
      return newDir;
    }
    throw new Error('Failed to create directory.');
  } catch (error) {
    throw error;
    // const existingDir = await directories.findOne(owner_id: )
  }
}

// async function createFile(file, parentDir) {
//   if (isChildNameUnique(parentDir, file.name)) {
//     const insertedFile = await files.insert(file);
//     await directories.findOneAndUpdate(parentDir, {
//       $push: { files: { id: insertedFile._id, name: insertedFile.name } },
//       $set: { modified_time: Date.now() },
//     });
//     return insertedFile;
//   }
//   throw new Error(`File with file name, ${file.name}, already exists in this folder`);
// }

module.exports = {
  // insertFileIntoDB,
  // getChildrenOfPath,
  getDirectory,
  createFile,
  createDirectory,
  getChildren,
};
