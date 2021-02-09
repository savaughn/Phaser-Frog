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
        key: 'frog-idle_out',
        frameRate: 5,
        frames: scene.anims.generateFrameNumbers('frog-idle_out', {
            start: 0, end: 3
        }),
        repeat: -1
    });

    scene.anims.create({
        key: 'frog-walk_out',
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers('frog-walk_out', {
            start: 0, end: 3
        }),
        repeat: -1
    });

    scene.anims.create({
        key: 'frog-jump_up_out',
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers('frog-jump_out', {
            start: 0, end: 0
        }),
    });

    scene.anims.create({
        key: 'frog-jump_down_out',
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers('frog-jump_out', {
            start: 1, end: 1
        }),
    });

    scene.anims.create({
        key: 'frog-jump',
        frameRate: 2,
        frames: scene.anims.generateFrameNumbers('frog-jump_out', {
            start: 0, end: 1
        }),
    });
}