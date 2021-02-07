import 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import UiScene from './scenes/UiScene';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.WEBGL,
    pixelArt: true,
    roundPixels: true,
    parent: 'content',
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        gamepad: true
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 800
            },
            debug: false
        }
    },
    plugins: {
        scene: [{
                key: 'rexUI',
                plugin: RexUIPlugin,
                mapping: 'rexUI'
            } 
        ],
      },
    scene: [
        BootScene,
        GameScene,
        UiScene
    ]
};

export const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars
