const Express = require('express');

const httpUtils = require('../utils/httpUtils');
const db = require('../db/connection');
const fm = require('../fileManager');

const users = db.get('users');

const router = Express.Router({ mergeParams: true });

router.post('/', fm.upload.single('uploads'), async (req, res, next) => {
  // const user = await users.findOne({ _id: req.user._id });
  const clientFileInfo = req.body;
  const serverFileInfo = req.file;
  const activeId = clientFileInfo.activeDirectoryId;
  console.log(clientFileInfo);
  try {
    let activeDir = await fm.getDirectory(req.user._id, activeId);
    const pathElements = clientFileInfo.path.split('/').filter(string => string !== '');
    for (let i = 0; i < pathElements.length; i++) {
      const newDir = {
        name: `${pathElements[i]}/`,
        // sub_dirs: [],
        // files: [],
        parent_id: activeDir._id.valueOf(),
        owner_id: req.user._id,
        access_list: [],
        type: 'directory',
        create_time: Date.now(),
        modified_time: Date.now(),
      };
      activeDir = await fm.createDirectory(newDir);
      if (!activeDir) {
        httpUtils.sendError(res, next, { msg: 'Failed to create directory.', status: 500 });
      }
    }
    const newFile = {
      owner_id: req.user._id,
      local_path: serverFileInfo.path.replace(process.env.APP_FILE_ROOT, ''),
      name: serverFileInfo.originalname,
      parent_id: activeDir._id.valueOf(),
      access_list: [],
      type: 'file',
      create_time: Date.now(),
      modified_time: Date.now(),
    };
    const insertedFile = await fm.createFile(newFile);
    if (!insertedFile) {
      httpUtils.sendError(res, next, { msg: 'Failed to create file.', status: 500 });
    }
    console.log(insertedFile);
    res.status(200);
    res.json({ message: 'ok' });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
  }

  // fm.insertFileIntoDB(req.user._id, req.body, req.file)
  //   .then(() => {
  //     res.status(200);
  //     res.json({ message: 'ok' });
  //   })
  //   .catch((error) => {
  //     console.log(error.message);
  //     httpUtils.sendError(res, next, { msg: error.message, status: 500 });
  //   });
});

async function createUserRoot(req, res, next) {
  const newDir = {
    name: '/',
    // sub_dirs: [],
    // files: [],
    parent_id: null,
    owner_id: req.user._id,
    access_list: [],
    create_time: Date.now(),
    modified_time: Date.now(),
  };
  const insertedDir = await fm.createDirectory(newDir);
  if (!insertedDir) {
    httpUtils.sendError(res, next, { msg: 'Failed to create user root dir.', status: 500 });
  }
  const user = await users.findOneAndUpdate(
    { _id: req.user._id },
    { root_dir_id: insertedDir._id },
    { new: true },
  );
  return user;
}

router.get('/', async (req, res, next) => {
  console.log(req.query);
  if (!req.query.id) {
    console.log('Looking up root_dir');
    let user = await users.findOne({ _id: req.user._id });
    if (!user) {
      httpUtils.sendError(res, next, { msg: 'Cannot access user', status: 500 });
    }
    if (!user.root_dir_id) {
      user = await createUserRoot(req, res, next);
    } else {
      const rootDir = await fm.getDirectory(req.user._id, user.root_dir_id);
      if (!rootDir) {
        user = await createUserRoot(req, res, next);
      }
    }
    req.query.id = user.root_dir_id;
  }
  const children = await fm.getChildren(req.user._id, req.query.id);
  res.status(200);
  res.json({ parentId: req.query.id, children });
  // fm.getChildrenOfPath(req.user._id, req.query.path)
  //   .then((children) => {
  //     res.status(200);
  //     res.json({ children });
  //   })
  //   .catch((error) => {
  //     httpUtils.sendError(res, next, { msg: error.message, status: 500 });
  //   });
});

async function insertFileIntoDB(user, clientFileInfo, serverFileInfo) {
  // await dbLock.acquireAsync();
  // try {
  //   const parentDir = await findDirByPath(userId, clientFileInfo.path);
  //   const newFile = {
  //     owner_id: userId,
  //     local_path: serverFileInfo.path.replace(process.env.APP_FILE_ROOT, ''),
  //     name: serverFileInfo.originalname,
  //     parent_id: parentDir._id,
  //     access_list: [],
  //     create_time: Date.now(),
  //     modified_time: Date.now(),
  //   };
  //   const insertedFile = await createFile(newFile, parentDir);
  //   return insertedFile;
  // } finally {
  //   dbLock.release();
  // }
}

module.exports = router;
