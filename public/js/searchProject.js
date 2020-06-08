/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const filterProjects = (form, searchField, searchSwitch) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = buildQueryUrl(searchField, searchSwitch);

    try {
      const projects = await getProjects(url);
      updateProjectList(projects);
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
    }
  });
};

export const sortProjects = (searchField, searchSwitch) => {
  window.addEventListener('click', async (event) => {
    if (event.target.closest('.sort-menu__item')) {
      const sortString = event.target
        .closest('.sort-menu__item')
        .children[0].textContent.split(' ')
        .slice(-1)[0]
        .toLowerCase();

      const url = buildQueryUrl(searchField, searchSwitch, sortString);

      try {
        const projects = await getProjects(url);
        updateProjectList(projects);
      } catch (err) {
        showAlert('error', err.response.data.message, 'cancel');
      }
    }
  });
};

const getProjects = async (url) => {
  const res = await axios({
    method: 'GET',
    url,
  });

  return res.data.data.data;
};

const updateProjectList = (projects) => {
  // Get project List Element
  const projectList = document.querySelector('.project-list');

  // Delete content of the project List
  projectList.innerHTML = '';

  // Render new content in the Project List
  projects.forEach((project) => {
    projectList.insertAdjacentHTML('beforeend', createProjectMarkup(project));
  });
};

const buildQueryUrl = (searchField, searchSwitch, sortString) => {
  // Retrieve data from search input field
  const searchString = searchField.value;
  var material;
  var year;
  var condition;
  var url = 'http://127.0.0.1:3000/api/v1/projects?';

  // Retrieve data from advanced search
  if (!searchSwitch.classList.contains('switch-color-red')) {
    material = document.getElementById('material-filter').value;
    year = document.getElementById('year').value;
    condition = document.getElementById('condition-filter').value;
  }

  const conditions = ['critical', 'poor', 'acceptable', 'good', 'excellent'];
  // Prepare URL for query
  if (searchString) url = url.concat(`projectQuery=${searchString}&`);
  if (material && material !== 'All') url = url.concat(`material=${material}&`);
  if (year) url = url.concat(`builtIn[gte]=${year}&`);
  if (condition && condition !== 'All') {
    url = url.concat(`condition=${conditions.indexOf(condition) + 1}&`);
  }

  if (url[url.length - 1] === '&') url = url.slice(0, -1);

  if (sortString) url = url.concat(`&sort=${sortString}`);

  return url;
};

const createProjectMarkup = (project) => {
  const conditions = ['critical', 'poor', 'acceptable', 'good', 'excellent'];
  const markup = `
    <div class="project-item" data-sensit-project= ${project.id}>
    <div class="project-item__main">

        <div class="project-item__condition condition-${
          conditions[project.condition - 1]
        }">&nbsp;</div>
        <div class="project-item__text">

            <div class="project-item__description">
                <h3 class="project-item__name">${project.name}</h3>

                <div class="project-item__props">
                    <h4 class="project-item__type"> ${project.type}</h4>
                    <h4 class="project-item__year">${project.builtIn}</h4>
                </div>
            </div>

            <svg class="project-item__icon">
                <use xlink:href="/img/sprite.svg#icon-chevron-down"></use>
            </svg>
        </div>
    </div>


    <div class="project-item__menu hide-project-item-menu">

        <a class="project-item__btn">
            <svg class="project-item__btn-icon">
                <use xlink:href="/img/sprite.svg#icon-edit"></use>
            </svg>
            <span class="project-item__btn-text"> Edit </span>
        </a>
        <a class="project-item__btn project-item__btn--share">
            <svg class="project-item__btn-icon">
                <use xlink:href="/img/sprite.svg#icon-share"></use>
            </svg>
            <span class="project-item__btn-text"> Share </span>
        </a>
        <a class="project-item__btn">
            <svg class="project-item__btn-icon">
                <use xlink:href="/img/sprite.svg#icon-eye"></use>
            </svg>
            <span class="project-item__btn-text"> Viewer</span>
        </a>
    </div>
    `;
  return markup;
};
