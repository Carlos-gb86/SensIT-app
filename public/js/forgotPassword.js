/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const forgotPassword = (form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    console.log(email);

    try {
      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/forgotPassword',
        data: {
          email,
        },
      });

      if (res.data.status === 'success') {
        showAlert(
          'success',
          'A link has been sent to your email address!',
          'checkmark'
        );
        // window.setTimeout(() => {
        //   location.assign('/login');
        // }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
    }
  });
};
