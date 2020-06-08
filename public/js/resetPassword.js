/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alert';

export const resetPassword = (form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirm-password').value;
    const token = document.getElementById('token').value;

    console.log(token);

    try {
      const res = await axios({
        method: 'PATCH',
        url: `http://127.0.0.1:3000/api/v1/users/resetPassword/${token}`,
        data: {
          password,
          passwordConfirm,
        },
      });

      if (res.data.status === 'success') {
        showAlert('success', 'Password reseted successfully!', 'checkmark');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
    }
  });
};
