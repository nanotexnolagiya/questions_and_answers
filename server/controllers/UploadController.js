const express = require('express')
const router = express.Router()
const { Uploads } = require('../models')
const upload = require('../utils/multer').any();

const all = async (req, res, next) => {
  const { limit, page = 1 } = req.query;
  try {
    const count = await Uploads.count();
    const pages = limit ? Math.ceil(count / limit) : 0;
    const offset = limit ? limit * (page - 1) : null;

    const uploads = await Uploads.findAll({
      limit,
      offset
    });

    res.status(200).json({
      ok: true,
      data: uploads,
      pageCount: pages
    });
  } catch (error) {
    next(error);
  }
}

const anyUpload = (req, res, next) => {
  upload(req, res, err => {
		let error = false;

		if (err) {
			if (err.code == 'LIMIT_FILE_SIZE') {
				error = 'Image > 3Mb';
			} else if (err.code == 'EXTENTION') {
				error = 'Only image .jpg, .png и .gif';
			}
		}

		if (error) {
      return res.json({
        ok: !error,
        error
      });
    } else {
      next();
    }
	});
}

const add = async (req, res, next) => {
  const data = [];

  try {  
    if (req.files && req.files.length !== 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const path = file.path.replace('public', '');
        const upload = await Uploads.create({
          path
        });
        data.push({
          id: upload.id,
          path: upload.path
        });
      }
      res.status(201).json({
        ok: true,
        data
      });
    } else {
      throw new ResponseException('Files not upload', 400);
    }
  } catch (error) {
    next(error);
  }
}

router.get('/', all);
router.post('/', anyUpload, add);


module.exports = router;