class Voador extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this)
        this.body.allowGravity = false
        this.autoCull = true
        this.body.setSize(25, 14, 3, 15)
        this.body.immovable = false // kinematic

        this.scale.setTo(1.3, 1.3)

        this.animations.add('move', [0,1,2], 5  , true)
        this.animations.play('move')
    }

    start() {
        // correcao do problema de ancora do TILED
        this.targetY -= this.height

        let tweenA = this.game.add.tween(this)
            .to( { x: this.targetX, y: this.targetY }, 3000, "Quart.easeInOut" )
            .to( { x: this.x, y: this.y }, 3000, "Quart.easeInOut" )
            .loop(-1)
            .start()
    }
}