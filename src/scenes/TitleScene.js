class TitleScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'TitleScene'
        });
    }
    preload() {
       
    }
    create() {
        
    }

    update(time, delta) {
       
    }

    startGame() {
        this.scene.stop('GameScene');
        this.registry.set('attractMode', false);
        this.scene.start('GameScene');
    }

    restartScene() {
        //        this.attractMode.stop();
        this.scene.stop('GameScene');
        this.scene.launch('GameScene');
        this.scene.bringToTop();

        this.registry.set('restartScene', false);
    }
}

export default TitleScene;
