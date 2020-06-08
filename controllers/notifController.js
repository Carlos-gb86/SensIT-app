const Notif = require('../models/notificationModel');
//const User = require('../models/userModel');
const factory = require('./handlerFactory');

exports.setProjectUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.project) req.body.project = req.params.projectId;
  if (!req.body.receiver) req.body.receiver = req.params.userId;
  if (!req.body.sender) req.body.sender = req.user.id;
  next();
};

exports.getAllNotifs = factory.getAll(Notif);
exports.createNotif = factory.createOne(Notif);
exports.updateNotif = factory.updateOne(Notif);
exports.deleteNotif = factory.deleteOne(Notif);
