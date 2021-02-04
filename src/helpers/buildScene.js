/**
 * 
 * @param {Phaser.Scene} scene 
 */
export default function buildScene(scene) {
    scene.map = scene.make.tilemap({
        key: 'map'
    });
    scene.tileset = scene.map.addTilesetImage('Terrain', 'tiles');

    scene.background = scene.map.createLayer('sky', scene.tileset, 0, 400);
    scene.platforms = scene.map.createLayer('ground', scene.tileset, 0, 400);
    scene.platforms.setCollisionByExclusion(-1, true);
}
