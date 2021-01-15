import buildScene from '../helpers/buildScene';
import Hero from '../sprites/Hero';

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }

    create() {
      
        buildScene(this);

        this.hero = new Hero({
            scene: this,
            key: 'hero',
            x: 25,
            y: 50
        })

        this.physics.add.collider(this.hero, this.platforms);
        // this.cameras.main.startFollow(this.hero);
    }

    update(time, delta) {
        this.hero.update(time, delta);
    }
}

export default GameScene;
