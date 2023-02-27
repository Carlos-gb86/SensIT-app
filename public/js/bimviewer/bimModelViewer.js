/*eslint-disable*/
import * as THREE from 'three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadColladaModel } from './loadColladaModel';
import { loadFBXModel } from './loadFBXModel';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { Lut } from 'three/examples/jsm/math/Lut.js';

export const runBIM = (filename, contourFile, param) => {
  var canvas, scene, camera, renderer, container, content, controls, stats;
  var mesh, lut, settings;

  container = document.querySelector('.canvas-container');
  canvas = document.getElementById('model-canvas');
  content = document.getElementById('scene-frame');

  init();
  animate();

  function init() {
    /**********************************************************************************************************************/
    // Creating a scene and include it into a div element
    scene = new THREE.Scene();
    content.className = 'scene';
    scene.userData.element = content;

    /*************************************************************************************************************************/
    // Defining the camera parameters

    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;

    camera = new THREE.PerspectiveCamera(
      75,
      containerWidth / containerHeight,
      0.01,
      1000000
    );
    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);
    scene.userData.camera = camera;

    /*************************************************************************************************************************/
    // Defining Lights

    var light = new THREE.HemisphereLight(0xffffee, 0x090909, 1);
    light.position.set(0, 1, 1);
    scene.add(light);

    /*************************************************************************************************************************/
    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0xd3d3d3);

    /*************************************************************************************************************************/
    // Enabling Orbit Controls
    controls = new OrbitControls(scene.userData.camera, scene.userData.element);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    scene.userData.controls = controls;

    /***************************************************************************************************************************/
    // Loading Model
    // const filePath = './public/js/bimviewer/wind3.dae';
    const filePath = `/bim-models/${filename}`;

    var manager = new THREE.LoadingManager();

    if (filePath.split('.').slice(-1)[0] === 'dae') {
      loadColladaModel(filePath, scene, manager);
    }

    if (filePath.split('.').slice(-1)[0] === 'fbx') {
      loadFBXModel(filePath, scene, manager);
    }

    manager.onLoad = function () {
      document.querySelector('.spinner').classList.add('hide-spinner');
      if (contourFile) {
        // Adding contour
        lut = new Lut();

        settings = {
          colorMap: 'rainbow',
          timeStep: 0,
          contour: param,
          maxVal: 1,
          minVal: 0,
        };

        loadContour();
      }

      centerModel(scene.children[1]);
    };

    /***************************************************************************************************************************/
    // Centering Model

    var centerModel = (modelObj) => {
      var bbox = new THREE.Box3().setFromObject(modelObj);

      var sphere = new THREE.Sphere();
      var sph = bbox.getBoundingSphere(sphere);

      // Center camera
      camera.lookAt(sph.center);
      camera.position.set(sph.radius, sph.radius, sph.radius * 2);
      camera.updateProjectionMatrix();

      //Center Controls
      controls.target = sph.center;
      controls.update();

      //Create and Add grid
      createGrid(bbox);
    };

    // Adding help grid
    var createGrid = (bbox) => {
      var maxSize = Math.max(
        Math.max(bbox.max.x, -1 * bbox.min.x),
        Math.max(bbox.max.z, -1 * bbox.min.z)
      );
      var grid = new THREE.GridHelper(maxSize + 1, 25, 0x000000, 0x000000);
      grid.geometry.translate(
        0.5 * (bbox.min.x + bbox.max.x),
        0,
        0.5 * (bbox.min.z + bbox.max.z)
      );
      grid.material.opacity = 0.2;
      grid.material.transparent = true;
      scene.add(grid);
    };
  }

  function loadContour() {
    var loader = new THREE.BufferGeometryLoader();

    var geometry = loader.parse(contourFile);
    //geometry.center();
    geometry.computeVertexNormals();

    // default color attribute
    var colors = [];
    for (var i = 0, n = geometry.attributes.position.count; i < n; ++i) {
      colors.push(1, 1, 1);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 0xf5f5f5,
        vertexColors: true,
      })
    );

    var contour = geometry.userData[settings.contour];

    updateMinMaxValues(contour, settings);

    createGUIPanel(geometry);

    updateColors();

    scene.add(mesh);
  }

  // function loadContour() {
  //   var loader = new THREE.BufferGeometryLoader();
  //   loader.load(contourFile, function (geometry) {
  //     geometry.computeVertexNormals();

  //     // default color attribute
  //     var colors = [];
  //     for (var i = 0, n = geometry.attributes.position.count; i < n; ++i) {
  //       colors.push(1, 1, 1);
  //     }
  //     geometry.setAttribute(
  //       'color',
  //       new THREE.Float32BufferAttribute(colors, 3)
  //     );

  //     mesh = new THREE.Mesh(
  //       geometry,
  //       new THREE.MeshLambertMaterial({
  //         side: THREE.DoubleSide,
  //         color: 0xf5f5f5,
  //         vertexColors: true,
  //       })
  //     );

  //     var contour = geometry.userData[settings.contour];

  //     updateMinMaxValues(contour, settings);

  //     createGUIPanel(geometry);

  //     updateColors();

  //     scene.add(mesh);
  //   });
  // }

  function updateColors() {
    var geometry = mesh.geometry;
    var contour = geometry.userData[settings.contour];
    var colors = geometry.attributes.color;
    var timeStep = settings.timeStep;

    lut.setColorMap(settings.colorMap);

    lut.setMax(settings.maxVal);
    lut.setMin(0);

    if (Array.isArray(contour[0])) {
      var stepContour = contour[timeStep];
    } else {
      var stepContour = contour;
    }
    
    for (var i = 0; i < stepContour.length; i++) {
      var colorValue = Math.round(stepContour[i] * 100) / 100;
      var color = lut.getColor(colorValue);
      if (color === undefined) {
        console.log('Unable to determine color for value:', colorValue);
      } else {
        colors.setXYZ(i, color.r, color.g, color.b);
      }
    }

    colors.needsUpdate = true;
  }

  function createGUIPanel(geometry) {
    var panel = new GUI({ width: 310, autoPlace: false });
    panel.domElement.id = 'gui';
    container.appendChild(panel.domElement);

    var folder = panel.addFolder('Visualization');

    folder
      .add(settings, 'colorMap', [
        'rainbow',
        'cooltowarm',
        'blackbody',
        'grayscale',
      ])
      .onChange(function () {
        updateColors();
      });

    folder
      .add(settings, 'contour', ['strains', 'cracks', 'defs', 'temps'])
      .onChange(function (newContour) {
        var contour = geometry.userData[newContour];
        updateMinMaxValues(contour, settings);
        folder.__controllers[3].__step = settings.stepVal;
        folder.__controllers[3].__min = settings.lb;
        folder.__controllers[3].__max = settings.ub;
        updateColors();
      });
    
      if (Array.isArray(settings.contour[0])) {
        var maxStep = mesh.geometry.userData[settings.contour].length - 1;
      } else {
        var maxStep = 0;
      }
    

    folder
      .add(settings, 'timeStep', 0, maxStep, 1)
      .listen()
      .onChange(function (newStep) {
        settings.timeStep = newStep;
        updateColors();
      });

    folder
      .add(settings, 'maxVal', settings.lb, settings.ub, settings.stepVal)
      .listen()
      .onChange(function (newVal) {
        settings.maxVal = newVal;
        updateColors();
      });

    folder.open();
  }

  // ************ Animate Function ************************//
  function animate() {
    requestAnimationFrame(animate);
    updateSize();
    renderer.render(scene, camera);
  }

  function updateSize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;
    var aspect = width / height;

    if (canvas.width !== width || canvas.height !== height) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, aspect);
    }
  }

  // ************ Reset Original Camera ************************//
  container.addEventListener('dblclick', () => controls.reset());
};

const updateMinMaxValues = (contour, settings) => {
  settings.maxVal = getMaxMinofMatrix(contour, 'max');
  settings.minVal = Math.max(getMaxMinofMatrix(contour, 'min'), 0);

  var maxVal = settings.maxVal;
  var minVal = settings.minVal;
  var step = Math.pow(10,Math.ceil(Math.log10(maxVal)))/100;
  settings.lb =  Math.ceil(minVal/step)*step;
  settings.ub = Math.floor(maxVal/step)*step;
  settings.stepVal = step;
  console.log("step:",step, "lower_bound:", settings.lb, "upper_bound:", settings.ub);
};

const getMaxMinofMatrix = (matrix, flag) => {
  var flat = matrix.flat()
  if (flag === 'max') { 
    return Math.max(...flat);
  }
  if (flag === 'min') {
    return Math.min(...flat);
  }
};
