export default class Hero extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.body.collideWorldBounds = true;

        this.scene = config.scene;
        this.armed = false;
        this.lock = false;
        this.jumpForce = 1;
        this.jumpLock = false;

        this.keys = {
            jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            jump2: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            fire: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        };
    }

    update(time, delta) {

        if(this.body.onFloor()){
            // Landing from jump
            if(this.anims.currentAnim.key === 'jump-down') { 
                this.handleLanding();
                // on ground
            } else if (!this.lock && this.keys.left.isDown && this.body.onFloor()) { 
                this.moveLeft();
            } else if (!this.lock && this.keys.right.isDown & this.body.onFloor()) {
               this.moveRight();
            } else if (this.keys.down.isDown){
                this.anims.play('jump-down-light', false)
                if(this.body.velocity.x !== 0){
                   this.slide();
                }

            } else if(!this.lock){
                // Slow down player
                if(this.body.velocity.x > 0.1 || this.body.velocity.x < -0.1) { 
                    this.body.setVelocityX(this.body.velocity.x/2); 
                } else {
                    this.body.setVelocityX(0);
                }
                this.anims.play('idle', true);
            }
            // this.lock = false;
        }
        if (!this.jumpLock && this.keys.jump.isDown && this.body.onFloor()) {
            this.jump();
        }
        if(!this.keys.jump.isDown) { this.jumpLock = false }
        // } else if( this.keys.jump.isDown && !this.player.body.onFloor() && this.player.body.velocity.y < -500) {
        //     this.player.play('roll', true)
        // } else if (this.player.body.onFloor()) {
            
        // }
            
        if(this.body.velocity.y > 0) { 
            this.anims.play('jump-down', true)
            this.lock = true;
        } 
    }

    jump(){
        this.body.setVelocityY(-350);
        this.anims.play('jump-up', true);
        this.jumpLock = true;
    }

    handleLanding() {
        // Land and run
        if(this.keys.right.isDown || this.keys.left.isDown) {
           this.body.setVelocityX(this.body.velocity.x/2);
           this.anims.play('jump-down-light', true) 
           this.lock = true;
       }
       // land and stop
       if(this.body.velocity.x > 0.1 || this.body.velocity.x < -0.1) { 
           this.body.setVelocityX(this.body.velocity.x/1.35); 
       } else {
           this.body.setVelocityX(0);
       }
       // idle from landing
       this.on('animationcomplete', () => { 
           this.anims.play('idle', true) 
           this.lock = false;
       })
   }

   moveLeft(){
       this.body.setVelocityX(-175);
       this.setFlipX(true);
       this.anims.play('run', true);
   }

   moveRight(){
       this.body.setVelocityX(175);
       this.setFlipX(false);
       this.anims.play('run', true);
   }

   slide(){
       this.body.setVelocityX(this.body.velocity.x/1.025)
       this.anims.play('slide', true)
       if((this.body.velocity.x > 0 && this.body.velocity.x < 80) || (this.body.velocity.x < 0 && this.body.velocity.x > -80)){
               this.body.setVelocityX(0)
       };
    }
}
