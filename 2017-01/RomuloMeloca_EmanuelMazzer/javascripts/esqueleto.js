class Esqueleto extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this)
        this.body.allowGravity = false
        this.autoCull = true
       // this.body.setSize(25, 14, 3, 15)
        this.body.immovable = false // kinematic

       // this.scale.setTo(1.3, 1.3)
       this.anchor.setTo(0.5, 0)
         this.lastX = this.x;


        this.animations.add('move', [2,3], 3  , true)
        this.animations.add("dead", [1,0] ,2,true)

        this.animations.play('move')
    }

    start() {
        // correcao do problema de ancora do TILED
        this.targetY -= this.height

        this.tweenA = this.game.add.tween(this)
            .to( { x: this.targetX, y: this.targetY }, 4000, Phaser.Easing.Linear.None )
            .to( { x: this.x, y: this.y }, 4000, Phaser.Easing.Linear.None)
            .loop(-1)
            .start()
    }


    update() {

        if (this.x > this.lastX) {
            this.scale.x = -1;
        } else {
            this.scale.x = 1;
        }
        this.lastX = this.x;
    }

     enemieKill() {
        this.animations.play('dead');
        //this.body.allowGravity = false;
        this.tweenA.stop();
        this.body.enable = false;
        this.game.time.events.add(Phaser.Timer.SECOND * 1, this.kill, this);
}

}