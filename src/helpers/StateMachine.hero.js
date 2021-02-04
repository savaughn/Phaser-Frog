import * as Logger from './log';

let inputAxis = 0;
let accel = 0.1;
const targetSpeed = 175;
const initialVelocity = 10;

export default class StateMachine {
    constructor(initialState, possibleStates, sprite) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
        this.state = null;
        this.hero = sprite;
        this.scene = sprite.scene;
        this.hero.canDoubleJump = false;
        this.hero.hasJumped = false;

        // State instances get access to the state machine via this.stateMachine.
        for (const state of Object.values(this.possibleStates)) {
            state.stateMachine = this;
        }

        // this.hero.on('animationcomplete', anim => {
        //     console.log(anim.key + ' complete');
        //     this.hero.emit('animation')
        // });
    }

    step() {
        // On the first step, the state is null and we need to initialize the first state.
        if (this.state === null) {
            this.state = this.initialState;
            console.log(this.initialState);
            this.possibleStates[this.state].enter(this.scene, this.hero);
        }

        if (accel !== 1 && this.hero.gamepad?.up) {
            accel = Phaser.Math.Clamp(accel + 0.01, 0.01, 1);
            console.log(accel);
        }

        if (accel !== 0.01 && this.hero.gamepad?.down) {
            accel = Phaser.Math.Clamp(accel - 0.01, 0.01, 1);
            console.log(accel);
        }

        // Run the current state's execute
        this.possibleStates[this.state].execute(this.scene, this.hero);
    }

    transition(newState, ...enterArgs) {
        Logger.log(newState);
        this.state = newState;
        this.possibleStates[this.state].enter(this.scene, this.hero, ...enterArgs);
    }
}

class State {
    enter() {

    }

    execute() {

    }
}

class IdleState extends State {
    /**
     * 
     * @param {*} scene 
     * @param {Phaser.GameObjects.Sprite} hero 
     */
    enter(scene, hero) {
        hero.canDoubleJump = false;
        hero.hasJumped = false;
        hero.body.setVelocity(0);
        if (!hero.anims.isPlaying) {
            hero.anims.play('idle');
        }
        hero.removeAllListeners();
        // Disable hoping action
        if (hero.input.jump()) {
            hero.canJump = false;
        } 
    }

    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     */
    execute(scene, hero) {
        // Read Jump button released
        if (!hero.canJump && !hero.input.jump()) {
            hero.canJump = true;
        }
        // Transition to crouch if pressing down
        if (hero.input.crouch()) {
            this.stateMachine.transition('crouch');
        }

        if (hero.canJump && hero.input.jump()) {
            this.stateMachine.transition('jump');
        }

        if (hero.input.moveLeft() || hero.input.moveRight()) {
            this.stateMachine.transition('move');
        }
    }
}

class CrouchState extends State {
    enter(scene, hero) {
        hero.anims.play('crouch');
        scene.time.delayedCall(100, () => {
            this.canStand = true;
        });
    }

    /**
     * 
     * @todo add time delay for crouch anim 
     */
    execute(scene, hero) {
        // Slow crouching sprite with velocity
        if (hero.body.velocity.x !== 0) {
            if (hero.body.velocity.x > 0.1 || hero.body.velocity.x < -0.1) {
                hero.body.setVelocityX(hero.body.velocity.x / 1.35);
            } else {
                hero.body.setVelocityX(0);
            }
        }

        if (!hero.input.crouch() && this.canStand) {
            hero.anims.stop();
            this.canStand = false;
            this.stateMachine.transition('idle');
        }
    }
}

class MoveState extends State {
    getSpriteVelocityWithAcceleration(hero) {
        if (hero.body.velocity.x < -174 || hero.body.velocity.x > 174) {
            return targetSpeed * (hero.isFacingLeft ? -1 : 1);
        } else {
            return hero.input.getMoveValue() * accel * targetSpeed + (1 - accel) * hero.body.velocity.x;
        }
    }

    getIsSpriteBlocked(sprite) {
        if (sprite.isFacingLeft) {
            return sprite.body.blocked.left;
        } else {
            return sprite.body.blocked.right;
        }
    }

    enter(scene, hero) {
        hero.body.setVelocityX(initialVelocity * (hero.isFacingLeft ? -1 : 1));
    }
    
    /**
     * @param {Phaser.GameObjects.Sprite} hero
     */
    execute(scene, hero) {
        let _velocity = this.getSpriteVelocityWithAcceleration(hero);
        let frameRate = Phaser.Math.Clamp(Math.abs(hero.body.velocity.x) / targetSpeed, 0.3, 1);

        if (hero.body.onFloor() && !hero.input.jump()) {
            hero.setFlipX(hero.isFacingLeft);
            hero.body.setVelocityX(_velocity);
            if(this.getIsSpriteBlocked(hero)) {
                hero.anims.play('idle', true);
            } else {
                hero.anims.timeScale = frameRate;
                hero.anims.play({ key: 'run', startFrame: 5}, true);
            }
        }

        if (hero.input.crouch() && hero.canSlide) {
            hero.anims.stop();
            hero.anims.timeScale = 1;
            this.stateMachine.transition('slide');
        }

        if (hero.input.jump()) {
            hero.anims.stop();
            hero.anims.timeScale = 1;
            this.stateMachine.transition('jump');
        }

        // Transition to idle if not pressing movement keys
        if (!hero.input.moveLeft() && !hero.input.moveRight()) {
            hero.anims.timeScale = 1;
            hero.anims.stop();
            this.stateMachine.transition('idle');
        }
    }
}

class SlideState extends State {
    constructor({
        inputAxisValue
    }) {
        super();
        this.currentAxis = inputAxisValue;
    }
    startCooldown(scene, hero) {
        hero.slideTimer = scene.time.addEvent({
            delay: 250,
            callback: () => {
                hero.canSlide = true;
            }
        });
    }
    enter(scene, hero) {
        hero.anims.stop();
        hero.anims.play('slide', false);
        hero.forceTimer = scene.time.addEvent({
            delay: 300,
            callback: () => {
                hero.forceSlide = false;
            }
        });
        this.currentAxis = inputAxis;
    }
    execute(scene, hero) {
        // slow moving sprite
        hero.body.setVelocityX(hero.body.velocity.x / 1.025);
        // if too slow and not force, then crouch
        if (((hero.body.velocity.x > 0 && hero.body.velocity.x < 80) ||
        (hero.body.velocity.x < 0 && hero.body.velocity.x > -80)) &&
        !hero.forceSlide) {
            hero.canSlide = false;
            this.startCooldown(scene, hero);
            hero.forceSlide = true;
            hero.anims.stop();
            this.stateMachine.transition('crouch');
        };

        if (!hero.input.crouch() && !hero.forceSlide) {
            hero.canSlide = false;
            this.startCooldown(scene, hero);
            hero.forceSlide = true;
            hero.anims.stop();
            this.stateMachine.transition('idle');
        }

        if (hero.body.velocity.x === 0 && !hero.forceSlide) {
            hero.forceSlide = true;
            hero.anims.stop();
            this.stateMachine.transition('crouch');
        }
    }
}

class JumpState extends State {
    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     * @todo charge jump - check time button down. tap for short jump.
     * @todo crouch in jump
     */

    enter(scene, hero) {
        if (hero.body.onFloor()) {
            hero.canDoubleJump = false;
            hero.hasJumped = true;
            hero.anims.stop();
            hero.body.setVelocityY(hero.jumpVelocity * hero.jumpForce);
            hero.anims.play('jump-up', true);
        }
    }

    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     */
    execute(scene, hero) {
        if (hero.body.onFloor()) {
            if (hero.input.crouch() && hero.body.velocity.x !== 0) {
                this.stateMachine.transition('slide');
            } else if (!hero.hasJumped && !hero.canDoubleJump) {
                hero.landing = 'hard';
                this.stateMachine.transition('land');
            } else {
                this.stateMachine.transition('land');
            }    
        }

        if (!hero.input.jump() && hero.hasJumped && !hero.canDoubleJump) {
            hero.canDoubleJump = true;
        } else if (hero.input.jump() && hero.canDoubleJump) {
            this.stateMachine.transition('doubleJump');
        }

        if (hero.body.velocity.y > 0) {
            hero.landing = 'soft';
            hero.anims.play('jump-down');
        }

        if (hero.input.moveLeft()) {
            hero.setFlipX(true);
            hero.body.setVelocityX(175 * hero.input.getMoveValue());
        }
        if (hero.input.moveRight()) {
            hero.setFlipX(false);
            hero.body.setVelocityX(175 * hero.input.getMoveValue());
        }
    }
}

class DoubleJumpState extends State {
    enter(scene, hero) {
        hero.canDoubleJump = false;
        hero.hasJumped = false;
        hero.body.setVelocityY(hero.jumpVelocity * 1.1);
        hero.anims.play('roll');
    }

    execute(scene, hero) {
        hero.landing = 'hard';
        this.stateMachine.transition('jump');
    }
}

class LandingState extends State {
    /**
     * 
     * @param {*} scene 
     * @param {Phaser.GameObjects.Sprite} hero 
     */
    enter(scene, hero) {
        hero.once('animationcomplete-hard-land', anim => {
            // hero.removeAllListeners('animationcomplete-hard-land');
            this.stateMachine.transition('idle');
        });
    }
    execute(scene, hero) {
        if (hero.landing === 'soft') {
            this.stateMachine.transition('crouch');
        } else {
            hero.body.setVelocityX(0);
            hero.anims.play('hard-land', true);
        }
    }
}

export {
    CrouchState, IdleState, MoveState, JumpState, DoubleJumpState, SlideState, LandingState
};
