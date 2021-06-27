/* eslint-disable*/
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { togglePasswordVisibility } from './togglePassVisibility';
import { toggleUserMenu, closeUserMenu } from './topNav';
import { toggleAdvancedSearch } from './advancedSearch';
import {
  toggleSortMenu,
  closeSortMenu,
  expandProjectItem,
} from './projectList';
import { openUserSearch } from './userSearch';
import { changeTab } from './userAccount';
import {
  toggleSideBar,
  toggleViewerTabs,
  addRemoveSensor,
  setMaxDateToToday,
  toggleInputDates,
  showPlot,
  uploadBimModelFile,
  updateModelFileName,
  uploadSensorData,
  populateSensorFiletree,
  populateDownloadSensorList,
  populateSensorList,
  displaySensorInfo,
  writeAndDownloadFile,
} from './viewer';
import { toogleFileTreeFolder } from './tree';
import { runBIM } from './bimviewer/bimModelViewer';
import { importData } from './readFile';
import { plotData, updateTimeSlider, onPlotControlsClick } from './plotData';
import { signup } from './signup';
import { login, guestLogin, logout } from './login';
import { updateData } from './updateData';
import { forgotPassword } from './forgotPassword';
import { resetPassword } from './resetPassword';
import { sendMessage } from './sendMessage';
import { filterProjects, sortProjects } from './searchProject';
import { createNewProject, updateThumbnailFileName } from './createProject';
import { updateProject } from './updateProject';
import { showDeleteOptions } from './deleteProject';
import { handleNotifications } from './notifications';
//import * as dbx from './getFilefromDropbox';

//DOM Elements
const mapBox = document.getElementById('map');

const password_icon = document.getElementById('password-icon');
const confirmPassword_icon = document.getElementById('confirm-password-icon');
const oldPassword_icon = document.getElementById('old-password-icon');
const newPassword_icon = document.getElementById('new-password-icon');
const confirmNewPassword_icon = document.getElementById(
  'confirm-new-password-icon'
);

const userDropdownMenu = document.getElementById('user-menu');
const userMenuButton = document.getElementById('user-menu--btn');

const advancedSearch = document.getElementById('advanced-search');
const advancedSearchSwitch = document.getElementById('advanced-search--btn');
const advancedSearchFilters = document.getElementById(
  'advanced-search-filters'
);

const userSearchMenu = document.getElementById('user-search');

const sortMenuIcon = document.getElementById('sort-btn');
const sortMenu = document.getElementById('sort-menu');

const profileTab = document.getElementById('profile-tab');
const settingsTab = document.getElementById('settings-tab');

const sidebar = document.getElementById('viewer-sidebar');
const sidebarContent = document.getElementById('viewer-sidebar__content');
const sidebarBtn = document.getElementById('viewer-sidebar__btn');

const downloadBtn = document.getElementById('download');

const availableSensors = document.getElementById('available-sensors');
const selectedSensors = document.getElementById('selected-sensors');

const timeRange = document.getElementById('timeRange');
const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');

const bimContainer = document.querySelector('.canvas-container');
var project;
var sensorDataPath;

const plotBtn = document.querySelector('.plot__btn');
const plotCloseBtn = document.querySelector('.plot-close--btn');
const plotContainer = document.getElementById('plot-container');

const visualizeBtn = document.querySelector('.visualize__btn');
const visualizeCloseBtn = document.getElementById('visualization-close--btn');

const timeSlider = document.getElementById('timeSteps');

const backBtn = document.getElementById('back--btn');
const playBtn = document.getElementById('play--btn');
const forwardBtn = document.getElementById('forward--btn');
var interval;
var activePlot;
var sensorData;
var contourData;

const signupForm = document.querySelector('.form-signup');
const loginForm = document.querySelector('.form-login');
const guestLoginBtn = document.querySelector('.guest');
const forgotPasswordForm = document.querySelector('.form-forgot');
const logoutBtn = document.getElementById('logout-btn');

const searchForm = document.getElementById('projectSearch');
const searchField = document.getElementById('searchField');

const thumbnailBtn = document.getElementById('thumbnail-upload');
const bimModelBtn = document.getElementById('bimModel-upload');
const uploadSensorsBtn = document.getElementById('sensorData-upload');

const createProjectForm = document.querySelector('.new-project__form');
const updateProjectForm = document.querySelector('.general__form');
const deleteBtn = document.getElementById('delete-btn');

const resetForm = document.querySelector('.form-resetPass');

const contactForm = document.querySelector('.contact__form');

const profileForm = document.querySelector('.profile__form');
const settingsForm = document.querySelector('.settings__form');

const notifList = document.querySelector('.notif-list');

//Delegation

/* Mapbox function */
if (mapBox) {
  displayMap(mapBox);
}

/* Password visibility */
if (password_icon) {
  togglePasswordVisibility(password_icon, 'password');
}
if (confirmPassword_icon) {
  togglePasswordVisibility(confirmPassword_icon, 'confirm-password');
}
if (oldPassword_icon) {
  togglePasswordVisibility(oldPassword_icon, 'old-password');
}
if (newPassword_icon) {
  togglePasswordVisibility(newPassword_icon, 'new-password');
}
if (confirmNewPassword_icon) {
  togglePasswordVisibility(confirmNewPassword_icon, 'confirm-new-password');
}

/* Toggle user Menu */
if (userMenuButton) {
  toggleUserMenu(userMenuButton, userDropdownMenu);
}

/* Switch Advanced Search */
if (advancedSearch) {
  toggleAdvancedSearch(
    advancedSearch,
    advancedSearchSwitch,
    advancedSearchFilters
  );
  /* Change year text based on slider */
  document.getElementById('year-range').addEventListener('input', () => {
    document.getElementById('year').value = document.getElementById(
      'year-range'
    ).value;
  });
  /* Change slider based on year text */
  document.getElementById('year').addEventListener('input', () => {
    document.getElementById('year-range').value = document.getElementById(
      'year'
    ).value;
  });
}

/* Toggle sort Menu */
if (sortMenuIcon) {
  toggleSortMenu(sortMenuIcon, sortMenu);
}

//** VIEWER SECTION */
/* Switch between tabs in User Profile*/
if (profileTab && settingsTab) {
  changeTab(profileTab, settingsTab);
}

/* Expand and contract sidebar in Viewer*/
if (sidebarBtn) toggleSideBar(sidebar, sidebarContent, sidebarBtn);

/* Set the maximum date of the date range to today */
if (toDate) setMaxDateToToday(toDate);

/* Define global varibles */
if (bimContainer) {
  project = JSON.parse(bimContainer.dataset.sensitProject);

  if (project.sensors.length > 0) {
    sensorDataPath = project.sensors[0].filename;
  }
}

/* Load and Display BIM Model */
if (bimContainer) {
  // const project = JSON.parse(bimContainer.dataset.sensitProject);

  if (!project.bimModel) {
    const uploadModelForm = document.querySelector('.uploadModel__form');
    uploadBimModelFile(uploadModelForm, project.id);
    updateModelFileName(bimModelBtn);
  }

  if (project.bimModel) runBIM(project.bimModel);
}

if (visualizeBtn) {
  visualizeBtn.addEventListener('click', () => {
    //const file = '/contour-plots/lillaEdetTest.json';
    const paramInput = document.getElementById('select-params').value;
    const param = paramInput === 'selectParams' ? 'cracks' : paramInput;
    document.querySelector('.spinner').classList.remove('hide-spinner');
    runBIM(project.bimModel, contourData, param);
    visualizeCloseBtn.classList.remove('hide-btn');
  });
}

if (visualizeCloseBtn) {
  visualizeCloseBtn.addEventListener('click', () => {
    visualizeCloseBtn.classList.add('hide-btn');
    const guiElement = document.getElementById('gui');
    guiElement.parentElement.removeChild(guiElement);
    document.querySelector('.spinner').classList.remove('hide-spinner');
    runBIM(project.bimModel);
  });
}

/* Load sensor data */
if (uploadSensorsBtn) {
  // const project = JSON.parse(bimContainer.dataset.sensitProject);
  uploadSensorData(uploadSensorsBtn, project.id);
}

/* Populate available sensor list */
if (availableSensors) {
  // const project = JSON.parse(bimContainer.dataset.sensitProject);
  if (project.sensors) {
    populateSensorList(availableSensors, project.sensors);
    populateSensorFiletree(project.sensors);
    populateDownloadSensorList(project.sensors);
  }
}

/* If Path is defined, then import Sensor Data */

if (sensorDataPath) {
  importData(sensorDataPath, 'sensor').then((data) => {
    sensorData = data;
  });
  importData(sensorDataPath, 'contour').then((data) => {
    contourData = data;
  });
}

/* Download data */
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    if (project.sensors) {
      writeAndDownloadFile(sensorData, project.sensors);
    }
  });
}

/*Hide the plot area */
if (plotCloseBtn) {
  plotCloseBtn.addEventListener('click', (event) => {
    plotContainer.classList.add('hide-plot');
    interval = undefined;
    activePlot = undefined;
  });
}

/* Show and the plot area */
if (plotBtn) {
  showPlot(plotBtn, plotContainer, () => {
    const plotCanvas = document.getElementById('myPlot');
    /*Plot the data*/
    if (plotCanvas) {
      plotData(
        sensorData,
        project.sensors,
        selectedSensors.children[0],
        plotCanvas,
        timeSlider
      ).then((plotName) => {
        activePlot = plotName;
        console.log('Done loading data and drawing plot!');
      });
    }
  });
}

/* Sign up into the app */
if (signupForm) signup(signupForm);

/* Log into the app */
if (loginForm) login(loginForm);

/* Log into the app as guest */
if (guestLoginBtn) guestLogin(guestLoginBtn);

/* Log into the app */
if (forgotPasswordForm) forgotPassword(forgotPasswordForm);

/*Log out of the app */
if (logoutBtn) logout(logoutBtn);

/* Reset password */
if (resetForm) {
  resetPassword(resetForm);
}

/* Send Message from User */
if (contactForm) sendMessage(contactForm);

/* Update user data */
if (profileForm) {
  updateData(profileForm, 'profile');
}

/* Update user password */
if (settingsForm) {
  updateData(settingsForm, 'password');
}

/* Filter project search */
if (searchForm) {
  filterProjects(searchForm, searchField, advancedSearchSwitch);
}

/* Sort projects */
if (sortMenu) {
  if (searchField) {
    sortProjects(searchField, advancedSearchSwitch);
  }
}

/* Create a new Project in the DB */
if (createProjectForm) {
  createNewProject(createProjectForm);
}

/* Update an existing Project */
if (updateProjectForm) {
  updateProject(updateProjectForm);
}

if (deleteBtn) {
  showDeleteOptions(deleteBtn);
}

/* Upload file name on file upload */
if (thumbnailBtn) {
  updateThumbnailFileName(thumbnailBtn);
}

/* Handle notifications */
if (notifList) {
  handleNotifications();
}

/* Handler for window clicks */
window.addEventListener('click', (event) => {
  closeUserMenu(event, userDropdownMenu, userMenuButton);
  closeSortMenu(event, sortMenu, sortMenuIcon);
  expandProjectItem(event);
  if (userSearchMenu) openUserSearch(event, userSearchMenu);
  toggleViewerTabs(event);
  if (timeRange) toggleInputDates(timeRange, fromDate, toDate);
  toogleFileTreeFolder(event);
  if (!activePlot && bimContainer)
    addRemoveSensor(event, availableSensors, selectedSensors);
  if (project) displaySensorInfo(event, project.sensors);
  if (activePlot) {
    interval = updateTimeSlider(
      event,
      backBtn,
      playBtn,
      forwardBtn,
      timeSlider,
      interval,
      activePlot,
      sensorData,
      project.sensors,
      selectedSensors.children[0]
    );
  }
});
