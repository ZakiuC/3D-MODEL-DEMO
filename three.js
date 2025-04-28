import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import model from "./model.js";

// 场景
const scene = new THREE.Scene();

// 透视相机
const camera = new THREE.PerspectiveCamera(
    75, // fov (视野角度)
    window.innerWidth / window.innerHeight, // aspect (长宽比)
    0.1, // near (最近视距)
    1000    // far (最远视距)
);
camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer({
    alpha: true,    // 背景透明
    antialias: true, // 抗锯齿
});
renderer.setSize(window.innerWidth, window.innerHeight);    // 画布大小
renderer.setPixelRatio(window.devicePixelRatio);    // 像素比
renderer.shadowMap.enabled = true;  // 启用阴影贴图
document.body.appendChild(renderer.domElement); // 挂载画布到DOM

// 坐标轴
// const axesHelper = new THREE.AxesHelper(10);
// scene.add(axesHelper);

// 轨道控制器
// const orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.addEventListener("change", render);

// // 几何体
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// // 贴图
// const texture = new THREE.TextureLoader().load("assets/crate.jpg",
//     render
// );
// texture.colorSpace = THREE.SRGBColorSpace;  // 伽马矫正
// // 材质
// const material = new THREE.MeshLambertMaterial({
//     // color: 0x888888, // 颜色
//     // wireframe: true,   // 渲染为线框
//     map: texture,       // 贴图
// });
// // 网格
// const mesh = new THREE.Mesh(geometry, material);
// mesh.castShadow = true; // 投射阴影
// scene.add(mesh);
// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.set(0, 1, 1);
pointLight.castShadow = true;   // 投射阴影
scene.add(pointLight);

// 阴影
const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),  // 平面
    new THREE.ShadowMaterial({ opacity: 0.2 })  // 阴影材质
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = -2;
shadow.receiveShadow = true;    // 接受阴影
scene.add(shadow);

// 渲染
let requestID;
function render() {
    requestID = requestAnimationFrame(render);
    model.update(); // 更新动画
    renderer.render(scene, camera);
}
render()

function stopRender() {
    cancelAnimationFrame(requestID);
}

export default { scene, camera, render, stopRender };