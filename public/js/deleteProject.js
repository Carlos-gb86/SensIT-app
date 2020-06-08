/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const showDeleteOptions = (deleteBtn) => {
  deleteBtn.addEventListener('click', (event) => {
    const modalDelete = document.getElementById('modal-delete');
    modalDelete.style.display = 'flex';

    const confirmBtn = document.querySelector('.confirm-btn');
    const cancelBtn = document.querySelector('.cancel-btn');

    cancelBtn.addEventListener('click', () => {
      modalDelete.style.display = 'none';
    });

    confirmBtn.addEventListener('click', async () => {
      const projectId = document.getElementById('name').dataset.sensitProjectid;
      const url = `/api/v1/projects/${projectId}`;
      try {
        const res = await axios({
          method: 'DELETE',
          url,
        });

        if (res.status === 204) {
          showAlert('success', `Project deleted successfully!`, 'checkmark');
          modalDelete.style.display = 'none';
          window.setTimeout(() => {
            location.assign('/manager');
          }, 500);
        }
      } catch (err) {
        showAlert('error', err.response.data.message, 'cancel');
      }
    });
  });
};
