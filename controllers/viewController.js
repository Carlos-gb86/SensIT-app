const path = require('path');
const fs = require('fs');

const Project = require('../models/projectModel');
const Notif = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('login');
});

exports.signup = catchAsync(async (req, res, next) => {
  res.status(200).render('signup');
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  res.status(200).render('forgotPassword');
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  res.status(200).render('resetPassword', {
    token,
  });
});

exports.goIndex = catchAsync(async (req, res, next) => {
  res.status(200).redirect('/manager');
});

exports.index = catchAsync(async (req, res, next) => {
  //Redirect users to login page is not logged in
  if (!req.user) res.status(200).redirect('/login');
  // Allow access only to user projects and public projects
  const preFilter = { $or: [{ users: req.user._id }, { public: true }] };

  const projects = await Project.find(preFilter);

  res.status(200).render('home', {
    projects,
  });
});

exports.newProject = catchAsync(async (req, res, next) => {
  res.status(200).render('newProject');
});

exports.about = catchAsync(async (req, res, next) => {
  res.status(200).render('about');
});

exports.contact = catchAsync(async (req, res, next) => {
  res.status(200).render('contact');
});

exports.notifications = catchAsync(async (req, res, next) => {
  const notifications = await Notif.find({
    receiver: req.user._id,
    deleted: false,
  });

  res.status(200).render('notifications', {
    notifications,
  });
});

exports.getProfile = (req, res) => {
  res.status(200).render('profile', {
    title: `My profile`,
  });
};

exports.getSettings = (req, res) => {
  res.status(200).render('settings', {
    title: `My settings`,
  });
};

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({ slug: req.params.slug });

  if (!project) {
    return next(new AppError('There is no project with that name!', 404));
  }

  res.status(200).render('project', {
    title: project.name,
    project,
  });
});

exports.inspectProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({ slug: req.params.slug });

  if (!project) {
    return next(new AppError('There is no project with that name!', 404));
  }

  res.status(200).render('viewer', {
    title: project.name,
    project,
  });
});

exports.writeTempFile = catchAsync(async (req, res, next) => {
  const data = req.body;

  let myDataString = '';

  myDataString += `Time/Coordinates,${data.data.positions}\n`;
  data.data.time.forEach((timeStamp, i) => {
    myDataString += `${timeStamp.replace(' ', '-')},${data.data.data[i]}\n`;
  });

  myDataString = myDataString.replace(/,/g, data.delimiter);

  const filename = `data-${Date.now()}.${data.extension}`;

  const filepath = path.join(__dirname, `../public/temp/${filename}`);

  fs.writeFile(filepath, myDataString, (err) => {
    if (err) throw err;
  });

  res.status(200).json({
    status: 'success',
    filename,
  });
});

exports.downloadFile = catchAsync(async (req, res, next) => {
  const { filename } = req.params;

  res.status(200).download(path.join(__dirname, `../public/temp/${filename}`));
});
