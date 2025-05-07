import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-image-three';

let model = null;

document.addEventListener("DOMContentLoaded", async () => {
  // 初始化 MindAR
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "./assets/target.mind",
  });
  const { renderer, scene, camera } = mindarThree;

  // —— 一：环境光——
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // —— 二：平行光——
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0, 5, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  // —— 三：点光源——
  const pointLight = new THREE.PointLight(0xffaa88, 0.6, 10, 2);
  pointLight.position.set(0, 2, -2);
  scene.add(pointLight);

  // —— 四：半球光（可选）——
  const hemiLight = new THREE.HemisphereLight(0x4488bb, 0x222222, 0.4);
  scene.add(hemiLight);

  // 创建校正与旋转容器
  const anchor = mindarThree.addAnchor(0);
  const orientationGroup = new THREE.Group();
  const rotationGroup    = new THREE.Group();
  anchor.group.add(orientationGroup);
  orientationGroup.add(rotationGroup);

  // 加载 GLTF 模型
  const loader = new GLTFLoader();
  loader.load(
    './assets/model.glb',
    (gltf) => {
      model = gltf.scene;

      // 如果在 Blender 中旋转过模型，需要做逆向校正
      model.rotation.set(Math.PI/2, 0, 0);

      // 设置模型位置与缩放
      model.position.set(0, 0.2, 0);
      model.scale.set(0.5, 0.5, 0.5);

      // 添加到 rotationGroup
      rotationGroup.add(model);
      console.log("✅ 模型已添加并校正朝向");
    },
    undefined,
    (error) => console.error("❌ 模型加载失败：", error)
  );

  // 启动 AR
  await mindarThree.start();

  // 渲染循环：持续绕 Y 轴自转
  renderer.setAnimationLoop(() => {
    if (model) {
      rotationGroup.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
  });
});

    renderer.render(scene, camera);
  });
});
