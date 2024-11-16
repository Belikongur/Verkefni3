const ROTATION = Math.PI * 0.5;
export const models = {
    player: {
        mtlUrl: '../resources/player/frog.mtl',
        objUrl: '../resources/player/frog.obj',
        position: [0, 0, 0],
        scale: [0.5, 0.5, 0.5],
        rotation: -ROTATION,
        speed: 1
    },

    car: {
        mtlUrl: '../resources/cars/car.mtl',
        objUrl: '../resources/cars/car.obj',
        position: [-45, 0.1, -28],
        scale: [3, 3, 3],
        rotation: Math.PI,
        speed: 0.35
    },

    Humvee: {
        mtlUrl: '../resources/cars/Humvee.mtl',
        objUrl: '../resources/cars/Humvee.obj',
        position: [-65, 0.1, 27],
        scale: [0.04, 0.04, 0.04],
        rotation: ROTATION,
        speed: 0.5
    },

    G7: {
        mtlUrl: '../resources/cars/G7.mtl',
        objUrl: '../resources/cars/G7.obj',
        position: [-45, 4.4, 40],
        scale: [4, 4, 4],
        rotation: -ROTATION,
        speed: 0.2
    }
}

const extra = {
    tree: {
        url: '../resources/textures/tree.jpg',
        url2: '../resources/textures/treeend.jpg',
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