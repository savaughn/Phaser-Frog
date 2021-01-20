import * as StateMachine from '../helpers/StateMachine.hero';

/**
 * @this {Phaser.GameObjects.Sprite}
 * @var {Phaser.Input.Gamepad.Gamepad} controller
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
        this.jumpTimer = null;
        this.canSlide = true;
        this.hasSlid = false;
        this.isSliding = false;

        this.ground = false;
        this.jumpForce = 1;
        this.jumpVelocity = -350;
        this.landing = 'soft';
        this.move = 0;
        this.isFacingLeft = false;

        this.canDoubleJump = false;

        // The state machine managing the hero
        this.stateMachine = new StateMachine.StateMachine('jump', {
            idle: new StateMachine.IdleState(),
            move: new StateMachine.MoveState(),
            crouch: new StateMachine.CrouchState(),
            jump: new StateMachine.JumpState(),
            doubleJump: new StateMachine.DoubleJumpState(),
            slide: new StateMachine.SlideState()
        }, [this.scene, this]);

        this.keys = {
            jump: this.gamepad.A,
            jump2: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            fire: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            dec: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            inc: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)
        };
        // console.log(this.gamepad);
        this.leftAxis = this.gamepad._HAxisLeft;
        // this.leftAxis = new Phaser.Input.Gamepad.Axis(this.gamepad.pad, 0);
    }

    update(time, delta) {

        // console.log(this.leftAxis.value);
        // console.log(this.gamepad.pad.axes[1]);
        // console.log(this.gamepad.pad.axes[2]);
        // console.log(this.gamepad.pad.axes[3]);
        // console.log(this.leftAxis);
        // this.val = this.leftAxis.value;
        // console.log(this.val);
        // console.log('a', this.gamepad.axes[0].value);
        // console.log('x', this.gamepad.axes[1].value);
        // console.log(this.gamepad.axes[2].value);
        // console.log(this.gamepad.axes[3].value);
        // console.log(this.keys.jump);
        // let pad;
        // if (this.scene.input) {
        //     console.log('connected');
        // }
        // this.scene.input.gamepad.getPad(0);
        // let pad;
        // if (this.scene.input.gamepad.gamepads.length > 0) {
        //     pad = this.scene.input.gamepad.pad1;
        // }
        // console.log(this.scene.input.gamepad);
        // console.log(this.gamepad);
        this.ground = this.body.onFloor();
        this.stateMachine.step();
        // if (this.keys.inc.isDown) {
        //     this.jumpForce += 0.01;
        //     console.log('Jump: ' + this.jumpVelocity * this.jumpForce);
        // }

        // if (this.keys.dec.isDown) {
        //     this.jumpForce -= 0.01;
        //     console.log('Jump: ' + this.jumpVelocity * this.jumpForce);
        // }

        // console.log(this.leftAxis.getValue(0))

        // this.once('animationcomplete', anim => {
        //     this.once(`animationcomplete_${anim.key}`);
        // }, this);

        // if (this.body.onFloor()) {
        //     // Landing from jump
        //     if (this.anims.currentAnim.key === 'jump-down') {
        //         this.handleLanding();
        //     }
        //     if (this.keys.down.isDown) {
        //         // Player is moving
        //         if (this.body.velocity.x !== 0) {
        //             if (this.canSlide) {
        //                 this.slide();
        //             }
        //             // if (this.canSlide) {
        //             //     this.slide();
        //             //     if (this.hasSlid) { this.canSlide = false; }
        //             //     // console.log('cooldown start');
        //             //     this.jumpTimer = this.scene.time.addEvent({
        //             //         delay: 5000,
        //             //         callback: () => {
        //             //             console.log('cooldown done');
        //             //             this.canSlide = true;
        //             //         }
        //             //     });
        //             // }
        //         } else {
        //             console.log('crouch');
        //             // Player is staning still (crouch)
        //             this.anims.play('crouch', false);
        //         }
        //     } else if (!this.lock && this.keys.left.isDown && this.body.onFloor()) {
        //         this.move('left');
        //     } else if (!this.lock && this.keys.right.isDown & this.body.onFloor()) {
        //         this.move('right');
        //     } else if (!this.lock) {
        //         // Slow down player
        //         if (this.body.velocity.x > 0.1 || this.body.velocity.x < -0.1) {
        //             this.body.setVelocityX(this.body.velocity.x / 2);
        //         } else {
        //             this.body.setVelocityX(0);
        //         }
        //         this.anims.play('idle', true);
        //     }
        //     if (!this.keys.jump.isDown) {
        //         this.canJump = true;
        //     }
        //     if (!this.keys.down.isDown && this.isSliding) {
        //         this.hasSlid = true;
        //         this.isSliding = false;
        //     }
        // } else {
        //     if (this.keys.left.isDown) { this.move('left', 0.5, false); }
        //     if (this.keys.right.isDown) { this.move('right', 0.5, false); }
        //     if (this.keys.jump.isDown && this.canDoubleJump && this.hasJumped) { this.doubleJump(); }
        // }
        // // standard jump
        // if (this.canJump && this.keys.jump.isDown && this.body.onFloor()) {
        //     this.jump();
        // }

        // // Jump key let go
        // if (!this.keys.jump.isDown && !this.body.onFloor() && !this.canJump) {
        //     this.hasJumped = true;
        // }
            
        // if (this.body.velocity.y > 0) {
        //     this.anims.play('jump-down', true);
        //     this.lock = true;
        // }
    }

    slide() {
        this.anims.play('slide', true);
        this.isSliding = true;
        // if (this.canSlideBoost) { this.body.setVelocityX(this.body.velocity.x * 1.5); }
        this.body.setVelocityX(this.body.velocity.x / 1.025);
        if ((this.body.velocity.x > 0 && this.body.velocity.x < 80) || (this.body.velocity.x < 0 && this.body.velocity.x > -80)) {
            this.body.setVelocityX(0);
            this.isSliding = false;
            this.canSlide = false;
        };
        // this.canSlideBoost = false;
    }

    doubleJump() {
        this.body.setVelocityY(-350);
        this.anims.play('roll', true);
        this.canDoubleJump = false;
        this.hasDoubleJumped = true;
    }

    jump() {
        this.body.setVelocityY(-350);
        this.anims.play('jump-up', true);
        this.canJump = false;
        this.hasJumped = false;
        this.canDoubleJump = true;
        this.hasDoubleJumped = false;
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
        // idle from landing
        this.on('animationcomplete', () => {
            this.anims.play('idle', true);
            this.lock = false;
        });
    }

    move(direction, scale = 1, animate = true) {
        const dir = direction === 'right' ? 1 : -1;
        this.body.setVelocityX(dir * 175 * scale);
        this.setFlipX(direction === 'left');
        if (animate) { this.anims.play('run', true); }
    }
}
