const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');

const notifSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'A notification must have a message'],
      validate: [
        validator.isAscii,
        'The notification message must only contain characters',
      ],
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'A notification must have a project'],
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A notification must have a sender'],
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A notification must have a receiver'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

notifSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'sender',
    select: 'name photo',
  }).populate({
    path: 'project',
    select: 'name',
  });
  next();
});

notifSchema.statics.calcNumNotif = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: { receiver: userId, read: false },
    },
    {
      $group: {
        _id: '$receiver',
        numNotif: { $sum: 1 },
      },
    },
  ]);
  if (stats.length > 0) {
    await User.findByIdAndUpdate(userId, {
      notifications: stats[0].numNotif,
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      notifications: 0,
    });
  }
};

notifSchema.post('save', function () {
  // this points to the current model
  this.constructor.calcNumNotif(this.receiver);
});

notifSchema.pre(/^findOneAnd/, async function (next) {
  this.n = await this.findOne();
  next();
});

notifSchema.post(/^findOneAnd/, async function () {
  await this.n.constructor.calcNumNotif(this.n.receiver);
});

const Notif = mongoose.model('Notif', notifSchema);

module.exports = Notif;
