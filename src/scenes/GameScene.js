import buildScene from '../helpers/buildScene';
import Hero from '../sprites/Hero';

class GameScene extends Phaser.Scene {
    constructor(config) {
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
        },
        this.input.gamepad.pad1
        );

        this.physics.add.collider(this.hero, this.platforms);
        // this.cameras.main.setViewport(0, 0, 200, 600);
        this.cameras.main.setZoom(3);
        // console.log(this.input.gamepad.gamepads.length);
        // this.hero.gamepad = this.pad;
        // console.log(this.myGamepad.pad1);
        // console.log(this.input.gamepad.pad1);
    }

    update(time, delta) {
        // this.gamepad.pad1.on('down', (pad, button, val) => {
        //     console.log(pad, button, val);
        // });
        // console.log(this.input.gamepad.pad1.A);
        // this.input.gamepad.once('connected', () => {
        //     console.log('connected pad: ' + this.input.gamepad.pad1.index);
        //     this.hero.gamepad = this.input.gamepad.pad1;
        //     this.controllerConnected = true;
        // });

        // if (this.controllerConnected) {
            this.hero.update(time, delta);
        // }
    }
}

export default GameScene;
