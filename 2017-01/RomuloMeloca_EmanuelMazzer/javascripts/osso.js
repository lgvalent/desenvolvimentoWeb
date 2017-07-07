class Osso extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset);
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.autoCull = true;
        this.points = 1;
        this.animations.add('move', [0,1,2,3,4,5,6,7], 10  , true)
       this.animations.play('move')
        this.game.time.events.add(Phaser.Timer.SECOND * 5, this.kill, this);
       
        //this.update()
        //this.animations.add('vai', [this.body.velocity.x = -250],5, true)
        //this.animations.play('vai')
    }

}