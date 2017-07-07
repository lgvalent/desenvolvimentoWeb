class Spiker extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset);
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.autoCull = true;
        this.body.setSize(75, 150, 20, 0);
        this.scale.x = this.scale.y = 0.6;
        this.animations.add('walk', [0, 1], 10, true);
        this.animations.play('walk');
        this.anchor.setTo(0.5, 0.5);
    }

    start() {
        this.game.add.tween(this)
            .to({ x: this.x + 400 }, 3000, Phaser.Easing.Linear.In)
            .to({ x: this.x }, 3000, Phaser.Easing.Linear.In)
            .loop(-1)
            .start();

        this.game.add.tween(this.scale)
            .to({}, 3000, Phaser.Easing.Linear.In)
            .to({ x: this.scale.x * -1 }, 1, Phaser.Easing.Linear.In)
            .to({}, 3000, Phaser.Easing.Linear.In)
            .to({ x: this.scale.x }, 1, Phaser.Easing.Linear.In)
            .loop(-1)
            .start();
    }

}