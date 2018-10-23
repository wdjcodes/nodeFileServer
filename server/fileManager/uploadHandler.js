const Multer = require('multer');
const fs = require('fs');
const util = require('util');
const UUIDv4 = require('uuid/v4');

function ensureUniqueFilePath(_req, path, name) {
  let nicePath;
  if (path.endsWith('/')) {
    nicePath = path;
  } else {
    nicePath = `${path}/`;
  }
  return util
    .promisify(fs.access)(nicePath + name, fs.constants.F_OK)
    .then(() => util
      .promisify(fs.readdir)(nicePath, { withFileTypes: true })
      .then((files) => {
        let dirs = [];
        for (let i = 0; i < files.length; i++) {
          if (files[i].isDirectory()) {
            dirs = [...dirs, files[i]];
          }
        }
        return dirs;
      })
      .then(async (dirs) => {
        let found = false;
        for (let i = 0; i < dirs.length; i++) {
          try {
            await util.promisify(fs.access)(`${nicePath + dirs[i].name}/${name}`);
          } catch (error) {
            found = true;
            nicePath += dirs[i].name;
            break;
          }
        }
        if (!found) {
          nicePath += dirs.length + 1;
        }
        return nicePath;
      }))
    .catch((error) => {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      return nicePath;
    });
}

const storage = Multer.diskStorage({
  destination(req, _file, next) {
    const usrRoootDir = req.user._id;
    const uploadDir = process.env.APP_FILE_ROOT + usrRoootDir;
    req.fileName = UUIDv4();
    ensureUniqueFilePath(req, uploadDir, req.fileName)
      .then((path) => {
        fs.mkdir(path, { mode: 0o660 }, (error) => {
          if (error && error.code !== 'EEXIST') {
            next(new Error('Failed to create upload Directory'));
          } else {
            next(null, path);
          }
        });
      })
      .catch((error) => {
        next(error);
      });
  },
  filename(req, _file, next) {
    next(null, req.fileName);
  },
});

const upload = Multer({ storage });

module.exports = upload;
