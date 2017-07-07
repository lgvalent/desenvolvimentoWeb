class Coin extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this)
        this.body.allowGravity = false
        this.autoCull = true
    }
}


class CoinBlue extends Coin {
    constructor(game, x, y, asset) {
        super(game, x, y, asset);
        this.points = 10;
    }
}

class CoinRed extends Coin {
    constructor(game, x, y, asset) {
        super(game, x, y, asset);
        this.points = 5;
    }
}

class CoinYellow extends Coin {
    constructor(game, x, y, asset) {
        super(game, x, y, asset);
        this.points = 1;
    }
}

class CoinTransparent extends Coin {
    constructor(game, x, y, asset) {
        super(game, x, y, asset);
        this.points = 50;
    }
}