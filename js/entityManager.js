import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { loadingManager } from './loadingManager.js';
import { models } from './models.js';

export const entityManager = (() => {
    const entities = {
        cars: [],
        player: null,
        trees: []
    };

    function addEntity(type, entityData) {
        if (type === 'player') {
            entities.player = entityData;
        } else if (type === 'car' || type === 'Humvee' || type === 'G7') {
            entities.cars.push(entityData);
        } else {
            console.error(`Unknown entity type: ${type}`);
        }
    }

    function getEntity(type) {
        return entities[type] || [];
    }

    function getPlayer() {
        return entities.player;
    }

    function createEntity(type, id, model, callback) {
        const mtlLoader = new MTLLoader(loadingManager);
        const objLoader = new OBJLoader(loadingManager);

        let mesh = null;
        let boundingBox = new THREE.Box3();
        let entity = null;

        mtlLoader.load(model.mtlUrl, (mtl) => {
            mtl.preload();
            objLoader.setMaterials(mtl);
            objLoader.load(model.objUrl, (obj) => {
                obj.scale.set(...model.scale);
                obj.position.set(...model.position);
                boundingBox.setFromObject(obj);
                type === 'player' ? obj.rotation.x = model.rotation : obj.rotation.y = model.rotation;

                entity = {
                    id,
                    type,
                    mesh: obj,
                    boundingBox,
                    speed: model.speed
                };
                addEntity(type, entity);
                if (callback) callback(entity);
            });
        });
        return entity;
    }

    return {
        createEntity,
        addEntity,
        getPlayer,
        getEntity
    };
})();


export function initializeEntities(scene) {
    let id = 0;
    const totalEntities = Object.keys(models).length;

    // Iterate over the models and create each entity
    for (const name in models) {
        entityManager.createEntity(name, id++, models[name], (entity) => {
            if (entity && entity.mesh) {
                scene.add(entity.mesh); // Add the mesh to the scene
            }

            //loadedEntities++;
            //if (loadedEntities === totalEntities) {
            //    console.log("All entities loaded!");
            //    // You can trigger any additional game setup after all entities are added
            //}
        });
    }
}


