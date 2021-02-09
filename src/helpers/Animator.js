export default class Animator {
    constructor(config) {
        this.sprite = config.sprite;
        this.type = config.type;
    }

    getAnimation(animation) {
        switch (animation) {
            case 'idle': {
                if(this.type === 'frog') {
                    return 'frog-idle_out';
                } else {
                    return 'idle'
                }
            }
            case 'walk': {
                if (this.type === 'frog') {
                    return 'frog-walk_out';
                } else {
                    return 'run';
                }
            }
            case 'run': {
                if (this.type === 'frog') {
                    return 'frog-walk_out';
                } else {
                    return 'run';
                }
            }
            case 'jump-up': {
                if (this.type === 'frog') {
                    return 'frog-jump_up_out';
                } else {
                    return 'jump-up';
                }
            }
            case 'jump-down': {
                if (this.type === 'frog') {
                    return 'frog-jump_down_out';
                } else {
                    return 'jump-down';
                }
            }
        }
    }

}