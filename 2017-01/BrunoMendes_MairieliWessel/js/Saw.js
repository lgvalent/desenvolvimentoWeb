class Saw extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset);
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.body.setSize(54, 26, 5, 38)
        this.animations.add('rotate', [0, 1], 20, true);
        this.animations.play('rotate');
        this.anchor.setTo(0.5, 0.5);
        this.speedMovement = 200;

    }

    update() {
        this.body.velocity.x = this.speedMovement;
    }

    invertMovement() {
        this.speedMovement *= -1;
    }

}