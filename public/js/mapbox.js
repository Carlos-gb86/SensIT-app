/* eslint-disable*/
export const displayMap = (mapBox) => {
  const features = new Array();
  const locations = JSON.parse(mapBox.dataset.sensitLocations);
  const names = JSON.parse(mapBox.dataset.sensitNames);
  const thumbnails = JSON.parse(mapBox.dataset.sensitThumbnails);

  locations.forEach((location, i) =>
    features.push(createFeature(location, names[i], thumbnails[i]))
  );

  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2FybG9zZ2I4NiIsImEiOiJjanNocjU4Y3Mwb3RlNDRsNXk4M3VnczJmIn0.ArnT-1EPDUYlgZTsWWwGXg';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/carlosgb86/cjt4fngb618hj1fp8vhf8uq1p',
    center: [11.85, 57.7],
    zoom: 10.0,
  });

  var geojson = {
    type: 'FeatureCollection',
    features,
  };

  // add markers to map
  geojson.features.forEach(function (marker) {
    // create the popup
    var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      marker.properties.description
    );

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .setPopup(popup)
      .addTo(map);
  });
};

const createFeature = (location, name, thumbnail) => {
  const feature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: location,
    },
    properties: {
      description: `<div style="display: flex; flex-direction: column; align-items: center; max-width: 150px;">
      <h3>${name}</h3> 
      <img style="max-width: 100%;" src="/img/projects/${thumbnail}" alt="project-thumbnail">
      </div>`,
    },
  };
  return feature;
};
