const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const notifRouter = require('./notifRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:userId/notifications', notifRouter);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect); // This applies authController.protect to all routes after this point

router.patch('/updateMyPassword', authController.updatePassword);

router.post('/sendMessage', userController.sendMessage);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

//router.use(authController.restrictTo('admin')); // This applies authController.restrictTo('admin') to all routes after this point

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
