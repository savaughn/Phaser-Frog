import makeAnimations from '../helpers/animations';
import Hero from '../sprites/Hero';

/**
 * @this {Phaser.Scene}
 */

class BootScene extends Phaser.Scene {
    constructor(config) {
        super({
            key: 'BootScene'
        });
        this.hero = null;
        this.animations = ['run', 'idle', 'idle'];
        this.index = 0;
    }
    preload() {
        // const progress = this.add.graphics();

        // // Register a load progress event to show a load bar
        // this.load.on('progress', (value) => {
        //     progress.clear();
        //     progress.fillStyle(0xffffff, 1);
        //     progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
        // });

        // Register a load complete event to launch the title screen when all files are loaded
        this.load.on('complete', () => {
            this.add.text(this.sys.game.config.width *0.1, 
                this.sys.game.config.height / 2, 
                'Press any key or button on gamepad', 
                { fontSize: 64, fill: '#FFFFFF' }
            );
            makeAnimations(this);
            // progress.destroy();
            this.input.gamepad.once('connected', () => {
                this.scene.start('GameScene');
            });
            this.input.keyboard.on('keydown', (event) => {
                this.scene.start('GameScene');
            });
        });

        this.load.image('tiles', 'assets/Multi_Platformer_Tileset_v2/GrassLand/Terrain/Grassland_Terrain_Tileset.png');
        // Tilemap with a lot of objects and tile-properties tricks
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/World1.json');

        this.load.spritesheet('player-idle', 'assets/Lifter Asset Pack/1.Sprite/1.Player/shorthair/Skin1/shortplayer_idle.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('player-run', 'assets/Lifter Asset Pack/1.Sprite/1.Player/shorthair/Skin1/shortplayer_run.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('player-jump', 'assets/Lifter Asset Pack/1.Sprite/1.Player/shorthair/Skin1/shortplayer_jumpandfall.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('player-roll', 'assets/Lifter Asset Pack/1.Sprite/1.Player/shorthair/Skin1/shortplayer_roll.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('player-slide', 'assets/Lifter Asset Pack/1.Sprite/1.Player/shorthair/Skin1/shortplayer_slider.png', {
            frameWidth: 32, frameHeight: 32
        });
    }

    create() {
        this.hero = this.add.sprite(this.sys.game.config.width * .9, this.sys.game.config.height * .75, 'sprite');
        this.hero.setScale(5);
        this.hero.play('idle', true);
    }

    update(time) {
        if (time % 2000 <= 20) {
            this.index = (this.index + 1) % this.animations.length;
            this.hero.play(this.animations[this.index], true);
            if (this.index === this.animations.length - 1) {
                this.hero.setFlipX(!this.hero.flipX);
            }
        }
    }
}

export default BootScene;
