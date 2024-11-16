export const textures = {
    environment: {
        url: '../resources/textures/environment/rural_asphalt_road.jpg',
        type: "env"
    },
    grass: {
        url: '../resources/textures/grass.jpg',
        type: "repeat",
        repeat: [8, 2],
        positions: [
            [0, 0, 0],
            [0, 0, 52],
            [0, 0, 74]
        ]
    },
    road: {
        url: '../resources/textures/road.jpg',
        type: "repeat",
        repeat: [8, 6]
    },
    water: {
        url: '../resources/textures/waves.jpg',
        type: "none"
    },
    dirt: {
        url: '../resources/textures/dirt2.jpg',
        type: "repeat",
        repeat: [4, 2],
        positions: [
            [0, -1.5, 57],
            [0, -1.5, 69]
        ]
    },
}