/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
import { sendConnectNotif } from './sendNotification';

/*********** Toogle User Search Menu ****************/
export const openUserSearch = async (event, userSearchMenu) => {
  const clickedButton = event.target.closest('a');
  const closeButton = event.target.closest('svg');

  if (clickedButton) {
    if (clickedButton.classList.contains('project-item__btn--share')) {
      const projectId = clickedButton.closest('.project-item').dataset
        .sensitProject;

      const project = await getProject(`/api/v1/projects/${projectId}`);

      if (!project.public) {
        // The user search menu is displayed only if the project is not public

        userSearchMenu.style.display = 'flex';

        const userSearchForm = document.getElementById('user-search__form');
        const userSearchField = document.querySelector('.user-search__input');

        searchUsers(userSearchForm, userSearchField, project.users);

        sendConnectNotif(projectId);
      } else {
        showAlert(
          'warning',
          'This project is public and accessible to all users',
          'notice'
        );
      }
    }
  }

  if (closeButton) {
    if (closeButton.classList.contains('user-modal__close-btn')) {
      userSearchMenu.style.display = 'none';
    }
  }
};

const getProject = async (url) => {
  const res = await axios({
    method: 'GET',
    url,
  });

  return res.data.data.data;
};

export const searchUsers = (form, searchField, projectUserList) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = buildQueryUrl(searchField);

    try {
      const allUsers = await getUsers(url); //Get all users matching the query
      const users = filterUsers(allUsers, projectUserList); //Remove users that are already part of the project
      updateUserList(users);
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
    }
  });
};

const getUsers = async (url) => {
  const res = await axios({
    method: 'GET',
    url,
  });

  return res.data.data.data;
};

const filterUsers = (allUsers, userList) => {
  const users = allUsers.filter((user) => !userList.includes(user._id));
  return users;
};

const updateUserList = (users) => {
  // Get project List Element
  const userList = document.querySelector('.user-list');

  // Delete content of the project List
  userList.innerHTML = '';

  // Render new content in the Project List
  users.forEach((user) => {
    userList.insertAdjacentHTML('beforeend', createProjectMarkup(user));
  });
};

const buildQueryUrl = (searchField) => {
  // Retrieve data from search input field
  const searchString = searchField.value;
  var url = '/api/v1/users?';

  // Prepare URL for query
  if (searchString) url = url.concat(`userQuery=${searchString}`);

  return url;
};

const createProjectMarkup = (user) => {
  const markup = `
    <div class="user-item" data-sensit-user="${user._id}">
      <div class="user-item__info">
          <div class="user-item__photo">
              <img src="/img/users/${user.photo}" alt="user-photo">
          </div>
          <div class="user-item__text">
              <h4 class="user-item__name">${user.name}</h3>
              <h3 class="user-item__job">${user.position}</h4>
              <h3 class="user-item__company">${user.company}</h4>
          </div>
      </div>
      <a class="user-item__btn">
          Connect
      </a>
  </div>
    `;
  return markup;
};
