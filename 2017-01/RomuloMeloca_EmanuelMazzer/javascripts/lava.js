class Lava extends Phaser.Sprite {
    constructor(game, x, y, asset) {

        super(game, x, y, asset);
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.autoCull = true;

        this.animations.add('spin', [1, 2, 3, 4], 3, true);
        this.animations.play('spin');
    }
}