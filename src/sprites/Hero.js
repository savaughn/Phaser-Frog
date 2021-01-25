import * as StateMachine from '../helpers/StateMachine.hero';

/**
 * @this {Phaser.GameObjects.Sprite}
 * @var {Phaser.Input.Gamepad.Gamepad} gamepad
 * @var {Phaser.Scene} scene
 */

export default class Hero extends Phaser.GameObjects.Sprite {
    constructor(config, myGamepad) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.body.setBoundsRectangle(Phaser.Geom.Rectangle.FromXY(740, 0, 1075, 1000));
        this.body.collideWorldBounds = true;

        this.scene = config.scene;
        this.gamepad = myGamepad;
        // this.armed = false;
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

        this.canDoubleJump = false;

        this.leftAxis = this.gamepad._HAxisLeft;

        // The state machine managing the hero
        this.stateMachine = new StateMachine.StateMachine('jump', {
            idle: new StateMachine.IdleState(),
            move: new StateMachine.MoveState(),
            crouch: new StateMachine.CrouchState(),
            jump: new StateMachine.JumpState(),
            doubleJump: new StateMachine.DoubleJumpState(),
            slide: new StateMachine.SlideState({ inputAxisValue: this.leftAxis.value }),
            land: new StateMachine.LandingState()
        }, [this.scene, this]);

        this.keys = {
            jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            jump2: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            fire: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            dec: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            inc: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)
        };
    }

    update(time, delta) {
        this.stateMachine.step();
    }

    handleLanding() {
        // Land and run
        if (this.keys.right.isDown || this.keys.left.isDown) {
            this.body.setVelocityX(this.body.velocity.x / 2);
            if (!this.hasDoubleJumped) { this.anims.play('crouch', true); }
            this.lock = true;
        }
        // land and stop
        if (this.body.velocity.x > 0.1 || this.body.velocity.x < -0.1) {
            this.body.setVelocityX(this.body.velocity.x / 1.35);
        } else {
            this.body.setVelocityX(0);
        }
    }
}
