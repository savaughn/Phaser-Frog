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
            start: 8, end: 16
        })
    });

    scene.anims.create({
        key: 'crouch',
        frameRate: 15,
        frames: scene.anims.generateFrameNumbers('player-jump', {
            start: 15, end: 15
        })
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
        }),
        repeat: -1
    });

    scene.anims.create({
        key: 'slide',
        frameRate: 12,
        frames: scene.anims.generateFrameNumbers('player-slide', {
            start: 0, end: 0
        })
    });
}