import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import model from "./model.js";
import data from "./data.js";

const gui = new GUI({ title: "控制面板" });

const guiData = {
    保存(){
        data.save();
    },
    meshes: {},
    animations: {},
};
gui.add(guiData, "保存");

let curAnimation;

function init({ meshes, animations }) {
    const meshesFolder = gui.addFolder("物体");
    meshes.forEach((mesh) => {
        guiData.meshes[mesh] = true;
        meshesFolder.add(guiData.meshes, mesh)
            .listen()
            .onChange((value) => {
                // alert(`${mesh}: ${value}`);
                const visibleMeshes = meshes.filter((mesh) => guiData.meshes[mesh]);
                model.setMeshes(visibleMeshes);

                if (curAnimation) {
                    data.setAnimationMeshes(curAnimation, visibleMeshes);
                }
            });
    });

    const animationsFolder = gui.addFolder("动画");
    // console.log(animationsFolder);
    animationsFolder.$children.style.cssText = "max-height: calc(100vh - 260px); overflow-y: auto;";
    animations.forEach((animation, index) => {
        guiData.animations[animation] = () => {
            // alert(`播放动画${animation}`);
            // console.log(`当前动画：${animation}，索引：${index}`);
            curAnimation = animation;

            const animationMeshes = data.getAnimationMeshes(animation);
            meshes.forEach((mesh) => {
                guiData.meshes[mesh] = !animationMeshes || animationMeshes.includes(mesh);
            });
            model.playAnimation(animation);
        };
        animationsFolder.add(guiData.animations, animation);
    });
}


export default { init };
