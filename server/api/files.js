const Express = require('express');
const { ObjectID } = require('mongodb');

const httpUtils = require('../utils/httpUtils');
const db = require('../db/connection');
const fm = require('../fileManager');

const users = db.get('users');

const router = Express.Router({ mergeParams: true });

router.post('/', fm.upload.single('uploads'), async (req, res, next) => {
  const clientFileInfo = req.body;
  const serverFileInfo = req.file;
  const activeId = ObjectID(clientFileInfo.activeDirectoryId);
  if (!activeId) {
    httpUtils.sendError(res, next, {
      msg: 'Must specify a folder to place file into.',
      status: 422,
    });
  }

  try {
    let activeDir = await fm.getDirectory(req.user._id, activeId);
    const pathElements = clientFileInfo.path.split('/').filter(string => string !== '');
    for (let i = 0; i < pathElements.length; i++) {
      const newDir = {
        name: `${pathElements[i]}/`,
        parent_id: activeDir._id,
        owner_id: req.user._id,
        access_list: [],
        type: fm.objectTypes.directory,
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
      local_path: serverFileInfo.path.replace(process.env.APP_FILE_ROOT, 'file:///'),
      name: serverFileInfo.originalname,
      parent_id: activeDir._id,
      access_list: [],
      type: fm.objectTypes.file,
      create_time: Date.now(),
      modified_time: Date.now(),
    };
    const insertedFile = await fm.createFile(newFile);
    if (!insertedFile) {
      httpUtils.sendError(res, next, { msg: 'Failed to create file.', status: 500 });
    }
    res.status(200);
    res.json({ message: 'ok' });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    httpUtils.sendError(res, next, { msg: 'Failed to create file.', status: 500 });
  }
});

async function createUserRoot(req, res, next) {
  const newDir = {
    name: '/',
    parent_id: null,
    owner_id: req.user._id,
    access_list: [],
    type: fm.objectTypes.directory,
    create_time: Date.now(),
    modified_time: Date.now(),
  };
  const insertedDir = await fm.createDirectory(newDir);
  if (!insertedDir) {
    httpUtils.sendError(res, next, { msg: 'Failed to create user root dir.', status: 500 });
  }

  const user = await users.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { root_dir_id: insertedDir._id } },
    { new: true },
  );
  return user;
}

router.get('/', async (req, res, next) => {
  if (!req.query.id) {
    let { user } = req; // Object destructuring: same as user = req.user
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
});

module.exports = router;
