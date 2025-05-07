import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-image-three';

let model = null; // ✅ 全局变量，便于后续访问模型（如在渲染循环中平滑动画等）

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

  const anchor = mindarThree.addAnchor(0);

  const loader = new GLTFLoader();
  loader.load(
    './assets/model.glb',
    (gltf) => {
      model = gltf.scene; // ✅ 将模型赋值给全局变量

      model.position.set(0, 0.2, 0);
      model.scale.set(0.5, 0.5, 0.5);

      anchor.group.add(model);
      console.log("✅ 模型已添加至 anchor.group");
    },
    undefined,
    (error) => {
      console.error("❌ 模型加载失败：", error);
    }
  );

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    // 如果需要更新模型动画，可在此处访问 model
    if (model) {
      // 示例：模型旋转（或执行平滑插值动画）
      model.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
  });
});
