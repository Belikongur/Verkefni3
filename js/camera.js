import * as THREE from 'three';

export function createCamera(window) {
    const DEG2RAD = Math.PI / 180;

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.6,
        1200
    );
    //camera.position.set(0, 8, -58); // Position camera for a better view
    //camera.lookAt(0, 0, -47); // Look at the center of the plane
    let cameraRadius = 4;
    let cameraAzimuth = 0;
    let cameraElevation = 0;
    let isMousedown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    updateCameraPosition();

    function onMouseDown() {
        console.log('mousedown');
        isMousedown = true;
    }

    function onMouseUp() {
        console.log('mouseup');
        isMousedown = false;
    }

    function onMouseMove(event) {
        console.log('mousemove');
        const deltaY = (event.clientY - prevMouseY);
        if (isMousedown) {
            cameraAzimuth += -((event.clientX - prevMouseX) * 0.5);
            cameraElevation += ((event.clientY - prevMouseY) * 0.5);
            cameraElevation = Math.min(180, Math.max(0, cameraElevation));
            updateCameraPosition();
        }
        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }

    function updateCameraPosition() {
        camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
        camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.lookAt(0, 0, 0);
        camera.updateMatrix();
    }
    return {
        camera,
        onMouseDown,
        onMouseUp,
        onMouseMove
    }
}