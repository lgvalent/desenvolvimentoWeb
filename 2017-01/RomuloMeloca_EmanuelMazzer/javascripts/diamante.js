class Diamante extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset);
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.autoCull = true;
        this.points = 100;

        //   this.animations.add('spin', [1351,1352,1353,1354], 1	0, true)
        // this.animations.play('spin')
    }
}