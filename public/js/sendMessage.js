/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alert';

export const sendMessage = (form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    try {
      const res = await axios({
        method: 'POST',
        url: `/api/v1/users/sendMessage`,
        data: {
          subject,
          message,
        },
      });

      if (res.data.status === 'success') {
        showAlert('success', 'Message sent successfully!', 'checkmark');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
    }
  });
};
