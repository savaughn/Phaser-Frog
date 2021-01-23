import buildScene from '../helpers/buildScene';
import Hero from '../sprites/Hero';

class GameScene extends Phaser.Scene {
    constructor(config) {
        super({
            key: 'GameScene'
        });
    }

    create() {
        buildScene(this);

        this.hero = new Hero({
            scene: this,
            key: 'hero',
            x: 800,
            y: 300
        },
        this.input.gamepad.getPad(0)
        );

        this.physics.add.collider(this.hero, this.platforms);
        this.cameras.main.setZoom(3);
    }

    update(time, delta) {
        this.hero.update(time, delta);
    }
}

export default GameScene;
