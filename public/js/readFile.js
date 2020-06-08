/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';
const moment = require('moment');

export const importData = async (path) => {
  // var timeArray = new Array(moment().format('YYYY-MM-DD HH:mm:ss'));
  // let count = 1;
  // while (timeArray.length < 212) {
  //   timeArray.unshift(
  //     moment().subtract(count, 'days').format('YYYY-MM-DD HH:mm:ss')
  //   );
  //   count += 1;
  // }

  const url = `/api/v1/projects/getSensorData/`;

  try {
    const res = await axios({
      method: 'POST',
      url,
      data: {
        path,
      },
    });

    const rawData = res.data.data.data;

    if (res.data.status === 'success') {
      showAlert('success', `Sensor data loaded successfully!`, 'checkmark');
      return rawData;
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 'cancel');
    //console.log(err);
  }

  // Object.keys(sensorData).forEach((key) => {
  //   sensorData[key].time = timeArray;
  // });
};
