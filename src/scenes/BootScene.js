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
        this.frog = null;
        this.frog2 = null;
        this.frog3 = null;
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
        this.load.spritesheet('frog-idle', 'assets/Sprite-0001.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('frog-idle_out', 'assets/Sprite-0001_idle_outlined.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('frog-walk_out', 'assets/Sprite-0001_walk_out.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('frog-jump_out', 'assets/Sprite-0001_jump_outlined.png', {
            frameWidth: 32, frameHeight: 32
        });
    }

    create() {
        this.hero = this.add.sprite(this.sys.game.config.width * .9, this.sys.game.config.height * .75, 'sprite');
        this.hero.setScale(5);
        this.hero.play('idle', true);
        this.frog = this.add.sprite(this.sys.game.config.width * .2, this.sys.game.config.height * .75, 'frog');
        this.frog.setScale(5);
        this.frog2 = this.add.sprite(this.sys.game.config.width * .1, this.sys.game.config.height * .75, 'frog_idle');
        this.frog2.setScale(5);
        this.frog3 = this.add.sprite(this.sys.game.config.width * .3, this.sys.game.config.height * .75, 'frog_jump').setScale(5);
        // this.add.sprite(this.sys.game.config.width * .4, this.sys.game.config.height * .75, 'frog_jump_down').setScale(5).play('frog-jump_down_out');
    }

    update(time) {
        this.frog.play('frog-walk_out', true);
        this.frog2.play('frog-idle_out', true);
        this.frog3.play('frog-jump', true);
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
