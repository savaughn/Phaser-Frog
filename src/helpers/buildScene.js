/**
 * 
 * @param {Phaser.Scene} scene 
 */
export default function buildScene(scene) {
    scene.map = scene.make.tilemap({
        key: 'map'
    });
    scene.tileset = scene.map.addTilesetImage('platformer', 'tiles');

    scene.background = scene.map.createLayer('Tile Layer 2', scene.tileset, 750, 400);
    scene.platforms = scene.map.createLayer('platform', scene.tileset, 750, 475);
    scene.platforms.setCollisionByExclusion(-1, true);
}
