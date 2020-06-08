const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.post('/writeTempFile', viewController.writeTempFile);
router.get('/download/:filename', viewController.downloadFile);

router.get('/login', viewController.login);
router.get('/signup', viewController.signup);
router.get('/forgotPassword', viewController.forgotPassword);
router.get('/resetPassword/:token', viewController.resetPassword);

router.get('/', viewController.goIndex);
router.get('/manager', authController.isLoggedIn, viewController.index);
router.get('/new-project', authController.protect, viewController.newProject);
router.get('/about', authController.protect, viewController.about);
router.get('/contact', authController.protect, viewController.contact);
router.get(
  '/notifications',
  authController.protect,
  viewController.notifications
);

router.get('/profile', authController.protect, viewController.getProfile);
router.get('/settings', authController.protect, viewController.getSettings);

router.get('/project/:slug', viewController.getProject);
router.get('/viewer/:slug', viewController.inspectProject);

module.exports = router;
