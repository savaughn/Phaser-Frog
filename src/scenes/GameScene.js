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
            x: 700,
            y: 750
        },
        this.input.gamepad?.getPad(0)
        );

        this.physics.add.collider(this.hero, this.platforms);
        this.cameras.main.setZoom(4);
        this.cameras.main.startFollow(this.hero, true, 0.8, 0.0, 0, 0);
    }

    update(time, delta) {
        this.hero.update(time, delta);
    }
}

export default GameScene;
