/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alert';

export const signup = (form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirm-password').value;

    try {
      const res = await axios({
        method: 'POST',
        url: '/api/v1/users/signup',
        data: {
          name,
          email,
          password,
          passwordConfirm,
        },
      });

      if (res.data.status === 'success') {
        showAlert('success', 'Account created successfully!', 'checkmark');
        window.setTimeout(() => {
          location.assign('/profile');
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
    }
  });
};
