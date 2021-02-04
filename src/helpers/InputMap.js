const controllerThreshold = 0.6;
let arrowAxis = 0;

export default class InputMap {
    constructor(hero, scene) {
        this.hero = hero;
        this.scene = scene;
    }

    jump() {
        if (this.hero.keys.jump.isDown) {
            return true;
        }

        if (this.hero.gamepad?.A) {
            return true;
        }

        return false;
    }

    crouch() {
        if (this.hero.keys.down.isDown) {
            return true;
        }
        
        if (this.hero.gamepad?.B) {
            return true;
        }

        return false;
    }

    moveLeft() {
        if (this.hero.leftAxis?.value < -1 * controllerThreshold) {
            return true;
        }

        if (this.hero.keys.left.isDown) {
            arrowAxis = -1;
            return true;
        }
        return false;
    }

    moveRight() {
        if (this.hero.leftAxis?.value > controllerThreshold) {
            return true;
        }
        
        if (this.hero.keys.right.isDown) {
            arrowAxis = 1;
            return true;
        }
        return false;
    }

    getLeftAxis() {
        return this.hero.leftAxis?.value || arrowAxis;
    }

}