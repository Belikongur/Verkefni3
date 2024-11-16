import * as THREE from 'three';
import { createScene } from './scene.js';

export function createGame() {
    const scene = createScene();
    scene.initialize();
    scene.start();

    document.addEventListener('mousedown', scene.onMouseDown, false);
    document.addEventListener('mouseup', scene.onMouseUp, false);
    document.addEventListener('mousemove', scene.onMouseMove, false);


    //const game = {
    //    update() {
    //        //scene.update();
    //    }
    //}
    //
    //setInterval(() => {
    //    game.update();
    //}, 1000);


    //return {
    //    game
    //}
}