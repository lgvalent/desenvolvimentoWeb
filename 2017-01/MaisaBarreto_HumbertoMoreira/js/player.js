
class Player extends Phaser.Sprite {
    constructor (game, cursors, x, y, asset) {
        super(game, x, y, asset)

        this.jumped=false
        this.keys = cursors
        this.game.physics.enable(this, Phaser.Physics.ARCADE)
        this.body.collideWorldBounds = true
        this.body.setSize( 97,115 , 0, 0)
        this.anchor.setTo(0.5, 0.5)

        this.jumpCount=0

        this.animations.add('walk', [0,1,2,3], 10, true)
        this.animations.add('jump', [4,5,6,7], 10, true)
        this.animations.add('dead', [8,9,10,11], 10, true)
        this.animations.add('slide', [12,13], 10, true)
        
        this.animations.add('idle', [2], 10, true)

        let jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        jumpButton.onDown.add(this.checkDoubleJump, this)

        let ctrlButton = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        ctrlButton.onDown.add(this.slide, this)
       
        this.jumpMax = 1;
        this.jumpCount = 0;
    }


    slide(){
        if(this.body.onFloor())
        {
            this.animations.play('slide')
            if (this.keys.down.isDown)
                this.body.velocity.x = 500
            else
            if (this.keys.down.isDown)
                this.body.velocity.x = 500
        }
    }


    jump() {
      this.body.velocity.y = -450;
      this.jumpCount++;
    }

    checkDoubleJump() {
      if (this.jumpCount < this.jumpMax && this.body.onFloor()) {
        this.jump();
      }
      else if (this.jumpCount < this.jumpMax && !this.body.onFloor()) {
        this.jump();
      }
      if(this.body.onFloor())
      {
         this.jumpCount=0;
      }
    }

    update() {
        this.body.velocity.x = 0

        if (this.keys.left.isDown)
            
            this.body.velocity.x = -550
        else
        if (this.keys.right.isDown)
            this.body.velocity.x = 500

        this.animate()
    }

    animate() {
        // andando ou parado
        if (this.body.velocity.x != 0)
            this.animations.play('walk')
        else
            this.animations.play('idle')

        // no ar
        if (this.body.velocity.y != 0)
            this.animations.play('jump')

        // define lado
        if (this.body.velocity.x > 0)
            this.scale.x = 1
        else
        if (this.body.velocity.x < 0)
            this.scale.x = -1

    }
}