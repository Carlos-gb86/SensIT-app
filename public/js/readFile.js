/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';
const moment = require('moment');

export const importData = async (filename, type) => {
  // var timeArray = new Array(moment().format('YYYY-MM-DD HH:mm:ss'));
  // let count = 1;
  // while (timeArray.length < 212) {
  //   timeArray.unshift(
  //     moment().subtract(count, 'days').format('YYYY-MM-DD HH:mm:ss')
  //   );
  //   count += 1;
  // }

  const url = `/api/v1/projects/getData/`;

  try {
    const res = await axios({
      method: 'POST',
      url,
      data: {
        name: filename,
        type,
      },
    });

    const rawData = res.data.data.data;

    if (res.data.status === 'success') {
      let msg = type.charAt(0).toUpperCase() + type.slice(1) + ' data loaded successfully!';
      showAlert('success', msg, 'checkmark');
      return rawData;
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 'cancel');
    
  }

  // Object.keys(sensorData).forEach((key) => {
  //   sensorData[key].time = timeArray;
  // });
};
