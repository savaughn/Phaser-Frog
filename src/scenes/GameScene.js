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
        // this.frog = null;

        // if (this.input.gamepad?.pad2) {
        //     this.frog = new Hero({
        //         scene: this,
        //         key: 'frog',
        //         x: 1000,
        //         y: 800,
        //         enablePhysics: true
        //     },
        //     this.input.gamepad?.getPad(1)
        //     );
        //     this.physics.add.collider(this.frog, this.platforms);
        //     console.log(this.frog.setTint(0xef7564));
        // }

        this.hero = new Hero({
            scene: this,
            key: 'frog',
            x: 1100,
            y: 800,
            enablePhysics: true
        },
        this.input.gamepad?.getPad(0)
        );

        this.physics.add.collider(this.hero, this.platforms);
        this.cameras.main.setZoom(4);
        this.cameras.main.startFollow(this.hero, true, 0.8, 0.0, 0, 50);
    }

    update(time, delta) {
        this.hero.update(time, delta);
        // this.frog?.update(time, delta);
    }
}

export default GameScene;
