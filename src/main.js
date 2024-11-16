import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';


// Global variables
let scene, camera, renderer, controls;
let player = new THREE.Object3D();
let cars = [], trees = [], treeBoundingBoxes = [];
const playerBoundingBox = new THREE.Box3();

// Camera varaibles
const DEG2RAD = Math.PI / 180;
let cameraDistance = 5;  // Distance behind the player
let cameraHeight = 2;    // Height above the player
let cameraAzimuth = 0;   // Horizontal rotation around the player
let cameraMaxAzimuth = 45; // Limit for left/right camera panning
let isMousedown = false;
let prevMouseX = 0;

// Models
const models = {
    player: { mtlUrl: './player/frog.mtl', objUrl: './player/frog.obj', position: [0, 0, 0], scale: [0.5, 0.5, 0.5], rotation: Math.PI * -0.5, speed: 1 },
    car: { mtlUrl: './cars/car.mtl', objUrl: './cars/car.obj', position: [-45, 0.1, -28], scale: [3, 3, 3], rotation: Math.PI, speed: 0.35 },
    Humvee: { mtlUrl: './cars/Humvee.mtl', objUrl: './cars/Humvee.obj', position: [-65, 0.1, 27], scale: [0.04, 0.04, 0.04], rotation: Math.PI * 0.5, speed: 0.5 },
    G7: { mtlUrl: './cars/G7.mtl', objUrl: './cars/G7.obj', position: [-45, 4.4, 40], scale: [4, 4, 4], rotation: Math.PI * -0.5, speed: 0.2 }
}

// Textures
const textures = {
    environment: { url: './textures/environment/rural_asphalt_road.jpg', type: "env" },
    grass: { url: './textures/grass.jpg', type: "repeat", repeat: [8, 2], positions: [[0, 0, 0], [0, 0, 52], [0, 0, 74]] },
    road: { url: './textures/road.jpg', type: "repeat", repeat: [8, 6] },
    water: { url: './textures/waves.jpg', type: "none" },
    dirt: { url: './textures/dirt2.jpg', type: "repeat", repeat: [4, 2], positions: [[0, -1.5, 57], [0, -1.5, 69]] },
    tree: {
        url: './textures/tree.jpg',
        url2: './textures/treeend.jpg',
        type: {
            small: {
                size: [2, 2, 7, 32],
                speed: 0.05,
                positions: [[-40, -1.5, 67], [-20, -1.5, 67], [0, -1.5, 67], [20, -1.5, 67], [40, -1.5, 67]],
                reset: [55, -1.5, 67],
                amount: 5
            },
            mid: {
                size: [2, 2, 15, 32],
                speed: 0.1,
                positions: [[40, -1.5, 59], [-40, -1.5, 59]],
                reset: [60, -1.5, 59],
                amount: 2
            },
            large: {
                size: [2, 2, 30, 32],
                speed: 0.1,
                positions: [[0, -1.5, 63]],
                reset: [70, -1.5, 63],
                amount: 1
            }
        },
    }
}

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.6,
    1200
);
camera.position.set(0, cameraHeight, -cameraDistance);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#233143");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const light = new THREE.DirectionalLight(0xFFFFFF, 1, 100);
light.position.set(0, 1, 1);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target);

const animate = () => {
    requestAnimationFrame(animate);

    playerBoundingBox.setFromObject(player);

    cars.forEach(({ car, boundingBox, position, speed }) => {
        car.position.x += speed;
        if (car.position.x > 80) car.position.set(...position);
        boundingBox.setFromObject(car);
        if (playerBoundingBox.intersectsBox(boundingBox)) player.position.set(...models.player.position);
    });

    trees.forEach(({ tree, type, boundingBox, reset, speed }) => {
        tree.position.x -= speed;
        switch (type) {
            case "small":
                if (tree.position.x < -55) tree.position.set(...reset);
                break;
            case "mid":
                if (tree.position.x < -60) tree.position.set(...reset);
                break;
            case "large":
                if (tree.position.x < -70) tree.position.set(...reset);
                break;
        }
        boundingBox.setFromObject(tree);
        if (playerBoundingBox.intersectsBox(boundingBox)) {
            player.position.x -= speed;
            if (player.position.x < -48) player.position.set(...models.player.position);
        }
    });

    if (player.position.z > 55 && player.position.z < 70) {
        let intersecting = treeBoundingBoxes.some(bbox => playerBoundingBox.intersectsBox(bbox));
        if (!intersecting) player.position.set(...models.player.position);
    }
    renderer.render(scene, camera);
}

const manager = new THREE.LoadingManager();
manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    document.querySelector('#progressbar').style.width = `${progress}%`;
};

manager.onLoad = () => {
    document.querySelector('#loading').style.display = 'none';
    addRoadMarkings();
    animate();
};

for (const name in models) {
    const mtlLoader = new MTLLoader(manager);
    const objLoader = new OBJLoader(manager);
    const { mtlUrl, objUrl, position, scale, rotation, speed } = models[name];
    mtlLoader.load(mtlUrl, (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load(objUrl, (model) => {
            model.position.set(...position);
            model.scale.set(...scale);
            scene.add(model);
            if (name === "player") {
                model.rotation.x = Math.PI * -0.5;
                player = model;
                player.speed = speed;
            }
            else {
                model.rotation.y = rotation;
                const carBoundingBox = new THREE.Box3().setFromObject(model);
                cars.push({ car: model, boundingBox: carBoundingBox, position, speed });
            }
        });
    });
}

const loader = new THREE.TextureLoader(manager);
for (const name in textures) {
    const { url, type, repeat, positions } = textures[name];
    const texture = loader.load(url, () => {
        switch (type) {
            case "env":
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.colorSpace = THREE.SRGBColorSpace;
                scene.background = texture;
                break;
            case "repeat":
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(...repeat);
                break;
            case "none":
                break;
        }
    })

    switch (name) {
        case "grass":
            const geometry = new THREE.PlaneGeometry(100, 10);
            const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            for (let i = 0; i < 3; i++) {
                const grass = new THREE.Mesh(geometry, material);
                grass.rotation.x = -0.5 * Math.PI;
                grass.position.set(...positions[i]);
                scene.add(grass);
            }
            break;
        case "road":
            const roadGeometry = new THREE.PlaneGeometry(100, 42);
            const roadMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            const road = new THREE.Mesh(roadGeometry, roadMaterial);
            road.rotation.x = -0.5 * Math.PI;
            road.position.set(0, 0, 26)
            scene.add(road);
            break;
        case "water":
            const waterGeometry = new THREE.PlaneGeometry(100, 12);
            const waterMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            const water = new THREE.Mesh(waterGeometry, waterMaterial);
            water.rotation.x = -0.5 * Math.PI;
            water.position.set(0, -3, 63);
            scene.add(water);
            break;
        case "dirt":
            const dirtGeometry = new THREE.PlaneGeometry(100, 3);
            const dirtMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            for (let i = 0; i < 2; i++) {
                const dirt = new THREE.Mesh(dirtGeometry, dirtMaterial);
                dirt.position.set(...positions[i]);
                scene.add(dirt);
            }
            break;
        case "tree":
            const { url2 } = textures[name];
            const ends = loader.load(url2);
            const treeMaterials = [
                new THREE.MeshBasicMaterial({ map: texture }),
                new THREE.MeshBasicMaterial({ map: ends }),
                new THREE.MeshBasicMaterial({ map: ends })
            ];
            for (let tree in type) {
                const { positions: pos, reset, size, speed, amount } = type[tree];
                for (let i = 0; i < amount; i++) {
                    const treeGeometry = new THREE.CylinderGeometry(...size);
                    const treeCylinder = new THREE.Mesh(treeGeometry, treeMaterials);
                    treeCylinder.rotation.x = -0.5 * Math.PI;
                    treeCylinder.rotation.z = 0.5 * Math.PI;
                    treeCylinder.position.set(...pos[i]);
                    scene.add(treeCylinder);
                    const treeBoundingBox = new THREE.Box3().setFromObject(treeCylinder);
                    treeBoundingBoxes.push(treeBoundingBox);
                    trees.push({ tree: treeCylinder, boundingBox: treeBoundingBox, type: tree, size, speed, reset });
                }
            }
            break;
    }
}

function addRoadMarkings(start = 45, spacing = 10, count = 10) {
    const lineGeometry = new THREE.PlaneGeometry(1, 4);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    for (let lane = 0; lane < 2; lane++) {
        for (let i = 0; i < count; i++) {
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = -0.5 * Math.PI;
            line.rotation.z = Math.PI / 2;
            if (lane == 0) line.position.set(start - i * spacing, 0.1, 20);
            else line.position.set(start - i * spacing, 0.1, 35);
            scene.add(line);
        }
    }
}


window.addEventListener("mousedown", (event) => {
    isMousedown = true;
    prevMouseX = event.clientX;
});

window.addEventListener("mouseup", () => {
    isMousedown = false;
});

window.addEventListener("mousemove", (event) => {
    if (isMousedown) {
        cameraAzimuth += (event.clientX - prevMouseX) * 0.2;
        cameraAzimuth = Math.max(-cameraMaxAzimuth, Math.min(cameraMaxAzimuth, cameraAzimuth));
        updateCameraPosition();
    }
    prevMouseX = event.clientX;
});

function updateCameraPosition() {
    const azimuthRad = cameraAzimuth * DEG2RAD;
    const offsetX = cameraDistance * Math.sin(azimuthRad);
    const offsetZ = cameraDistance * Math.cos(azimuthRad);

    camera.position.set(
        player.position.x - offsetX,
        player.position.y + cameraHeight,
        player.position.z - offsetZ
    );
    camera.lookAt(player.position);
}

let lastKeyPressed = '';  // Track the last key pressed for movement

window.addEventListener("keydown", (e) => {
    const movement = {
        w: { axis: 'z', direction: 1 },
        s: { axis: 'z', direction: -1 },
        a: { axis: 'x', direction: 1 },
        d: { axis: 'x', direction: -1 }
    };

    if (movement[e.key]) {
        const { axis, direction } = movement[e.key];

        // Check if the current movement is the same as the previous one
        if (lastKeyPressed === e.key) {
            // Move the player by one step in the same direction
            player.position[axis] += direction;
        } else {
            // If different key, just rotate the player
            player.rotation.z = axis === 'z'
                ? (direction === 1 ? 0 : Math.PI)
                : (direction === 1 ? Math.PI * 0.5 : Math.PI * -0.5);
        }

        // Update lastKeyPressed for the next movement
        lastKeyPressed = e.key;

        updateCameraPosition();
    }
});

// window.addEventListener("keydown", (e) => {
//     const movement = {
//         w: { axis: 'z', direction: 1 },
//         s: { axis: 'z', direction: -1 },
//         a: { axis: 'x', direction: 1 },
//         d: { axis: 'x', direction: -1 }
//     };
//     if (movement[e.key]) {
//         const { axis, direction } = movement[e.key];
//         player.position[axis] += direction;
//         player.rotation.z = axis === 'z' ? (direction === 1 ? 0 : Math.PI) : (direction === 1 ? Math.PI * 0.5 : Math.PI * -0.5);
//         updateCameraPosition();
//     }
// });

// Player controls
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            if (player.position.z < 79) player.position.z += 1;
            player.rotation.z = 0;
            cameraOffsetZ += 1;
            break;
        case "s":
            if (player.position.z > -4) player.position.z -= 1;
            player.rotation.z = Math.PI;
            cameraOffsetZ -= 1;
            break;
        case "a":
            if (player.position.x < 49) player.position.x += 1;
            player.rotation.z = Math.PI * 0.5;
            break;
        case "d":
            if (player.position.x > -49) player.position.x -= 1;
            player.rotation.z = Math.PI * -0.5;
    }

    if (player && player.position) {
        updateCameraPosition();
    }
});




