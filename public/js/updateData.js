/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const updateData = async (formItem, type) => {
  formItem.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData();
    let url;

    if (type === 'profile') {
      url = 'http://127.0.0.1:3000/api/v1/users/updateMe';
      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      document.getElementById('company').value
        ? form.append('company', document.getElementById('company').value)
        : form.append('company', undefined);
      document.getElementById('position').value
        ? form.append('position', document.getElementById('position').value)
        : form.append('position', undefined);
      form.append('photo', document.getElementById('photo').files[0]);
    }

    if (type === 'password') {
      document.querySelector('.settings__form--btn').textContent =
        'Saving password...';
      url = 'http://127.0.0.1:3000/api/v1/users/updateMyPassword';
      form.append(
        'passwordCurrent',
        document.getElementById('old-password').value
      );
      form.append('password', document.getElementById('new-password').value);
      form.append(
        'passwordConfirm',
        document.getElementById('confirm-new-password').value
      );
    }

    try {
      const res = await axios({
        method: 'PATCH',
        url,
        data: form,
      });

      if (type === 'password') {
        document.getElementById('old-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-new-password').value = '';
        document.querySelector('.settings__form--btn').textContent =
          'Change password';
      }

      if (res.data.status === 'success') {
        showAlert(
          'success',
          `${type === 'profile' ? 'Data' : 'Password'} updated successfully!`,
          'checkmark'
        );
        window.setTimeout(() => {
          location.reload();
        }, 500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
    }
  });
};
