/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alert';

export const login = (form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await axios({
        method: 'POST',
        url: '/api/v1/users/login',
        data: {
          email,
          password,
        },
      });

      if (res.data.status === 'success') {
        showAlert('success', 'Logged in successfully!', 'checkmark');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
    }
  });
};

export const guestLogin = (btn) => {
  btn.addEventListener('click', async() => {

    const email = 'guest@sensit.com';
    const password = 'test1234';

    try {
      const res = await axios({
        method: 'POST',
        url: '/api/v1/users/login',
        data: {
          email,
          password,
        },
      });

      if (res.data.status === 'success') {
        showAlert('success', 'Logged in successfully!', 'checkmark');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
    }
  });
};

export const logout = (btn) => {
  btn.addEventListener('click', async (e) => {
    if (e.target.closest('a') === btn) {
      try {
        const res = await axios({
          method: 'GET',
          url: '/api/v1/users/logout',
        });
        if (res.data.status === 'success') location.assign('/login');
      } catch (err) {
        showAlert('error', 'Error logging out! Try again.');
      }
    }
  });
};
