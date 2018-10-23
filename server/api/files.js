const Express = require('express');

const httpUtils = require('../utils/httpUtils');
const fm = require('../fileManager');

const router = Express.Router({ mergeParams: true });

router.post('/', fm.upload.single('uploads'), (req, res, next) => {
  fm.insertFileIntoDB(req.user._id, req.body, req.file)
    .then(() => {
      res.status(200);
      res.json({ message: 'ok' });
    })
    .catch((error) => {
      console.log(error.message);
      httpUtils.sendError(res, next, { msg: error.message, status: 500 });
    });
});

router.get('/', (req, res, next) => {
  console.log(req.query);
  fm.getChildrenOfPath(req.user._id, req.query.path)
    .then((children) => {
      res.status(200);
      res.json({ children });
    })
    .catch((error) => {
      httpUtils.sendError(res, next, { msg: error.message, status: 500 });
    });
});

module.exports = router;
