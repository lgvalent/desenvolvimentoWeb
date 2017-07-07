class SawFree extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this)
        this.body.allowGravity = false;
        this.body.setSize(100, 100, 15, 15)
        this.scale.setTo(0.48, 0.48);
        this.anchor.setTo(0.5, 0.5)
        this.xInitial = x;
        this.yInitial = y;
        this.vel = 300;
        this.rot = 5;
    }

    collideMap() {
        this.reset(this.xInitial, this.yInitial);
    }

}

class SawFreeRight extends SawFree {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
    }

    update() {
        this.body.velocity.x = this.vel;
        this.body.rotation += this.rot;
    }

}

class SawFreeLeft extends SawFree {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
    }

    update() {
        this.body.velocity.x = -this.vel;
        this.body.rotation -= this.rot;
    }

}

class SawFreeDown extends SawFree {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
    }

    update() {
        this.body.velocity.y = this.vel + 100;
        this.body.rotation += this.rot;
    }
}

class SawFreeUp extends SawFree {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
    }

    update() {
        this.body.velocity.y = -this.vel;
        this.body.rotation -= this.rot;
    }
} 