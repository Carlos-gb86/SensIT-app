/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const toggleSideBar = (sidebar, sidebarContent, sidebarBtn) => {
  sidebarBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('expand-sidebar')) {
      sidebar.classList.toggle('expand-sidebar');
      sidebar.style.width = '0';
      sidebarContent.style.display = 'none';
      sidebarBtn.style.transform = 'scaleX(-1)';
    } else {
      sidebar.classList.toggle('expand-sidebar');
      sidebar.style.width = '30rem';
      sidebarContent.style.display = 'flex';
      sidebarBtn.style.transform = 'scaleX(1)';
    }
  });
};

export const toggleViewerTabs = (event) => {
  const viewerTabs = document.querySelectorAll('.viewer-tabs__tab');
  const viewerTabContents = document.querySelectorAll('.viewer-tabs__content');
  const clickedTab = event.target.closest('.viewer-tabs__tab');

  if (clickedTab) {
    if (!clickedTab.classList.contains('viewer-tabs__tab--active')) {
      viewerTabs.forEach((tab, i) => {
        tab.classList.remove('viewer-tabs__tab--active');
        viewerTabContents[i].classList.remove('viewer-tabs__content--active');
        if (tab === clickedTab) {
          tab.classList.add('viewer-tabs__tab--active');
          viewerTabContents[i].classList.add('viewer-tabs__content--active');
        }
      });
    }
  }
};

export const populateSensorFiletree = (sensors) => {
  const props = new Array();
  sensors.forEach((sensor) => {
    if (!props.includes(sensor.property)) props.push(sensor.property);
  });

  const indent = document.getElementById('sensor-indent');

  // Loop through the properties and create the folder in the filetree
  props.forEach((prop) => {
    var el = document.createElement('button');
    el.classList.add('dir');
    var markup = `<i class="fa fa-caret-right"></i>
                  <input type="checkbox" class="tree-cb" checked>
                  <label class="tree-label"><i class="fa fa-folder"></i>${prop}</label>`;

    el.innerHTML = markup;
    indent.appendChild(el);

    var indent2 = document.createElement('div');
    indent2.classList.add('indent2', 'hide-indent');
    indent2.setAttribute('id', `sensor-indent-${prop}`);

    el.insertAdjacentElement('afterend', indent2);

    // Loop through all the sensors and create the element if the sensor prop matches the current prop
    sensors.forEach((sensor) => {
      if (sensor.property === prop) {
        var sensorElement = document.createElement('div');
        sensorElement.classList.add('dir');
        var sensorMarkup = `<input type="checkbox" class="tree-cb" checked>
                          <label data-sensit-sensorId="${sensor.id}"class="tree-label tree-sensor-item"><i class="fa fa-cube"></i>${sensor.name}</label>`;
        sensorElement.innerHTML = sensorMarkup;
        indent2.appendChild(sensorElement);
      }
    });
  });
};

export const populateSensorList = (sensorList, sensors) => {
  sensors.forEach((sensor) => {
    const markup = `<li id="${sensor.id}" class="sensors-item">
                            <p class="sensors-item--text">${sensor.name}</p>
                            <span class="sensors-item--btn">
                                <svg class="sensors-item--btn--icon">
                                    <use xlink:href="/img/sprite.svg#icon-circle-with-plus"></use>
                                </svg>
                            </span >
                        </li > `;
    sensorList.insertAdjacentHTML('beforeend', markup);
  });
};

export const populateDownloadSensorList = (sensors) => {
  const sensorDropdown = document.getElementById('select-data');

  sensors.forEach((sensor) => {
    const markup = `<option value="${sensor.name}">${sensor.name}</option> `;
    sensorDropdown.insertAdjacentHTML('beforeend', markup);
  });
};

export const displaySensorInfo = (event, sensors) => {
  const sensorItem = event.target.closest('label');
  if (sensorItem) {
    if (sensorItem.classList.contains('tree-sensor-item')) {
      const propMenu = document.getElementById('sensor-property-menu');
      const sensorId = sensorItem.dataset.sensitSensorid;
      sensors.forEach((sensor) => {
        if (sensor.id === sensorId) {
          const markup = `<div class="property-menu__item">
                        <h4 class="property-menu__item--key">Name</h4>
                        <h4 class="property-menu__item--value">${sensor.name}</h4>
                    </div>
                    <div class="property-menu__item">
                        <h4 class="property-menu__item--key">Type</h4>
                        <h4 class="property-menu__item--value">${sensor.type}</h4>
                    </div>
                    <div class="property-menu__item">
                        <h4 class="property-menu__item--key">Subtype</h4>
                        <h4 class="property-menu__item--value">${sensor.subtype}</h4>
                    </div>
                    <div class="property-menu__item">
                    <h4 class="property-menu__item--key">Measurement</h4>
                    <h4 class="property-menu__item--value">${sensor.measurement.type}</h4>
                    </div>
                    <div class="property-menu__item">
                        <h4 class="property-menu__item--key">Brand</h4>
                        <h4 class="property-menu__item--value">${sensor.brand}</h4>
                    </div>
                    <div class="property-menu__item">
                        <h4 class="property-menu__item--key">Installation</h4>
                        <h4 class="property-menu__item--value">${sensor.installedAt}</h4>
                    </div>`;
          propMenu.innerHTML = '';
          propMenu.insertAdjacentHTML('beforeend', markup);
        }
      });
    }
  }
};

export const addRemoveSensor = (
  event,
  availableSensors,
  selectedSensors,
  activePlot
) => {
  const btn = event.target.closest('.sensors-item--btn');

  if (btn) {
    const item = event.target.closest('.sensors-item');
    const list = item.parentNode;
    let iconSign;

    if (
      item.children[1].children[0].children[0].href.baseVal
        .split('-')
        .slice(-1)[0] === 'plus'
    ) {
      iconSign = 'minus';
    } else {
      iconSign = 'plus';
    }

    const markup = `<li id="${item.id}" class="sensors-item">
                            <p class="sensors-item--text">${item.children[0].innerHTML}</p>
                            <span class="sensors-item--btn">
                                <svg class="sensors-item--btn--icon">
                                    <use xlink:href="/img/sprite.svg#icon-circle-with-${iconSign}"></use>
                                </svg>
                            </span >
                        </li > `;

    if (list.id === availableSensors.id) {
      if (selectedSensors.children[0]) {
        const selectedItem = selectedSensors.children[0];
        selectedItem.children[1].children[0].children[0].href.baseVal =
          '/img/sprite.svg#icon-circle-with-plus';
        const clone = selectedItem.cloneNode(true);
        availableSensors.appendChild(clone);
        selectedSensors.removeChild(selectedItem);
      }
      selectedSensors.insertAdjacentHTML('beforeend', markup);
      availableSensors.removeChild(item);
    }
    if (list.id === selectedSensors.id) {
      availableSensors.insertAdjacentHTML('beforeend', markup);
      selectedSensors.removeChild(item);
    }
  }
};

export const setMaxDateToToday = (dateElement) => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  today = yyyy + '-' + mm + '-' + dd;
  dateElement.setAttribute('max', today);
  dateElement.setAttribute('value', today);
};

export const toggleInputDates = (dateRange, fromDate, toDate) => {
  if (dateRange.checked) {
    fromDate.disabled = false;
    toDate.disabled = false;
    fromDate.classList.add('enabledDateField');
    toDate.classList.add('enabledDateField');
  } else {
    fromDate.disabled = true;
    toDate.disabled = true;
    fromDate.classList.remove('enabledDateField');
    toDate.classList.remove('enabledDateField');
  }
};

export const showPlot = (plotBtn, plotContainer, callback) => {
  plotBtn.addEventListener('click', (event) => {
    if (plotContainer.classList.contains('hide-plot')) {
      plotContainer.classList.remove('hide-plot');

      callback();
    }
  });
};

export const uploadBimModelFile = (form, projectId) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = `/api/v1/projects/uploadBimModelFile/${projectId}`;
    const form = new FormData();

    if (document.getElementById('bimModel-upload').files[0])
      form.append(
        'bimModel',
        document.getElementById('bimModel-upload').files[0]
      );

    try {
      const res = await axios({
        method: 'PATCH',
        url,
        data: form,
      });

      if (res.data.status === 'success') {
        showAlert('success', `File uploaded successfully!`, 'checkmark');
        window.setTimeout(() => {
          location.reload();
        }, 500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
      //console.log(err.response.data.message);
    }
  });
};

export const updateModelFileName = (bmBtn) => {
  bmBtn.addEventListener('change', () => {
    const fileName = bmBtn.value.split('\\').slice(-1);
    const elem = document.getElementById('bimModel-name');
    elem.innerText = fileName;
  });
};

export const uploadSensorData = (uploadBtn, projectId) => {
  uploadBtn.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const content = await getFileContent(file);

    const url = `/api/v1/projects/${projectId}`;
    const form = new FormData();
    form.append('sensors', content);

    try {
      const res = await axios({
        method: 'PATCH',
        url,
        data: form,
      });

      if (res.data.status === 'success') {
        showAlert('success', `Sensor data uploaded successfully!`, 'checkmark');
      }
    } catch (err) {
      showAlert('error', err.response.data.message, 'cancel');
      //console.log(err);
    }
  });
};

const getFileContent = async (file) => {
  return new Promise((resolve, reject) => {
    let content = '';
    const reader = new FileReader();
    // Wait till complete
    reader.onloadend = function (e) {
      content = e.target.result;
      resolve(content);
    };
    // Make sure to handle error states
    reader.onerror = function (e) {
      reject(e);
    };
    reader.readAsText(file);
  });
};

export const writeAndDownloadFile = async (sensorData, sensors) => {
  const selectedSensor = document.getElementById('select-data').value;
  var delimiter =
    document.getElementById('select-delimiter').value === 'selectDelimiter'
      ? '\t'
      : document.getElementById('select-delimiter').value;

  var extension =
    document.getElementById('select-format').value === 'selectFileFormat'
      ? 'csv'
      : document.getElementById('select-format').value;

  var sensorId;
  var data;
  sensors.forEach((sensor) => {
    if (sensor.name === selectedSensor) sensorId = sensor.id;
  });

  if (sensorId) {
    data = sensorData.find((sensor) => (sensor.id = sensorId));
  }

  try {
    const res = await axios({
      method: 'POST',
      url: `/writeTempFile`,
      data: {
        extension,
        delimiter,
        data,
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `File created successfully! Downloading...`,
        'checkmark'
      );

      window.open(`/download/${res.data.filename}`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 'cancel');
    //console.log(err);
  }
};
