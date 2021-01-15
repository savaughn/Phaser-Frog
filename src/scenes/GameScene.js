import buildScene from '../helpers/buildScene';
import Hero from '../sprites/Hero';

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }

    create() {
        // this.scale.setGameSize(this.width, this.height);
        buildScene(this);

        this.hero = new Hero({
            scene: this,
            key: 'hero',
            x: 800,
            y: 300
        });

        this.physics.add.collider(this.hero, this.platforms);
        // this.cameras.main.setViewport(0, 0, 200, 600);
        this.cameras.main.setZoom(3);
    }

    update(time, delta) {
        this.hero.update(time, delta);
    }
}

export default GameScene;
