/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const createNewProject = async (formItem) => {
  formItem.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = 'http://127.0.0.1:3000/api/v1/projects';
    const form = new FormData();

    const loc = new Object();
    loc.coordinates = new Array(
      document.getElementById('coordinates--lng').value * 1,
      document.getElementById('coordinates--lat').value * 1
    );
    document.getElementById('city').value
      ? (loc.city = document.getElementById('city').value)
      : (loc.city = undefined);
    document.getElementById('country').value
      ? (loc.country = document.getElementById('country').value)
      : (loc.country = undefined);

    const locString = JSON.stringify(loc);

    form.append('name', document.getElementById('name').value);
    form.append('type', document.getElementById('type').value);
    form.append('material', document.getElementById('material').value);
    form.append('builtIn', document.getElementById('constructionYear').value);
    form.append('location', locString);
    form.append('public', document.getElementById('public-checkbox').checked);
    document.getElementById('description').value
      ? form.append('description', document.getElementById('description').value)
      : form.append('description', undefined);
    document.getElementById('owner').value
      ? form.append('owner', document.getElementById('owner').value)
      : form.append('owner', undefined);
    if (document.getElementById('thumbnail-upload').files[0])
      form.append(
        'thumbnail',
        document.getElementById('thumbnail-upload').files[0]
      );

    try {
      const res = await axios({
        method: 'POST',
        url,
        data: form,
      });

      if (res.data.status === 'success') {
        showAlert('success', `Project created successfully!`, 'checkmark');
        window.setTimeout(() => {
          location.assign('/manager');
        }, 500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
      console.log(err.response.data.message);
    }
  });
};

export const updateThumbnailFileName = (tbBtn) => {
  tbBtn.addEventListener('change', () => {
    const fileName = tbBtn.value.split('\\').slice(-1);
    const elem = document.getElementById('thumbnail-name');
    elem.innerText = fileName;
  });
};
