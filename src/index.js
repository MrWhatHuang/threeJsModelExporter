/*
 * @Descripttion:
 * @version:
 * @Author: Mr.What
 * @Date: 2020-08-10 17:30:01
 * @LastEditors: Mr.What
 * @LastEditTime: 2020-08-11 17:48:44
 */
import './index.less';
// import * as THREE from '../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from '../node_modules/three/examples/jsm/exporters/GLTFExporter.js';
const JSZip = require('../node_modules/jszip/dist/jszip.js')
import saveAs from '../node_modules/jszip/vendor/FileSaver.js'

const fileType = 'glb'
const fileInput = document.getElementById('file');
const exportBtn = document.getElementById('exportBtn');
const progressNum = document.getElementById('progressNum');
fileInput.addEventListener('change', (event) => {
  if (event.target.files.length === 1) {
    importer(URL.createObjectURL(event.target.files[0]));
  }
});
exportBtn.addEventListener('click', () => {
  let nameList = getNameList()
  let blobList = []
  let count = 0
  for (let i = 0; i < nameList.length; i++) {
    let object = scene.getObjectByName(nameList[i])
    exporter(object).then((blob) => {
      blobList.push(blob)
      count++
      if (count === nameList.length) {
        blob2Zip(blobList)
      }
    });
  }
});

function getNameList () {
  let result = ['dx']
  let bulidings = scene.getObjectByName('cj').children
  for (let i = 0; i < bulidings.length; i++) {
    result.push(bulidings[i].name)
  }
  return result
}

function blob2Zip (blobList) {
  var zip = new JSZip();
  let fileNameList = []
  var modelFile = zip.folder("model");
  for (let i = 0; i < blobList.length; i++) {
    fileNameList.push(blobList[i].name)
    modelFile.file(blobList[i].name, blobList[i].blob);
  }

  let json = {
    nameList: fileNameList,
    count: fileNameList.length,
    position: JSON.stringify(scene.getObjectByName('cj').getWorldPosition())
  }
  zip.file("model.json", JSON.stringify(json));

  zip.generateAsync({type:"blob"})
  .then(function(content) {
      // see FileSaver.js
      saveAs(content, "modelSplit.zip");
  });
}

let scene = null;
function importer(url) {
  const loader = new GLTFLoader();
  loader.load(url, (data) => {
    scene = data.scene;
  }, (progress) => {
    progressNum.innerText = `${(progress.loaded / progress.total) * 100}%`;
  });
}

function exporter(object) {
  return new Promise((resolve, reject) => {
    let blob = null;
    const exporter = new GLTFExporter();
    exporter.parse(object, (data) => {
      if (fileType === 'glb') {
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
    }, { binary: fileType === 'glb' });
  });
}
