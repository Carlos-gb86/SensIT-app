/* eslint-disable */

export const changeTab = (profileTab, settingsTab) => {
  profileTab.addEventListener('click', (event) => {
    if (!profileTab.classList.contains('user-tab--active')) {
      settingsTab.classList.remove('user-tab--active');
      profileTab.classList.add('user-tab--active');

      document.querySelector('.profile').style.display = 'flex';
      document.querySelector('.settings').style.display = 'none';
    }
  });

  settingsTab.addEventListener('click', () => {
    if (!settingsTab.classList.contains('user-tab--active')) {
      profileTab.classList.remove('user-tab--active');
      settingsTab.classList.add('user-tab--active');

      document.querySelector('.profile').style.display = 'none';
      document.querySelector('.settings').style.display = 'flex';
    }
  });
};
