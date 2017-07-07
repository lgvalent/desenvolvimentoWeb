class Worm extends Phaser.Sprite {
    constructor (game, cursors, x, y, asset) {
        super(game, x, y, asset)
        this.keys = cursors
        this.game.physics.enable(this, Phaser.Physics.ARCADE)
        this.body.collideWorldBounds = true
        this.body.setSize(116, 42, 0, 0)
        this.anchor.setTo(0.5, 0.5)

        this.animations.add('walk', [1,2,1], 10, true)
		this.animations.play('walk')
    }


    update() {
		this.body.velocity.x =150; 
    }
}