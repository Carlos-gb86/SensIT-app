/*eslint-disable*/
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export const loadFBXModel = (filePath, scene, manager) => {
  var loader = new FBXLoader(manager);

  loader.load(filePath, function (object) {
    scene.add(object);
  });
};
