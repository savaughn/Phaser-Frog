class StateMachine {
    constructor(initialState, possibleStates, stateArgs = []) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
        this.stateArgs = stateArgs;
        this.state = null;
        this.stateArgs[1].canDoubleJump = false;
        this.stateArgs[1].hasJumped = false;
  
        // State instances get access to the state machine via this.stateMachine.
        for (const state of Object.values(this.possibleStates)) {
            state.stateMachine = this;
        }

        // stateArgs[1].anims.animationManager.anims.keys().forEach(element => {
        //     this.AnimationNames[element] = element;
        // });

        // console.log(this.AnimationNames);
    }
  
    step() {
        // On the first step, the state is null and we need to initialize the first state.
        if (this.state === null) {
            this.state = this.initialState;
            this.possibleStates[this.state].enter(...this.stateArgs);
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
    
        // Transition to crouch if pressing down
        if (down.isDown) {
            this.stateMachine.transition('crouch');
        }
      
        // Transition to jump if pressing jump
        if (jump.isDown) {
            this.stateMachine.transition('jump');
        }
      
        // Transition to move if pressing a movement key
        if (left.isDown || right.isDown) {
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
    execute(scene, hero) {
        const {
            left, right, down
        } = hero.keys;

        const move = direction => {
            hero.body.setVelocityX(direction * 175);
            hero.setFlipX(direction === -1);
            hero.anims.play('run', true);
        };

        if (down.isDown) {
            this.stateMachine.transition('slide');
        }
      
        // Transition to idle if not pressing movement keys
        if (!(left.isDown || right.isDown)) {
            this.stateMachine.transition('idle');
        }

        if (left.isDown) {
            move(-1);
        } else if (right.isDown) {
            move(1);
        }
    }
}

class SlideState extends State {
    enter(scene, hero) {
        hero.anims.play('slide');
        console.log(hero.body.velocity.x);
    }
    execute(scene, hero) {
        // if (this.canSlideBoost) { this.body.setVelocityX(this.body.velocity.x * 1.5); }
        hero.body.setVelocityX(hero.body.velocity.x / 1.025);
        if ((hero.body.velocity.x > 0 && hero.body.velocity.x < 80) || (hero.body.velocity.x < 0 && hero.body.velocity.x > -80)) {
            // hero.body.setVelocityX(0);
            this.stateMachine.transition('crouch');
        };

        if (!hero.keys.down.isDown) {
            this.stateMachine.transition('idle');
        }
        // this.canSlideBoost = false;
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
        hero.anims.play('crouch', false);
        // scene.
    }

    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Phaser.GameObjects.Sprite} hero 
     */
    execute(scene, hero) {
        if (!hero.keys.down.isDown) {
            this.stateMachine.transition('idle');
        }
        // if (hero.body.)
    }
}
  
class JumpState extends State {
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Phaser.GameObjects.Sprite} hero 
     */

    enter(scene, hero) {
        hero.body.setVelocityY(-350);
        hero.anims.play('jump-up', true);
    }

    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Phaser.GameObjects.Sprite} hero 
     */
    execute(scene, hero) {
        if (!hero.ground && !hero.keys.jump.isDown && hero.hasJumped) {
            hero.canDoubleJump = true;
        } else if (hero.keys.jump.isDown && hero.canDoubleJump) {
            console.log('dbl jump');
            this.stateMachine.transition('doubleJump');
        }
        
        if (hero.body.velocity.y > 0) {
            this.stateMachine.transition('fall');
        }
        hero.hasJumped = true;
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
        hero.body.setVelocityY(-350);
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
        hero.on('animationcomplete', (anim, frame) => {
            hero.emit(`animationcomplete_${anim.key}`);
        }, hero);
        hero.on('animationcomplete_roll', () => {
            this.stateMachine.transition('fall');
        });
    }
}

class FallState extends State {
    enter(scene, hero) {
        hero.anims.play('jump-down', true);
    }
    execute(scene, hero) {
        if (hero.canDoubleJump && hero.keys.jump.isDown) {
            this.stateMachine.transition('doubleJump');
        }
        if (hero.ground && hero.body.velocity.y === 0) {
            hero.on('animationcomplete', (anim, frame) => {
                hero.emit(`animationcomplete_${anim.key}`);
            }, hero);
            hero.on('animationcomplete_jump-down', () => {
                this.stateMachine.transition('idle');
            });
        }
    }
}

export {
    StateMachine, CrouchState, IdleState, MoveState, JumpState, DoubleJumpState, FallState, SlideState
};
