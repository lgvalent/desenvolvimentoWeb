class Player extends Phaser.Sprite {
    constructor(game, cursors, x, y, asset) {
        super(game, x, y, asset)
        this.keys = cursors
        this.game.physics.enable(this, Phaser.Physics.ARCADE)
        this.body.collideWorldBounds = true
        this.inWallJump = false
        this.anchor.setTo(0.5, 0.5)

        this.animations.add('walk', [6, 7], 20, true)
        this.animations.add('jump', [7], 20, true)
        this.animations.add('idle', [5], 20, true)

        let jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        jumpButton.onDown.add(this.jump, this)
    }

    jump() {
        if (this.body.onFloor()) {
            this.body.velocity.y = -400
        } else if (this.body.blocked.right) {
            this.inWallJump = true
            this.body.velocity.y = -450;
            this.body.acceleration.x = -2000;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.5, () => { this.inWallJump = false }, this);
            this.jumpWallTrophie();
        } else if (this.body.blocked.left) {
            this.inWallJump = true
            this.body.velocity.y = -450;
            this.body.acceleration.x = 2000;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.5, () => { this.inWallJump = false }, this);
            this.jumpWallTrophie();
        }
    }

    jumpWallTrophie() {
        this.game.state.states.Play.trophy.show('wallJump');
    }

    update() {
        if (!this.inWallJump) {
            this.body.velocity.x = 0
            this.body.acceleration.x = 0

            if (this.keys.left.isDown)
                this.body.velocity.x = -500
            else if (this.keys.right.isDown)
                this.body.velocity.x = 500
        }

        this.animate()
    }

    animate() {
        if (this.body.velocity.x != 0)
            this.animations.play('walk')
        else
            this.animations.play('idle')

        if (this.body.velocity.y != 0)
            this.animations.play('jump')

        if (this.body.velocity.x > 0)
            this.scale.x = 1
        else if (this.body.velocity.x < 0)
            this.scale.x = -1
    }
}