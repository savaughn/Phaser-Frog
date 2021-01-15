import Hero from "../sprites/Hero";

export default function buildScene(scene) {
        scene.map = scene.make.tilemap({ key: 'map' })
        scene.tileset = scene.map.addTilesetImage('platformer', 'tiles')

        scene.background = scene.map.createStaticLayer('Tile Layer 2', scene.tileset, 0, 25);
        scene.platforms = scene.map.createStaticLayer('platform', scene.tileset, 0, 100);
        scene.platforms.setCollisionByExclusion(-1, true)

        // scene.hero = new Hero({
        //     scene: scene,
        //     key: 'hero',
        //     x: 30,
        //     y: 50
        // })
        
        // scene.physics.add.collider(scene.hero, scene.platforms);
}