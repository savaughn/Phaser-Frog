
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
        this.jumpForce = 1;
        this.canJump = false;
        this.canDoubleJump = false;
        this.hasDoubleJumped = false;
        this.hasJumped = false;

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
        if (this.body.onFloor()) {
            // Landing from jump
            if (this.anims.currentAnim.key === 'jump-down') {
                this.handleLanding();
                // on ground
            } else if (!this.lock && this.keys.left.isDown && this.body.onFloor()) {
                this.move('left');
            } else if (!this.lock && this.keys.right.isDown & this.body.onFloor()) {
                this.move('right');
            } else if (this.keys.down.isDown) {
                this.anims.play('jump-down-light', false);
                if (this.body.velocity.x !== 0) {
                    this.slide();
                }
            } else if (!this.lock) {
                // Slow down player
                if (this.body.velocity.x > 0.1 || this.body.velocity.x < -0.1) {
                    this.body.setVelocityX(this.body.velocity.x / 2);
                } else {
                    this.body.setVelocityX(0);
                }
                this.anims.play('idle', true);
            }
            if (!this.keys.jump.isDown) {
                this.canJump = true;
            }
        } else {
            // if (!this.keys.jump.isDown && this.jumpLock) { this.canDoubleJump = true; }
            if (this.keys.left.isDown) { this.move('left', 0.5, false); }
            if (this.keys.right.isDown) { this.move('right', 0.5, false); }
            if (this.keys.jump.isDown && this.canDoubleJump && this.hasJumped) { this.doubleJump(); }
        }
        // standard jump
        if (this.canJump && this.keys.jump.isDown && this.body.onFloor()) {
            this.jump();
        }

        // Jump key let go
        if (!this.keys.jump.isDown && !this.body.onFloor() && !this.canJump) {
            this.hasJumped = true;
        }
            
        if (this.body.velocity.y > 0) {
            this.anims.play('jump-down', true);
            this.lock = true;
        }
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
            if (!this.hasDoubleJumped) { this.anims.play('jump-down-light', true); }
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

    moveLeft(scale = 1, animate = true) {
        this.body.setVelocityX(-175 * scale);
        this.setFlipX(true);
        this.anims.play('run', true);
    }

    moveRight(scale = 1, animate = true) {
        this.body.setVelocityX(175 * scale);
        this.setFlipX(false);
        this.anims.play('run', true);
    }

    slide() {
        this.body.setVelocityX(this.body.velocity.x / 1.025);
        this.anims.play('slide', true);
        if ((this.body.velocity.x > 0 && this.body.velocity.x < 80) || (this.body.velocity.x < 0 && this.body.velocity.x > -80)) {
            this.body.setVelocityX(0);
        };
    }
}
