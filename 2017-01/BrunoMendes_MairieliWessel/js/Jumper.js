class Jumper extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset);
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.autoCull = true;
        this.body.setSize(100, 140, 5, 2);
        this.scale.x = this.scale.y = 0.5;
        this.anchor.setTo(0.5, 0.5);
    }

    start() {
        let tweenA = this.game.add.tween(this)
            .to({ y: this.y + 80 }, 1000, Phaser.Easing.Bounce.Out)
            .to({ y: this.y }, 1000, Phaser.Easing.Bounce.In)
            .loop(-1)
            .start()
    }

}