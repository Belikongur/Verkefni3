import * as THREE from 'three';
import { loadingManager } from './loadingManager.js';
import { textures } from './textures.js';

const ROTATIONX = -0.5 * Math.PI;
function applyRepeatingTexture(texture, repeat) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(...repeat);
}

export function initializeEnvironment(scene) {
    const loader = new THREE.TextureLoader(loadingManager);
    const totalTextures = Object.keys(models).length;
    for (const name in textures) {
        const { url, type, repeat, positions } = textures[name];

        loader.load(url, (texture) => {
            switch (type) {
                case "env":
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    texture.colorSpace = THREE.SRGBColorSpace;
                    scene.background = texture;
                    break;
                case "repeat":
                    applyRepeatingTexture(texture, repeat);
                    break;
                case "none":
                    break;
            }

            switch (name) {
                case "grass":
                    const grassGeometry = new THREE.PlaneGeometry(100, 10);
                    const grassMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                    positions.forEach(position => {
                        const grass = new THREE.Mesh(grassGeometry, grassMaterial);
                        grass.rotation.x = ROTATIONX;
                        grass.position.set(...position);
                        scene.add(grass);
                    });
                    break;

                case "road":
                    const roadGeometry = new THREE.PlaneGeometry(100, 42);
                    const roadMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                    const road = new THREE.Mesh(roadGeometry, roadMaterial);
                    road.rotation.x = ROTATIONX;
                    road.position.set(0, 0, 26)
                    scene.add(road);
                    break;

                case "water":
                    const waterGeometry = new THREE.PlaneGeometry(100, 12);
                    const waterMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                    const water = new THREE.Mesh(waterGeometry, waterMaterial);
                    water.rotation.x = ROTATIONX;
                    water.position.set(0, -3, 63);
                    scene.add(water);
                    break;

                case "dirt":
                    const dirtGeometry = new THREE.PlaneGeometry(100, 3);
                    const dirtMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                    positions.forEach(position => {
                        const dirt = new THREE.Mesh(dirtGeometry, dirtMaterial);
                        dirt.position.set(...position);
                        scene.add(dirt);
                    });
                    break;
            }

        });
    }
}