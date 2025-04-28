import * as THREE from "three";
import three from "./three.js";

const fs = require("node:fs");

const voices = fs.readdirSync("./assets/Voices");

// 声音监听器
const audioListener = new THREE.AudioListener();
setTimeout(() => {
    three.camera.add(audioListener);
}, 0);

// 音频
const audio = new THREE.PositionalAudio(audioListener);
audio.setVolume(0.3);
audio.onEnded = randomVoice;

// 音频加载器
const audioLoader = new THREE.AudioLoader();


function playVoice(voice)
{
    audio.stop();
    audioLoader.load(`./assets/Voices/${voice}`, (buffer) => {
        audio.setBuffer(buffer);
        audio.play();
    })
}

function randomVoice()
{
    const index = Math.floor(Math.random() * voices.length);
    playVoice(voices[index]);
}

// randomVoice();

export default { audio, randomVoice };