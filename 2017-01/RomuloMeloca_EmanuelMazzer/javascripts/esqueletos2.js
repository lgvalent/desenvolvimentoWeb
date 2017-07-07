class Esqueletos2 extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this)
        this.body.allowGravity = false
        this.autoCull = true
        this.body.setSize(25, 14, 3, 15)
        this.body.immovable = false // kinematic

        this.scale.setTo(1, 1)
        this.speed = 200;
        this.anchor.setTo(0.5, 0)

        this.animations.add('move', [0,1], 1  , true)
       this.animations.play('move')
        this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.fire, this);
    }
    fire(){
        let osso = new Osso(this.game, this.x, this.y, 'osso')
        this.game.add.existing(osso);
        osso.body.velocity.x = this.dirX * this.speed;
        this.ossos.add(osso);
    }

     update() {

        if (this.dirX> 0) {
            this.scale.x = -1;
        } else {
            this.scale.x = 1;
        }
    }

    /*start() {
        // correcao do problema de ancora do TILED
        this.targetY -= this.height

        let tweenA = this.game.add.tween(this)
            .to( { x: this.targetX, y: this.targetY }, 3000, "Quart.easeInOut" )
            .to( { x: this.x, y: this.y }, 3000, "Quart.easeInOut" )
            .loop(-1)
            .start()
    }*/
}