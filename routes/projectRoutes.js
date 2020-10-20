const express = require('express');
const projectController = require('../controllers/projectController');
const userRouter = require('./userRoutes');
const authController = require('../controllers/authController');

const router = express.Router();

router.use('/:projectId/users', userRouter);

router.use(authController.protect); // This applies authController.protect to all routes after this point

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(
    projectController.uploadSingleFieldImages,
    projectController.resizeProjectImages,
    projectController.setUserId,
    projectController.parseLocation,
    projectController.createProject
  );

router.post('/getData', projectController.loadData);

router.patch(
  '/uploadBimModelFile/:id',
  projectController.uploadSingleFieldModel,
  projectController.updateProject
);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(
    projectController.uploadMultipleFieldImages,
    projectController.resizeProjectImages,
    projectController.parseSensorData,
    projectController.updateProject
  )
  .delete(authController.restrictToCreator, projectController.deleteProject);

module.exports = router;
