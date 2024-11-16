import * as THREE from 'three';
import { createCamera } from './camera.js';
import { initializeEntities } from './entityManager.js';
import { initializeEnvironment } from './environment.js';


export function createScene() {
    const scene = new THREE.Scene();

    const camera = createCamera(window);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#233143");
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.camera.aspect = window.innerWidth / window.innerHeight;
        camera.camera.updateProjectionMatrix();
    });

    function initialize() {
        setupLights();

        initializeEnvironment(scene);
        initializeEntities(scene);
    }

    function setupLights() {
        const lights = [
            new THREE.AmbientLight(0xffffff, 0.2),
            new THREE.DirectionalLight(0xffffff, 0.3),
            new THREE.DirectionalLight(0xffffff, 0.3),
            new THREE.DirectionalLight(0xffffff, 0.3)
        ]

        lights[1].position.set(0, 1, 0);
        lights[2].position.set(1, 1, 0);
        lights[3].position.set(0, 1, 1);

        scene.add(...lights);
    }

    function draw() {
        //mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.01;
        renderer.render(scene, camera.camera);
    }

    function start() {
        renderer.setAnimationLoop(draw);
    }

    function stop() {
        renderer.setAnimationLoop(null);
    }

    function onMouseDown() {
        camera.onMouseDown();
    }

    function onMouseUp() {
        camera.onMouseUp();
    }

    function onMouseMove(event) {
        camera.onMouseMove(event);
    }


    return {
        scene,
        initialize,
        start,
        stop,
        onMouseDown,
        onMouseUp,
        onMouseMove
    }
}