class GameState extends Phaser.State {
    create() {
        let fullScreenButton = this.input.keyboard.addKey(Phaser.Keyboard.ONE);
        fullScreenButton.onDown.add(this.toggleFullScreen, this)
        this.scaleGame()
    }

    toggleFullScreen() {
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        if (this.scale.isFullScreen) {
            this.scale.stopFullScreen();
        } else {
            this.scale.startFullScreen(false);
        }
    }

    scaleGame() {
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE //RESIZE
        this.game.scale.setResizeCallback(function (scale, parentBounds) {
            let scaleX = Config.CONTAINER_WIDTH / Config.WIDTH
            let scaleY = Config.CONTAINER_HEIGHT / Config.HEIGHT
            this.game.scale.setUserScale(scaleX, scaleY, 0, 0)
        }, this)
    }
}