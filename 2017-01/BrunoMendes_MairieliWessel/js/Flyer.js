class Flyer extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset);
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.autoCull = true;
        this.body.setSize(200, 90, 5, 30);
        this.scale.x = this.scale.y = 0.6;
        this.animations.add('fly', [0, 1, 2, 3, 4, 3, 2, 1], 20, true);
        this.animations.play('fly');
        this.anchor.setTo(0.5, 0.5);
    }

    start() {
        this.targetY -= this.height

        let tweenA = this.game.add.tween(this)
            .to({ x: this.targetX, y: this.targetY }, 3000, Phaser.Easing.Linear.In)
            .to({ x: this.x, y: this.y }, 3000, Phaser.Easing.Linear.In)
            .loop(-1)
            .start()
    }

}