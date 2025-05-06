import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('#ar-container');
  const mindarThree = new MindARThree({
    container,
    imageTargetSrc: './assets/target.mind',
  });

  const { renderer, scene, camera } = mindarThree;

  // 强制全屏
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;

  // 添加光源
  scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1));
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0, 1, 1);
  scene.add(dirLight);

  // 锚点与测试几何
  const anchor = mindarThree.addAnchor(0);
  await mindarThree.start();
  anchor.group.visible = true;

  // 辅助几何
  scene.add(new THREE.AxesHelper(0.5));
  anchor.group.add(new THREE.AxesHelper(0.3));

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.3, 0.3),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
  );
  box.position.set(0, 0.15, 0);
  anchor.group.add(box);

  renderer.setAnimationLoop(() => {
    renderer.clearDepth();
    renderer.render(scene, camera);
  });
});