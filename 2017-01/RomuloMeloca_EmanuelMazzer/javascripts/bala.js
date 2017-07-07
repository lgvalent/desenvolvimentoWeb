class Bala extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset);
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.autoCull = true;
        this.points = 1;
        this.game.time.events.add(Phaser.Timer.SECOND * 5, this.kill, this);
       
        //this.update()
        //this.animations.add('vai', [this.body.velocity.x = -250],5, true)
        //this.animations.play('vai')
    }

}