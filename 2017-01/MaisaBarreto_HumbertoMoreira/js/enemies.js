class Joaninha extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this)
        this.body.allowGravity = false
        this.autoCull = true
        this.body.setSize(100, 75, 3, 15)
        this.body.immovable = true // kinematic

        this.scale.setTo(1.0, )

        this.animations.add('move', [0,1,2], 10, true)
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

class AbrirBoca extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this)
        this.body.allowGravity = false
        this.autoCull = true
        this.body.setSize(92, 105, 3, 15)
        this.body.immovable = true // kinematic

        this.scale.setTo(1.0, 1.0)

        this.animations.add('move', [0,1,2], 10, true)
        this.animations.play('move')
    }

    // start() {
    //     // correcao do problema de ancora do TILED
    //     this.targetY -= this.height

    //     let tweenA = this.game.add.tween(this)
    //         .to( { x: this.targetX, y: this.targetY }, 3000, "Quart.easeInOut" )
    //         .to( { x: this.x, y: this.y }, 3000, "Quart.easeInOut" )

    //         .loop(-1)
    //         .start()
    // }
}

class Serra extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this)
        this.body.allowGravity = false
        this.autoCull = true
        this.body.setSize(113, 57, 3, 15)
        this.body.immovable = true // kinematic

        this.scale.setTo(1.0, 1.0)

        this.animations.add('move', [0,1,2], 10, true)
        this.animations.play('move')
    }

    
}