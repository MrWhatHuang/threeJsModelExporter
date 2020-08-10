/*
 * @Descripttion:
 * @version:
 * @Author: Mr.What
 * @Date: 2020-08-10 17:30:01
 * @LastEditors: Mr.What
 * @LastEditTime: 2020-08-10 18:29:26
 */
import './index.less';
import * as THREE from '../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from '../node_modules/three/examples/jsm/exporters/GLTFExporter.js';

const fileInput = document.getElementById('file');
const exportBtn = document.getElementById('exportBtn');
fileInput.addEventListener('change', (event) => {
  if (event.target.files.length === 1) {
    importer(URL.createObjectURL(event.target.files[0]));
  }
});
exportBtn.addEventListener('click', () => {
  exporter(scene).then((data) => {
    console.log(data);
  });
});

let scene = null;
function importer(url) {
  const loader = new GLTFLoader();
  loader.load(url, (data) => {
    scene = data.scene;
  });
}

function exporter(object) {
  return new Promise((resolve, reject) => {
    let blob = null;
    const exporter = new GLTFExporter();
    exporter.parse(object, (data) => {
      debugger;
      if (data instanceof ArrayBuffer) {
        blob = new Blob([data], {
          type: 'application/octet-stream',
        });
        resolve({ blob, name: `${object.name || object.uuid}.glb` });
      } else {
        const output = JSON.stringify(data, null, 2);
        blob = new Blob([output], {
          type: 'text/plain',
        });
        resolve({ blob, name: `${object.name || object.uuid}.gltf` });
      }
    });
  });
}
