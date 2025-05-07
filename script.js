import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-image-three';

let model = null;

document.addEventListener("DOMContentLoaded", async () => {
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "./assets/target.mind",
  });

  const { renderer, scene, camera } = mindarThree;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // 添加环境光照
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // —— 创建校正与旋转容器 ——
  const anchor = mindarThree.addAnchor(0);
  const orientationGroup = new THREE.Group();
  const rotationGroup    = new THREE.Group();
  anchor.group.add(orientationGroup);
  orientationGroup.add(rotationGroup);

  // 加载模型到 rotationGroup
  const loader = new GLTFLoader();
  loader.load(
    './assets/model.glb',
    (gltf) => {
      model = gltf.scene; // 全局变量引用

      // 如果在 Blender 中调整过朝向，需要做逆向校正
      model.rotation.set(Math.PI/2, 0, 0);

      model.position.set(0, 0.2, 0);
      model.scale.set(0.5, 0.5, 0.5);

      rotationGroup.add(model); // 添加到旋转容器
      console.log("✅ 模型已添加并校正朝向");
    },
    undefined,
    (error) => {
      console.error("❌ 模型加载失败：", error);
    }
  );

  await mindarThree.start();

  // 渲染循环：仅让 rotationGroup 绕 Y 轴自转
  renderer.setAnimationLoop(() => {
    if (model) {
      rotationGroup.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
  });
});

