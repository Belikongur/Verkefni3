import * as THREE from 'three';

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log(`Started loading ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};

loadingManager.onLoad = () => {
    const loadingElem = document.querySelector('#loading');
    loadingElem.style.display = 'none';
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    const progressbarElem = document.querySelector('#progressbar');
    progressbarElem.style.width = `${progress}%`;
};

loadingManager.onError = (url) => {
    console.error(`Error loading ${url}`);
};

export { loadingManager };