import * as StateMachine from '../helpers/StateMachine.hero';

/**
 * @this {Phaser.GameObjects.Sprite}
 */

export default class Hero extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.body.setBoundsRectangle(Phaser.Geom.Rectangle.FromXY(740, 0, 1075, 1000));
        this.body.collideWorldBounds = true;

        this.scene = config.scene;
        this.armed = false;
        this.lock = false;
        this.canSlideBoost = true;
        this.slideCooldown = 3;
        this.jumpTimer = null;
        this.canSlide = true;
        this.hasSlid = false;
        this.isSliding = false;

        this.ground = false;

        // The state machine managing the hero
        this.stateMachine = new StateMachine.StateMachine('idle', {
            idle: new StateMachine.IdleState(),
            move: new StateMachine.MoveState(),
            crouch: new StateMachine.CrouchState(),
            jump: new StateMachine.JumpState(),
            doubleJump: new StateMachine.DoubleJumpState(),
            fall: new StateMachine.FallState(),
            slide: new StateMachine.SlideState()
        }, [this.scene, this]);

        this.keys = {
            jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            jump2: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            fire: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        };
    }

    update(time, delta) {
        this.ground = this.body.onFloor();
        this.stateMachine.step();
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
