//const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Client = require('ftp');
const Project = require('../models/projectModel');
//const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const imageStorage = multer.memoryStorage();

const modelStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/bim-models');
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split('.').slice(-1);
    req.body.bimModel = `project-${
      req.params.id
    }-${Date.now()}-bimModel.${extension}`;
    cb(null, req.body.bimModel);
  },
});

const multerImageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(`Not an image! Please, upload only images`, 400), false);
  }
};

const multerModelFilter = (req, file, cb) => {
  const allowedExtensions = ['fbx', 'dae'];
  const extension = file.originalname.split('.').slice(-1);

  req.body.extension = extension;
  if (allowedExtensions.indexOf(extension[0]) > -1) {
    cb(null, true);
  } else {
    cb(
      new AppError(`The selected model extension is not supported`, 400),
      false
    );
  }
};

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: multerImageFilter,
});

const uploadModel = multer({
  storage: modelStorage,
  fileFilter: multerModelFilter,
});

exports.uploadSingleFieldModel = uploadModel.fields([
  { name: 'bimModel', maxCount: 1 },
]);

exports.uploadMultipleFieldImages = uploadImage.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);

exports.uploadSingleFieldImages = uploadImage.fields([
  { name: 'thumbnail', maxCount: 1 },
]);

//exports.uploadProjectImages = upload.array('images', 5);

exports.resizeProjectImages = catchAsync(async (req, res, next) => {
  if (req.files) {
    if (req.files.thumbnail) {
      //1) Thumbnail
      req.body.thumbnail = `project-${
        req.params.id
      }-${Date.now()}-thumbnail.jpeg`;

      await sharp(req.files.thumbnail[0].buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/projects/${req.body.thumbnail}`);
    }

    if (req.files.images) {
      //2 Images
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (file, i) => {
          const filename = `project-${req.params.id}-${Date.now()}-${
            i + 1
          }.jpeg`;

          await sharp(file.buffer)
            .resize(1600, 900)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/projects/${filename}`);

          req.body.images.push(filename);
        })
      );
    }
  }
  next();
});

exports.setUserId = (req, res, next) => {
  if (!req.body.createdBy) req.body.createdBy = req.user.id;
  if (!req.body.users) req.body.users = req.user.id;
  next();
};
exports.parseLocation = (req, res, next) => {
  if (typeof req.body.location === 'string') {
    req.body.location = JSON.parse(req.body.location);
  }
  next();
};

exports.parseSensorData = (req, res, next) => {
  if (req.body.sensors) {
    req.body.sensors = JSON.parse(req.body.sensors);
  }
  next();
};

exports.loadData = async (req, res, next) => {
  const { name, type } = req.body;

  let folder;
  let file;

  if (type === 'sensor') {
    folder = 'database/sensors';
    file = `${name}-sensor.json`;
  } else {
    folder = 'database/contours';
    file = `${name}-contour.json`;
  }

  const emptyString = '';

  const getFileFTP = async (contentString, folder, file) => {
    const c = new Client();

    c.connect({
      host: 'ftp.thesensitproject.com',
      user: 'thesensitproject.com',
      password: 'Sensit123',
    });

    c.on('ready', function () {
      c.cwd(folder, function (err1) {
        if (err1) throw err1;

        c.get(file, function (err2, stream) {
          if (err2) throw err2;

          stream.on('data', function (chunk) {
            contentString += chunk.toString();
          });

          stream.on('end', function () {
            // content variable now contains all file content.
            const fileContent = JSON.parse(contentString, 'utf-8');
            //const fileContent = await JSON.parse(fs.readFileSync(path, 'utf-8'));

            res.status(200).json({
              status: 'success',
              data: {
                data: fileContent,
              },
            });
          });
        });
      });
    });
  };

  getFileFTP(emptyString, folder, file);
};

exports.getAllProjects = factory.getAll(Project);
exports.getProject = factory.getOne(Project, { path: 'reviews' });
exports.createProject = factory.createOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);
