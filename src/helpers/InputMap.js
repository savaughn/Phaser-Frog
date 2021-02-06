const controllerThreshold = 0.6;
let arrowAxis = 0;
let activeInputSource = '';

export default class InputMap {
    constructor(hero, scene, bindings = {
        gamepad: {
            jump: hero.gamepad?.buttons[0],
            crouch: hero.gamepad?.buttons[1],
            moveAxis: hero.gamepad?._HAxisLeft,
            moveLeft: hero.gamepad?.buttons[14],
            moveRight: hero.gamepad?.buttons[15],
        },
        keyboard: {
            jump: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            crouch: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            moveLeft: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            moveRight: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        }
    }) {
        this.hero = hero;
        this.scene = scene;
        this.keyboard = bindings.keyboard;
        this.gamepad = bindings.gamepad;

        // this.hero.gamepad.buttons[0] = A
        // this.hero.gamepad.buttons[1] = B
        // this.hero.gamepad.buttons[2] = X
        // this.hero.gamepad.buttons[3] = Y
        // this.hero.gamepad.buttons[4] = L1
        // this.hero.gamepad.buttons[5] = R1
        // this.hero.gamepad.buttons[6] = L2 (digital)
        // this.hero.gamepad.buttons[7] = R2 (digital)
        // this.hero.gamepad.buttons[8] = SELECT
        // this.hero.gamepad.buttons[9] = START
        // this.hero.gamepad.buttons[10] = L3
        // this.hero.gamepad.buttons[11] = R3
        // this.hero.gamepad.buttons[12] = UP
        // this.hero.gamepad.buttons[13] = DOWN
        // this.hero.gamepad.buttons[14] = LEFT
        // this.hero.gamepad.buttons[15] = RIGHT
        // this.hero.gamepad._FBRightBottom = R2
        // this.hero.gamepad._FBLeftBottom = L2
    }

    jump() {
        if (this.keyboard.jump.isDown || this.gamepad.jump?.pressed) {
            return true;
        }

        return false;
    }

    crouch() {
        if (this.keyboard.crouch.isDown || this.gamepad.crouch?.pressed) {
            return true;
        }

        return false;
    }

    /**
     * @todo sometimes doesn't change facing direction
     */
    moveLeft() {
        if (this.gamepad.moveAxis?.value < -1 * controllerThreshold) {
            activeInputSource = 'gamepad';
            this.hero.isFacingLeft = true;
            return true;
        }

        if (this.keyboard.moveLeft.isDown || this.gamepad?.moveLeft?.pressed) {
            activeInputSource = 'keyboard';
            arrowAxis = -1;
            this.hero.isFacingLeft = true;
            return true;
        }
        return false;
    }

    moveRight() {
        if (this.gamepad.moveAxis?.value > controllerThreshold) {
            activeInputSource = 'gamepad';
            this.hero.isFacingLeft = false;
            return true;
        }
        
        if (this.keyboard.moveRight.isDown ||  this.gamepad?.moveRight?.pressed) {
            activeInputSource = 'keyboard';
            arrowAxis = 1;
            this.hero.isFacingLeft = false;
            return true;
        }
        return false;
    }

    getMoveValue() {
        if (activeInputSource === 'gamepad') {
            return this.gamepad.moveAxis?.value;
        } else {
            return arrowAxis;
        }
    }
}