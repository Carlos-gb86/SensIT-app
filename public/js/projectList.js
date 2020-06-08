/* eslint-disable*/

/*********** Toogle Sort Menu in Project List ****************/
export const toggleSortMenu = (sortMenuIcon, sortMenu) => {
  sortMenuIcon.addEventListener('click', () => {
    sortMenu.classList.toggle('hide-menu');
  });
};

export const closeSortMenu = (event, sortMenu, sortMenuIcon) => {
  const el = event.target;
  if (sortMenuIcon) {
    if (el !== sortMenuIcon && !sortMenuIcon.contains(el)) {
      if (el !== sortMenu && !sortMenu.contains(el)) {
        sortMenu.classList.add('hide-menu');
      }
    }
  }
};

/*********** Expand project item in Project List ****************/
export const expandProjectItem = (event) => {
  const projectItem = event.target.closest('div.project-item');
  const projectBtn = event.target.closest('a.project-item__btn');

  if (projectItem && !projectBtn) {
    const projectList = projectItem.parentElement;
    const allItems = Array.from(projectList.children);

    allItems.forEach((child) => {
      if (child !== projectItem) {
        child.children[1].classList.add('hide-project-item-menu');
        child.children[0].children[1].children[1].classList.remove('flip-icon');
      }
    });

    projectItem.children[1].classList.toggle('hide-project-item-menu');
    projectItem.children[0].children[1].children[1].classList.toggle(
      'flip-icon'
    );
  }
};
