const express = require('express');
const notifController = require('../controllers/notifController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect); // This applies authController.protect to all routes after this point

router
  .route('/')
  .get(notifController.setProjectUserIds, notifController.getAllNotifs)
  .post(notifController.setProjectUserIds, notifController.createNotif);

router
  .route('/:id')
  .patch(notifController.updateNotif)
  .delete(notifController.deleteNotif);

module.exports = router;
