class UiScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'UI',
            active: true
        });
        this.gameScene = null;
        this.hero = null;
        this.dialog = null;
        this.stateText = null;
        this.prevState = null;
    }

    init() {
        this.gameScene = this.scene.get('GameScene');
    }
    
    create() {
        // let config = {
        //     x: 200,
        //     y: 200,
        //     width: 300,
        //     height: 300
        // };
        // this.dialog = this.rexUI.add.textArea({
        //     x: config.x,
        //     y: config.y,
        //     // anchor: undefined,
        //     width: config.width,
        //     height: config.height,
        
        //     // Elements
        //     background: this.rexUI.add.roundRectangle(config.x, config.y, config.x, config.y, 50, 'white'),
        
        //     text: createLabel(this, 'test'),
        //     // textWidth: undefined,
        //     // textHeight: undefined,
        
        //     // slider: {
        //     //     track: trackGameObject,
        //     //     thumb: thumbGameObject,
        //     // },
        
        //     // scroller: {
        //     //     threshold: 10,
        //     //     slidingDeceleration: 5000,
        //     //     backDeceleration: 2000,
        //     // },
        
        //     clamplChildOY: false,
        
        //     // header: headerGameObject,
        //     // footer: footerGameObject,
        
        //     space: {
        //         left: 0,
        //         right: 0,
        //         top: 0,
        //         bottom: 0,
        
        //         text: 0,
        //         // text: {
        //         //    top: 0,
        //         //    bottom: 0,
        //         //    left: 0,
        //         //    right: 0,
        //         //},
        //         header: 0,
        //         footer: 0,
        //     },
        
        //     expand: {
        //         header: true,
        //         footer: true,
        //     },
        
        //     align: {
        //         header: 'center',
        //         footer: 'center',
        //     },
        
        //     content: 'this is a test',
        
        //     // name: '',
        //     draggable: true
        // });
    }

    update() {
        if (this.gameScene.hero && this.hero === null) {
            this.hero = this.gameScene.hero;
        }
        if(this.hero?.currentState !== this.prevState) {
            this.stateText?.destroy();
            this.stateText = this.add.text(5, 1050,  this.hero?.currentState, {
                fontSize: '24px'
            });
        }
        // this.dialog.getElement('content')[0].text = 'current state: ' + this.hero?.currentState;
        // this.dialog.getElement('content')[1].text = 'position: { ' + this.hero?.x.toFixed(0) + ', ' + this.hero?.y.toFixed(0) + ' }' ;
        this.prevState = this.hero?.currentState;
    }
}

var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        width: 40, // Minimum width of round-rectangle
        height: 40, // Minimum height of round-rectangle
      
        // background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),

        text: scene.add.text(0, 1050, text, {
            fontSize: '24px'
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
}

export default UiScene;
