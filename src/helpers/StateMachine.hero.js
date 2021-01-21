let inputAxis = 0;
let isFacingLeft = false;
const controllerThreshold = 0.8;
let timeout = 1000;

class StateMachine {
    constructor(initialState, possibleStates, stateArgs = []) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
        this.stateArgs = stateArgs;
        this.state = null;
        this.hero = this.stateArgs[1];
        this.stateArgs[1].canDoubleJump = false;
        this.stateArgs[1].hasJumped = false;
        isFacingLeft = this.stateArgs[1].isFacingLeft;

        // State instances get access to the state machine via this.stateMachine.
        for (const state of Object.values(this.possibleStates)) {
            state.stateMachine = this;
        }

        // stateArgs[1].anims.animationManager.anims.keys().forEach(element => {
        //     this.AnimationNames[element] = element;
        // });

        // console.log(this.AnimationNames);

        this.stateArgs[1].on('animationcomplete', anim => {
            // console.log(anim.key);
            this.stateArgs[1].emit('animationcomplete_' + anim.key);
        });
    }

    step() {
        // On the first step, the state is null and we need to initialize the first state.
        if (this.state === null) {
            this.state = this.initialState;
            this.possibleStates[this.state].enter(...this.stateArgs);
        }

        // Get right stick value
        inputAxis = this.stateArgs[1].leftAxis.value;
        if (inputAxis < -1 * controllerThreshold) { isFacingLeft = true; }
        if (inputAxis > controllerThreshold) { isFacingLeft = false; }

        if (this.hero.gamepad.L2) {
            timeout -= 100;
            console.log(timeout);
        }
        if (this.hero.gamepad.R2) {
            timeout += 100;
            console.log(timeout);
        }

        // Run the current state's execute
        this.possibleStates[this.state].execute(...this.stateArgs);
    }

    transition(newState, ...enterArgs) {
        this.state = newState;
        this.possibleStates[this.state].enter(...this.stateArgs, ...enterArgs);
    }
}

class State {
    enter() {

    }

    execute() {

    }
}

class IdleState extends State {
    enter(scene, hero) {
        hero.canDoubleJump = false;
        hero.hasJumped = false;
        hero.body.setVelocity(0);
        hero.anims.play('idle', true);
    }

    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     */
    execute(scene, hero) {
        const {
            left, right, jump, down
        } = hero.keys;

        // console.log(this.inputAxis);

        // Transition to crouch if pressing down
        if (hero.gamepad.B) {
            this.stateMachine.transition('crouch');
        }

        // Transition to jump if pressing jump
        if (hero.gamepad.A) {
            this.stateMachine.transition('jump');
        }

        // Transition to move if pressing a movement key
        if (inputAxis < -1 * controllerThreshold) {
            this.stateMachine.transition('move');
        }

        if (inputAxis > controllerThreshold) {
            this.stateMachine.transition('move');
        }
    }
}

class MoveState extends State {
    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     */
    enter(scene, hero) {
        let dir = isFacingLeft ? -1 : 1;
        hero.body.setVelocityX(dir * 175);
        hero.setFlipX(isFacingLeft);
        hero.anims.play('run');
    }

    execute(scene, hero) {
        if (hero.gamepad.B && hero.canSlide) {
            this.stateMachine.transition('slide');
        }

        // Transition to idle if not pressing movement keys
        if (inputAxis > -1 * controllerThreshold && inputAxis < controllerThreshold) {
            this.stateMachine.transition('idle');
        }

        if (hero.gamepad.A) {
            this.stateMachine.transition('jump');
        }
    }
}

class SlideState extends State {
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
            delay: 900,
            callback: () => {
                hero.forceSlide = false;
            }
        });
    }
    execute(scene, hero) {
        hero.body.setVelocityX(hero.body.velocity.x / 1.025);
        if ((hero.body.velocity.x > 0 && hero.body.velocity.x < 80) ||
        (hero.body.velocity.x < 0 && hero.body.velocity.x > -80 &&
        !hero.forceSlide)) {
            hero.canSlide = false;
            this.startCooldown(scene, hero);
            hero.forceSlide = true;
            this.stateMachine.transition('crouch');
        };

        if (!hero.gamepad.B && !hero.forceSlide) {
            hero.canSlide = false;
            this.startCooldown(scene, hero);
            if (!hero.forceSlide) {
                hero.forceSlide = true;
                this.stateMachine.transition('idle');
            }
        }

        if (hero.body.velocity.x === 0 && !hero.forceSlide) {
            hero.forceSlide = true;
            this.stateMachine.transition('crouch');
        }
    }
}

class CrouchState extends State {
    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     */
    enter(scene, hero) {
        hero.body.setVelocity(0);
        hero.anims.play('crouch');
    }

    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     */
    execute(scene, hero) {
        if (!hero.gamepad.B) {
            this.stateMachine.transition('idle');
        }
    }
}

class JumpState extends State {
    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     * @todo charge jump - check time button down. tap for short jump.
     */

    enter(scene, hero) {
        if (hero.ground) {
            hero.canDoubleJump = false;
            hero.hasJumped = true;
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
        if (!hero.gamepad.A && hero.hasJumped && !hero.canDoubleJump) {
            hero.canDoubleJump = true;
        } else if (hero.gamepad.A && hero.canDoubleJump) {
            this.stateMachine.transition('doubleJump');
        }

        if (hero.body.velocity.y > 0) {
            hero.landing = 'soft';
            hero.anims.play('jump-down');
        }

        if (inputAxis < -1 * controllerThreshold) {
            hero.setFlipX(true);
            hero.body.setVelocityX(-175);
        }
        if (inputAxis > controllerThreshold) {
            hero.setFlipX(false);
            hero.body.setVelocityX(175);
        }

        // Landing no running
        if (hero.ground) {
            // A little slide on landing
            if (hero.body.velocity.x !== 0) {
                if (hero.body.velocity.x > 0.1 || hero.body.velocity.x < -0.1) {
                    hero.body.setVelocityX(hero.body.velocity.x / 1.35);
                }
            }

            if (hero.landing === 'hard') {
                hero.on('animationcomplete', anim => {
                    if (anim.key === 'jump-down') { this.stateMachine.transition('idle'); }
                });
            } else {
                hero.anims.play('crouch', true);
                hero.on('animationcomplete', anim => {
                    if (anim.key === 'crouch') { this.stateMachine.transition('idle'); }
                });
            }
        }
    }
}

class DoubleJumpState extends State {
    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     */
    enter(scene, hero) {
        hero.canDoubleJump = false;
        hero.hasJumped = false;
        hero.body.setVelocityY(hero.jumpVelocity * 1.1);
        hero.anims.play({
            key: 'roll', repeat: 0
        });
    }

    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Sprite} hero
     */
    execute(scene, hero) {
        hero.landing = 'hard';
        hero.once('animationcomplete_roll', anim => {
            this.stateMachine.transition('jump');
        });
    }
}

export {
    StateMachine, CrouchState, IdleState, MoveState, JumpState, DoubleJumpState, SlideState
};
