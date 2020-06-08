/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const sendConnectNotif = (projectId) => {
  window.addEventListener('click', async (event) => {
    if (event.target.closest('.user-item__btn')) {
      const receiverId = event.target.closest('.user-item').dataset.sensitUser;

      const check = await checkNotifSent(projectId, receiverId); // Check if receiver already has a notification for that project

      if (check.length < 1) {
        const url = `http://127.0.0.1:3000/api/v1/projects/${projectId}/users/${receiverId}/notifications`;

        try {
          const res = await axios({
            method: 'POST',
            url,
            data: { message: 'Collaboration request' },
          });

          if (res.data.status === 'success') {
            showAlert(
              'success',
              `Your request has been successfully sent!`,
              'checkmark'
            );
            window.setTimeout(() => {
              location.assign('/manager');
            }, 1500);
          }
        } catch (err) {
          showAlert('error', err.response.data.message, 'cancel');
        }
      } else {
        showAlert(
          'warning',
          'This user has already been invited to join the selected project.',
          'notice'
        );
      }
    }
  });
};

const checkNotifSent = async (projectId, receiverId) => {
  const url = `http://127.0.0.1:3000/api/v1/notifications?receiver=${receiverId}&project=${projectId}`;

  const res = await axios({
    method: 'GET',
    url,
  });

  return res.data.data.data;
};
