/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const handleNotifications = () => {
  window.addEventListener('click', async (event) => {
    const Button = event.target.closest('a');
    const closeButton = event.target.closest('svg');

    const url = `/api/v1/`;

    if (closeButton) {
      if (closeButton.classList.contains('notif-item__close-btn')) {
        const notifId = closeButton.closest('.notif-item').dataset
          .sensitNotification;
        const res = await deleteNotif(url, notifId);

        if (res.data.status === 'success') {
          location.reload();
        }
      }
    }

    if (Button) {
      if (Button.classList.contains('notif-item__btn')) {
        const notifId = Button.closest('.notif-item').dataset
          .sensitNotification;
        const projectId = Button.closest('.notif-item').dataset.sensitProject;
        const userId = Button.closest('.notif-item').dataset.sensitUser;

        const project = await getProject(url, projectId);

        await displayReadNotif(url, notifId);
        window.setTimeout(() => {
          location.reload();
        }, 1000);

        try {
          if (Button.classList.contains('notif-accept')) {
            const res = await acceptRequest(url, project, userId);
            if (res.data.status === 'success') {
              showAlert(
                'success',
                `Great! Now you can access the ${project.name} project`,
                'checkmark'
              );
            }
          }
          if (Button.classList.contains('notif-decline')) {
            showAlert(
              'warning',
              `You have chosen not to collaborate in the ${project.name} project`,
              'notice'
            );
          }
        } catch (err) {
          showAlert('error', err.response.data.message, 'cancel');
          //console.log(err);
        }
      }
    }
  });
};

const deleteNotif = async (url, notifId) => {
  const res = await axios({
    method: 'PATCH',
    url: `${url}notifications/${notifId}`,
    data: {
      deleted: true,
    },
  });

  return res;
};

const getProject = async (url, projectId) => {
  const res = await axios({
    method: 'GET',
    url: `${url}projects/${projectId}`,
  });

  return res.data.data.data;
};

const acceptRequest = async (url, project, userId) => {
  const projectId = project._id;
  const userList = project.users;
  userList.push(userId);
  const newUserList = Array.from(new Set(userList)); //Remove duplicates

  const res = await axios({
    method: 'PATCH',
    url: `${url}projects/${projectId}`,
    data: {
      users: newUserList,
    },
  });

  return res;
};

const displayReadNotif = async (url, notifId) => {
  const res = await axios({
    method: 'PATCH',
    url: `${url}notifications/${notifId}`,
    data: {
      read: true,
    },
  });
};
