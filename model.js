import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import three from "./three.js";
import data from "./data.js";
// import gui from "./gui.js";
import voice from "./voice.js";

const fs = require("node:fs");

// 使用GLTF加载器加载外部模型
const gltfLoader = new GLTFLoader();
gltfLoader.load(data.modelPath, onLoad, onProgress, onError);

const meshMap = {}; // { [材质名]: 网格对象 }
const animationMap = {};    // { [动画名]： 动画行为对象 }

let mixer;

const clock = new THREE.Clock();    // 时钟
function update() {
    const delta = clock.getDelta(); // 获取时间差
    mixer?.update(delta);  // 更新动画
};

// 设置要显示的物体
function setMeshes(meshes) {
    Object.keys(meshMap).forEach((mesh) => {
        meshMap[mesh].visible = !meshes || meshes.includes(mesh);
    })
}

// 播放动画
function playAnimation(animation) {
    const animationMeshes = data.getAnimationMeshes(animation); // 动画要显示的物体
    setMeshes(animationMeshes);

    mixer.stopAllAction();  // 停止所有动画
    const action = animationMap[animation];
    action.reset(); // 重置动画
    action.play();  // 激活动画
}

// 模型加载完成
function onLoad(model) {
    // console.log(model);

    const box = new THREE.Box3().setFromObject(model.scene);    // 计算包围模型盒
    const size = box.getSize(new THREE.Vector3());  // 获取包围盒尺寸
    const scale = 1 / size.y;   // 标准化为1个单位高度的比例
    model.scene.scale.set(scale, scale, scale); // 等比例缩放
    model.scene.position.x = 0;
    model.scene.position.y = 0;

    // 网格
    model.scene.traverse((child) => {
        if (child instanceof THREE.SkinnedMesh) {
            child.castShadow = true;    // 投射阴影
            // console.log(child.material.name);   // 打印部件材质名
            meshMap[child.material.name] = child;
        }
    })
    // console.log(model.animations[1].name);

    // 动画混合器
    mixer = new THREE.AnimationMixer(model.scene);
    // 轮播
    let index = 0;
    mixer.addEventListener("finished", () => {
        // console.log("动画播放完成");
        // index = index < model.animations.length - 1 ? index + 1 : 0;
        index = Math.floor(Math.random() * model.animations.length);
        console.log(`anim index: ${index}`);
        playAnimation(model.animations[index].name);
    });

    // 动画
    model.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);  // 动画行为
        action.setLoop(THREE.LoopRepeat, 1);
        animationMap[clip.name] = action;
    })

    three.scene.add(model.scene);   // 将模型添加到场景里

    playAnimation(model.animations[45].name); // 播放动画

    // 初始化控制面板
    // gui.init({
    //     meshes: Object.keys(meshMap),
    //     animations: Object.keys(animationMap),
    // });

    model.scene.add(voice.audio); // 将声音添加到模型上
    voice.randomVoice();    // 随机播放语音
}

// 加载进度
const total = fs.statSync(data.modelPath).size;
function onProgress({ loaded }) {
    console.log(`模型已加载: ${(loaded / total * 100).toFixed(2)}%`);
}

// 加载错误
function onError(error) {
    console.error(error);
}

export default { update, setMeshes, playAnimation };