/**
 * 
 * @param {Phaser.Scene} scene 
 */

export default function makeAnimations(scene) {
    scene.anims.create({
        key: 'jump-up',
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers('player-jump', {
            start: 0, end: 7
        })
    });

    scene.anims.create({
        key: 'jump-down',
        frameRate: 11,
        frames: scene.anims.generateFrameNumbers('player-jump', {
            start: 8, end: 12
        })
    });

    scene.anims.create({
        key: 'hard-land',
        frameRate: 11,
        frames: scene.anims.generateFrameNumbers('player-jump', {
            start: 13, end: 16
        })
    });

    scene.anims.create({
        key: 'crouch',
        frameRate: 1,
        frames: scene.anims.generateFrameNumbers('player-jump', {
            start: 15, end: 15
        }),
        repeat: 0
    });

    scene.anims.create({
        key: 'idle',
        frameRate: 5,
        frames: scene.anims.generateFrameNumbers('player-idle', {
            start: 4, end: 7
        }),
        repeat: -1
    });

    scene.anims.create({
        key: 'idle-armed',
        frameRate: 5,
        frames: scene.anims.generateFrameNumbers('player-idle', {
            start: 0, end: 3
        }),
        repeat: -1
    });

    scene.anims.create({
        key: 'run',
        frameRate: 12,
        frames: scene.anims.generateFrameNumbers('player-run', {
            start: 0, end: 7
        }),
        repeat: -1
    });

    scene.anims.create({
        key: 'roll',
        frameRate: 12,
        frames: scene.anims.generateFrameNumbers('player-roll', {
            start: 0, end: 5
        })
    });

    scene.anims.create({
        key: 'slide',
        frameRate: 12,
        frames: scene.anims.generateFrameNumbers('player-slide', {
            start: 0, end: 0
        })
    });

    scene.anims.create({
        key: 'frog-idle',
        frameRate: 5,
        frames: scene.anims.generateFrameNumbers('frog-idle', {
            start: 0, end: 3
        }),
        repeat: -1
    });

    scene.anims.create({
        key: 'frog-run',
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers('frog-run', {
            start: 0, end: 3
        }),
        repeat: -1
    });

    scene.anims.create({
        key: 'frog-jump_up',
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers('frog-jump', {
            start: 0, end: 0
        })
    });

    scene.anims.create({
        key: 'frog-jump_down',
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers('frog-jump', {
            start: 1, end: 1
        })
    });

    scene.anims.create({
        key: 'frog-jump',
        frameRate: 2,
        frames: scene.anims.generateFrameNumbers('frog-jump', {
            start: 0, end: 1
        })
    });

    scene.anims.create({
        key: 'frog-crouch',
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers('frog-crouch', {
            start: 0, end: 0
        })
    });

    scene.anims.create({
        key: 'frog-look',
        frameRate: 5,
        frames: scene.anims.generateFrameNumbers('frog-look', {
            start: 0, end: 3
        })
    });

    scene.anims.create({
        key: 'frog-blink',
        frameRate: 15,
        frames: scene.anims.generateFrameNumbers('frog-look', {
            start: 4, end: 8
        })
    });

    scene.anims.create({
        key: 'frog-land-dust',
        frameRate: 20,
        frames: scene.anims.generateFrameNumbers('frog-land-dust', {
            start: 0, end: 3
        })
    });
}
