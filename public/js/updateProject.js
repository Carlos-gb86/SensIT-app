/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const updateProject = async (formItem) => {
  formItem.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log(window.location.href);

    const projectId = document.getElementById('name').dataset.sensitProjectid;

    const url = `http://127.0.0.1:3000/api/v1/projects/${projectId}`;
    const form = new FormData();

    form.append('type', document.getElementById('type').value);
    form.append('material', document.getElementById('material').value);
    form.append('builtIn', document.getElementById('year').value);
    document.getElementById('description').value
      ? form.append('description', document.getElementById('description').value)
      : form.append('description', '');
    document.getElementById('owner').value
      ? form.append('owner', document.getElementById('owner').value)
      : form.append('owner', undefined);
    if (document.getElementById('thumbnail').files[0])
      form.append('thumbnail', document.getElementById('thumbnail').files[0]);

    try {
      const res = await axios({
        method: 'PATCH',
        url,
        data: form,
      });

      if (res.data.status === 'success') {
        showAlert('success', `Project updated successfully!`, 'checkmark');
        window.setTimeout(() => {
          location.reload();
        }, 500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
    }
  });
};
