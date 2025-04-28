import model from "./model.json" with { type: "json" };

const fs = require("node:fs");

export default {
    get modelPath() {
        return model.path;
    },

    getAnimationMeshes(animation) {
        const meshes = model.animations.find(item => item.animation ===
            animation)?.meshes;
        return meshes && meshes.length > 0 ? meshes : null;
    },

    setAnimationMeshes(animation, meshes) {
        const index = model.animations.findIndex((item) => item.animation === animation);
        if (index > -1) {
            model.animations[index].meshes = meshes;
        } else {
            model.animations.push({ animation, meshes });
        }
    },

    save(){
        fs.writeFileSync("./model.json", JSON.stringify(model, null, 4));
    }
}