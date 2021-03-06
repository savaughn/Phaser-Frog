import InputMap from '../helpers/InputMap';
import StateMachineGenerator from '../helpers/StateMachineGenerator';

/**
 * @this {Phaser.GameObjects.Sprite}
 * @var {Phaser.Input.Gamepad.Gamepad} gamepad
 * @var {Phaser.Scene} scene
 */

export default class Hero extends Phaser.GameObjects.Sprite {
    constructor(config, myGamepad) {
        super(config.scene, config.x, config.y);
        if (config.enablePhysics) {
            config.scene.physics.world.enable(this);
            config.scene.add.existing(this);
            this.body.collideWorldBounds = true;
            // Physics
            this.body.setMaxVelocityY(500);
            this.body.width = 6;
            this.body.offset.x = 14;
        }

        this.scene = config.scene;
        this.gamepad = myGamepad;
        this.lock = false;
        this.canSlideBoost = true;
        this.slideCooldown = 3;
        this.slideTimer = null;
        this.canSlide = true;
        this.forceSlideTimer = null;
        this.forceSlide = true;
        this.hasSlid = false;
        this.isSliding = false;

        this.ground = false;
        this.jumpForce = 1;
        this.jumpVelocity = -350;
        this.landing = 'soft';
        this.isFacingLeft = false;
        this.canJump = true;
        this.canDoubleJump = false;
        this.canStand = false;

        this.currentState = 'idle';

        this.input = new InputMap(this, this.scene);
        this.stateMachine = StateMachineGenerator(this, config.key);
        // this.stateMachine = StateMachineGenerator(this, 'hero');
    }

    update(time, delta) {
        // this.stateMachine.transition('jump');
        this.stateMachine.step();
    }
}
