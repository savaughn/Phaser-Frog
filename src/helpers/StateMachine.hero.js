import Animator from './Animator';
import * as Logger from './log';

let inputAxis = 0;
let accel = 0.15;
const targetSpeed = 175;
const initialVelocity = 10;
const minJumpV = 100;

export default class StateMachine {
    constructor(initialState, possibleStates, sprite, type) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
        this.state = null;
        this.hero = sprite;
        this.scene = sprite.scene;
        this.hero.canDoubleJump = false;
        this.hero.hasJumped = false;
        this.type = type;

        this.animator = new Animator({ sprite: this.hero, type: this.type });

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

        if (this.hero.gamepad?.buttons[4].pressed) {
            console.log(this.hero.body.velocity);
        }

        if (this.hero.gamepad?.buttons[5].pressed) {
            console.log(this.hero.body.position);
        }

        this.hero.currentState = this.state;

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
    getAnimation(anim) {
        return this.stateMachine.animator.getAnimation(anim);
    }

    transitionState(state) {
        this.stateMachine.transition(state);
    }

    setSpriteGravity(sprite, value) {
        if(sprite.body.gravity.y !== value) {
            sprite.body.setGravityY(value);
        }
    }

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
            hero.anims.play(this.getAnimation('idle'), true);
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
            this.transitionState('crouch');
        }

        if (hero.canJump && hero.input.jump()) {
            this.transitionState('jump');
        }

        if (hero.input.moveLeft() || hero.input.moveRight()) {
            this.transitionState('move');
        }
    }
}

class CrouchState extends State {
    enter(scene, hero) {
        hero.canStand = false;
        hero.anims.play(this.getAnimation('crouch'));
        scene.time.delayedCall(100, () => {
            hero.canStand = true;
        });
    }
    
    execute(scene, hero) {
        // Slow crouching sprite with velocity
        if (hero.body.velocity.x !== 0) {
            if (hero.body.velocity.x > 0.1 || hero.body.velocity.x < -0.1) {
                hero.body.setVelocityX(hero.body.velocity.x / 10);
            } else {
                hero.body.setVelocityX(0);
            }
        }

        if (!hero.input.crouch() && hero.canStand) {
            hero.anims.stop();
            hero.canStand = false;
            this.transitionState('idle');
        }

        if (!hero.body.onFloor()) {
            this.transitionState('jump');
        }
    }
}

class MoveState extends State {
    transitionSpriteFromMoving(sprite, state) {
        sprite.anims.stop();
        sprite.anims.timeScale = 1;
        this.transitionState(state.toString());
    }

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
        if (hero.body.velocity.x === 0) {
            hero.body.setVelocityX(initialVelocity * (hero.isFacingLeft ? -1 : 1));
        }
    }
    
    /**
     * @param {Phaser.GameObjects.Sprite} hero
     */
    execute(scene, hero) {
        let _velocity = this.getSpriteVelocityWithAcceleration(hero);
        let frameRate = Phaser.Math.Clamp(Math.abs(hero.body.velocity.x) / targetSpeed, 0.3, 1);

        if (hero.body.onFloor()) {
            hero.setFlipX(hero.isFacingLeft);
            hero.body.setVelocityX(_velocity);
            if(this.getIsSpriteBlocked(hero)) {
                hero.anims.play(this.getAnimation('idle'), true);
            } else {
                hero.anims.timeScale = frameRate;
                // hero.anims.play({ key: 'run', startFrame: 5}, true);
                hero.anims.play(this.getAnimation('run'), true);
            }
        }

        // Execute slide
        if (hero.input.crouch() && hero.canSlide) {
            this.transitionSpriteFromMoving(hero, 'slide');
        }

        // Transition to idle if not pressing movement keys
        if (!hero.input.moveLeft() && !hero.input.moveRight()) {
            this.transitionSpriteFromMoving(hero, 'idle');
        }

        if (!hero.canJump && !hero.input.jump()) {
            hero.canJump = true;
        }

        // Jump while moving
        if ((hero.input.jump() && hero.canJump) || !hero.body.onFloor()) {
            if ((hero.body.velocity.x < minJumpV && hero.body.velocity.x > -minJumpV) && hero.body.velocity.x !== 0) {
                hero.body.setVelocityX(minJumpV * (hero.isFacingLeft ? -1 : 1));
            }
            this.transitionSpriteFromMoving(hero, 'jump')
        }
    }
}

class SlideState extends State {
    transitionSpriteFromSliding(sprite, targetState){
        sprite.forceSlide = true;
        sprite.anims.stop();
        this.transitionState(targetState);
    }

    enter(scene, hero) {
        hero.forceSlide = true;
        hero.anims.stop();
        hero.anims.play(this.getAnimation('slide'));
        hero.forceTimer = scene.time.addEvent({
            delay: 300,
            callback: () => {
                hero.forceSlide = false;
            }
        });
    }
    execute(scene, hero) {
        // slow moving sprite
        hero.body.setVelocityX(hero.body.velocity.x / 1.025);
        // if too slow and not force, then crouch
        if (((hero.body.velocity.x > 0 && hero.body.velocity.x < 80) ||
        (hero.body.velocity.x < 0 && hero.body.velocity.x > -80)) &&
        !hero.forceSlide) {
            this.transitionSpriteFromSliding(hero, 'crouch');
        };

        if (!hero.input.crouch() && !hero.forceSlide) {
            this.transitionSpriteFromSliding(hero, 'idle');
        }

        if (hero.body.velocity.x === 0 && !hero.forceSlide) {
            this.transitionSpriteFromSliding(hero, 'crouch');
        }

        if (!hero.body.onFloor() || hero.input.jump()) {
            this.transitionSpriteFromSliding(hero, 'jump');
        }
    }
}

class JumpState extends State {
    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     * @todo crouch in jump
     */

    enter(scene, hero) {
        if (hero.body.onFloor() && hero.canJump) {
            hero.canDoubleJump = false;
            hero.hasJumped = true;
            hero.anims.stop();
            hero.body.setVelocityY(hero.jumpVelocity * hero.jumpForce);
            hero.anims.play(this.getAnimation('jump-up'), true);
            hero.canJump = false;
        }
    }

    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     */
    execute(scene, hero) {
        const impulse = 0.8;
        const airConThreshold = 50;
        const addAirV = 100;
        // On the ground
        if (hero.body.onFloor()) {
            this.setSpriteGravity(hero, 0);
            if (hero.body.velocity.x !== 0 && hero.input.crouch()) {
                this.transitionState('slide');
            } else if (hero.input.moveLeft() || hero.input.moveRight()) {
                this.transitionState('move');
            } else if (!hero.hasJumped && !hero.canDoubleJump) {
                hero.landing = 'hard';
                this.transitionState('land');
            } else {
                this.transitionState('land');
            }
        } else {
            // In the air
            // Set double jump / end jump arc
            if (hero.hasJumped && !hero.canDoubleJump && !hero.input.jump()) {
                hero.body.setVelocityY(hero.body.velocity.y * 0.5);
                hero.canDoubleJump = true;
                hero.canJump = true;
            // Execute Double Jump 
            } else if (hero.canDoubleJump && hero.input.jump()) {
                this.setSpriteGravity(hero, 0);
                this.transitionState('doubleJump');
            }

            // Sprite is falling
            if (hero.body.velocity.y > 0) {
                hero.landing = 'soft';
                //          regular jump                                double jump
                if (hero.anims.currentAnim?.key === this.getAnimation('jump-up') || hero.anims.currentAnim?.key === 'roll') {
                    this.setSpriteGravity(hero, 750);
                }

                if (hero.anims.currentAnim?.key === this.getAnimation('idle') || hero.anims.currentAnim?.key === this.getAnimation('run') || hero.anims.currentAnim?.key === 'slide') {
                    hero.anims.stop();
                    hero.canDoubleJump = true;
                }

                hero.anims.play(this.getAnimation('jump-down'));
            }

            if (hero.input.moveLeft() && hero.input.moveRight()) {
                // do nothing
            } else if (hero.input.moveLeft() && hero.body.velocity.x >= 0) {
                hero.setFlipX(true);
                this.setSpriteGravity(hero, 0);
                let _velocity = (hero.body.velocity.x !== 0 ? hero.body.velocity.x : addAirV) * -impulse;
                hero.body.setVelocityX(_velocity);
            } else if (hero.input.moveRight() && hero.body.velocity.x <= 0) {
                hero.setFlipX(false);
                this.setSpriteGravity(hero, 0);
                let _velocity = (hero.body.velocity.x !== 0 ? hero.body.velocity.x : -addAirV) * -impulse;
                hero.body.setVelocityX(_velocity);
            }
        }
    }
}

class DoubleJumpState extends State {
    enter(scene, hero) {
        hero.canDoubleJump = false;
        hero.hasJumped = false;
        hero.canJump = false;
        hero.body.setVelocityY(hero.jumpVelocity * 1.1);
        hero.anims.play(this.getAnimation('roll'));
        hero.once(`animationcomplete-${ this.getAnimation('roll') }`, () => {
            this.transitionState('jump');
        });
    }

    execute(scene, hero) {
        if (hero.input.moveLeft() && hero.body.velocity.x >= 0) {
            hero.setFlipX(true);
            this.setSpriteGravity(hero, 0);
            let _velocity = (hero.body.velocity.x !== 0 ? hero.body.velocity.x : 100) * -0.8;
            hero.body.setVelocityX(_velocity);
        } else if (hero.input.moveRight() && hero.body.velocity.x <= 0) {
            hero.setFlipX(false);
            this.setSpriteGravity(hero, 0);
            let _velocity = (hero.body.velocity.x !== 0 ? hero.body.velocity.x : -100) * -0.8;
            hero.body.setVelocityX(_velocity);
        }
        if (!hero.input.jump()) {
            if(hero.body.gravity.y !== 0) {
                hero.body.setGravityY(0);
            }
            hero.body.setVelocityY(hero.body.velocity.y * 0.8);
            if (hero.body.velocity.y >= 0) {
                hero.landing = 'hard';
                this.transitionState('jump');
            }
        }
    }
}

class LandingState extends State {
    /**
     * 
     * @param {*} scene 
     * @param {Phaser.GameObjects.Sprite} hero 
     */
    enter(scene, hero) {
        hero.once(`animationcomplete-${ this.getAnimation('hard-land') }`, anim => {
            this.transitionState('idle');
        });
    }

    execute(scene, hero) {
        // override landing animation on player input
        if (hero.input.moveLeft() || hero.input.moveRight()) {
            hero.anims.stop();
            this.transitionState('move');
        } else if (hero.input.jump() && hero.canJump) {
            hero.anims.stop();
            this.transitionState('jump');
        } else {
            if (hero.landing === 'soft') {
                this.transitionState('crouch');
            } else {
                hero.body.setVelocityX(0);
                hero.anims.play(this.getAnimation('hard-land'), true);
            }
        }
    }
}

class CrawlState extends State {
    enter() {}
    execute() {}
}

export {
    CrouchState, IdleState, MoveState, JumpState, DoubleJumpState, SlideState, LandingState, CrawlState
};
