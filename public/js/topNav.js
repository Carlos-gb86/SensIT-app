/* eslint-disable */
/*********** Toogle User Navigation Menu ****************/
export const toggleUserMenu = (userMenuButton, userDropdownMenu) => {
  userMenuButton.addEventListener('click', () => {
    userDropdownMenu.classList.toggle('hide-user-menu');
  });
};

export const closeUserMenu = (event, userDropdownMenu, userMenuButton) => {
  if (userMenuButton) {
    const el = event.target;
    if (el !== userMenuButton && !userMenuButton.contains(el)) {
      if (el !== userDropdownMenu && !userDropdownMenu.contains(el)) {
        userDropdownMenu.classList.add('hide-user-menu');
      }
    }
  }
};
