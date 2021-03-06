export default class Animator {
    constructor(config) {
        this.sprite = config.sprite;
        this.type = config.type;
        this.animations = {
            idle: 'idle',
            walk: 'walk',
            run: 'run',
            jumpUp: 'jump-up',
            jumpDown: 'jump-down',
            crouch: 'crouch',
            roll: 'roll',
            hardLand: 'hard-land',
            softLand: 'soft-land',
            slide: 'slide'
        };
    }

    errorHandle(anim) {
        let anims = Object.values(this.animations);
        let results = anims.filter(item => {
            return item.match(`(${ anim })`);
        });
        console.error(`Invalid animation name: '${anim}'\nDid you mean:${ results.map(item => ` ${ item}`)}?`);
    }

    getAnimation(animation) {
        switch (animation) {
            case this.animations.idle: {
                if(this.type === 'frog') {
                    return 'frog-idle';
                } else {
                    return 'idle'
                }
            }
            case 'walk': {
                if (this.type === 'frog') {
                    return 'frog-run';
                } else {
                    return 'run';
                }
            }
            case 'run': {
                if (this.type === 'frog') {
                    return 'frog-run';
                } else {
                    return 'run';
                }
            }
            case 'jump-up': {
                if (this.type === 'frog') {
                    return 'frog-jump_up';
                } else {
                    return 'jump-up';
                }
            }
            case 'jump-down': {
                if (this.type === 'frog') {
                    return 'frog-jump_down';
                } else {
                    return 'jump-down';
                }
            }
            case 'crouch': {
                if (this.type === 'frog') {
                    return 'frog-crouch';
                } else {
                    return 'crouch';
                }
            }
            case 'roll': {
                if (this.type === 'frog') {
                    return 'frog-jump_up';
                } else {
                    return 'roll';
                }
            }
            case 'hard-land': {
                if (this.type === 'frog') {
                    return 'frog-crouch';
                } else {
                    return 'hard-land';
                }
            }
            case 'slide': {
                if (this.type === 'frog') {
                    return 'frog-crouch';
                } else {
                    return 'slide';
                }
            }
            default: {
                this.errorHandle(animation);
                // console.error(`missing animation: ${ animation }`);
                if(this.type === 'frog') {
                    return 'frog-idle';
                } else {
                    return 'idle'
                }
            }
        }
    }

}