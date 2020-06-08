/*eslint-disable*/

import Chart from 'chart.js';

export const plotData = async (
  data,
  sensors,
  selectedSensor,
  canvas,
  timeSlider
) => {
  if (selectedSensor) {
    const obj = getData(data, sensors, selectedSensor);

    const sensor = obj.sensor;
    const sensorData = obj.sensorData;

    const plotTypeInput = document.getElementById('select-plottype').value;
    const plotType = plotTypeInput === 'selectParams' ? 'line' : plotTypeInput;

    const colormap = [
      'rgba(0,114,189,1)',
      'rgba(217,83,25,1)',
      'rgba(237,177,32,1)',
      'rgba(126,47,142,1)',
      'rgba(119,172,48,1)',
      'rgba(77,190,238,1)',
      'rgba(162,20,47,1)',
    ];

    timeSlider.max = sensorData.time.length - 1;
    timeSlider.value = sensorData.time.length - 1;

    const chartData = getChartData(sensor, sensorData, timeSlider);

    // getChartOptions(sensor, timeSlider);

    const ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
      type: plotType,
      data: chartData,
      options: {
        animation: {
          duration: 0,
        },
        title: {
          display: true,
          text: sensorData.time[timeSlider.value], //`${sensor.time[150].getDate()}-${sensor.time[150].getMonth()}-${sensor.time[150].getFullYear()}`
        },
        responsive: true,
        responsiveAnimationDuration: 0,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
        },
        events: ['click'],
        elements: {
          line: {
            tension: 0, // disables bezier curves
          },
        },
        layout: {
          padding: {
            top: 5,
          },
        },
        showLines: true, // makes scatter plot
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                max: sensorData.positions[sensorData.positions.length - 1],
                min: sensorData.positions[0],
                maxTicksLimit: 9,
                maxRotation: 0,
                autoskip: true,
                callback: function (value, index, values) {
                  return Math.round(value * 100) / 100;
                },
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                stepSize: 100,
                autoskip: true,
              },
            },
          ],
        },
      },
    });
    return await myChart;
  }
};

const getData = (AllSensorData, sensors, selectedSensor) => {
  const sensorId = selectedSensor.id;

  let sensor;
  let sensorData;

  sensors.forEach((sensorItem) => {
    if (sensorId === sensorItem.id) {
      sensor = sensorItem;
    }
  });

  AllSensorData.forEach((sensorItem) => {
    if (sensorId === sensorItem.id) {
      sensorData = sensorItem;
    }
  });

  return { sensor, sensorData };
};

const getChartData = (sensor, sensorData, timeSlider) => {
  let chartData = new Object();

  if (sensor.measurement.type === 'distributed') {
    chartData = {
      labels: sensorData.positions.map((x) => Math.round(x * 100) / 100),
      datasets: [
        {
          label: sensor.name,
          backgroundColor: 'rgba(100,100,100,0)',
          borderColor: 'rgba(0,114,189,1)',
          data: sensorData.data[timeSlider.value].map(
            (value) => Math.round(value * 1000) / 1000
          ),
          fill: false,
          pointBackgroundColor: 'rgba(10,10,10,0.35)',
        },
      ],
    };
    return chartData;
  }
};

export const updateTimeSlider = (
  event,
  backBtn,
  playBtn,
  forwardBtn,
  timeSlider,
  interval,
  activePlot,
  data,
  sensors,
  selectedSensor
) => {
  const target = event.target.closest('.plot-controls--item');
  const closeBtn = event.target.closest('.plot-close--btn');

  const obj = getData(data, sensors, selectedSensor);

  const sensorData = obj.sensorData;

  let sliderValue = timeSlider.value * 1;

  if (target === playBtn && sliderValue < timeSlider.max) {
    if (interval) {
      playBtn.children[0].innerHTML = `<use xlink:href="/img/sprite.svg#icon-triangle-right"></use>`;
      clearInterval(interval);
      return (interval = undefined);
    } else {
      playBtn.children[0].innerHTML = `<use xlink:href="/img/sprite.svg#icon-controller-paus"></use>`;
      return (interval = setInterval(() => {
        if (sliderValue == timeSlider.max) {
          return clearInterval(interval);
        }
        sliderValue += 1;
        timeSlider.value = sliderValue;
        updatePlot(activePlot, sensorData, timeSlider);
      }, 250));
    }
  }

  if (closeBtn && interval) {
    playBtn.children[0].innerHTML = `<use xlink:href="/img/sprite.svg#icon-triangle-right"></use>`;
    clearInterval(interval);
    return (interval = undefined);
  }

  if (target === backBtn && sliderValue > 0) {
    if (interval) {
      playBtn.children[0].innerHTML = `<use xlink:href="/img/sprite.svg#icon-triangle-right"></use>`;
      clearInterval(interval);
      return (interval = undefined);
    }
    sliderValue -= 1;
    timeSlider.value = sliderValue;
    updatePlot(activePlot, sensorData, timeSlider);
  }

  if (target === forwardBtn && sliderValue < timeSlider.max) {
    if (interval) {
      playBtn.children[0].innerHTML = `<use xlink:href="/img/sprite.svg#icon-triangle-right"></use>`;
      clearInterval(interval);
      return (interval = undefined);
    }
    sliderValue += 1;
    timeSlider.value = sliderValue;
    updatePlot(activePlot, sensorData, timeSlider);
  }

  if (event.target === timeSlider) {
    if (interval) {
      playBtn.children[0].innerHTML = `<use xlink:href="/img/sprite.svg#icon-triangle-right"></use>`;
      clearInterval(interval);
      return (interval = undefined);
    }
    updatePlot(activePlot, sensorData, timeSlider);
  }

  return interval;
};

const updatePlot = (activePlot, sensorData, slider) => {
  var step = slider.value;
  activePlot.config.data.datasets[0].data = sensorData.data[step].map(
    (value) => Math.round(value * 1000) / 1000
  );
  activePlot.config.options.title.text = sensorData.time[step];
  activePlot.update();
};

// function updateChart(ChartName, data) {
//     var i = 0;
//     return setInterval(() => {
//         i += 5;
//         if (i > Object.keys(data.series).length) return clearInterval(interval);
//         ChartName.config.data.datasets[0].data = data.series[i].map((x) => x + 30);
//         ChartName.config.options.scale.ticks.max = 10 * Math.ceil(Math.max(...[50, Math.max(...data.series[i].map((x) => x + 30))]) / 10);
//         ChartName.update();
//     }, 20);
// };
