import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

export const loadColladaModel = (filePath, scene, manager) => {

    var loader = new ColladaLoader(manager);

    loader.load(filePath, function (collada) {

        var myObj = collada.scene;

        scene.add(myObj);
    });
}