class WinState extends GameState {
    preload() {
        let dir = Config.ASSETS
        this.game.load.image('title', `${dir}end.png`);
    }

    create() {
        super.create();
        this.imgTitle = this.game.add.image(0, 0, 'title')
        this.imgTitle.anchor.setTo(0.5, 0.5);
        this.imgTitle.x = this.game.width / 2;
        this.imgTitle.y = 150;

        this.pressStart = this.game.add.text(0, 0, "Press ENTER to restart", {
            'fontSize': '18px',
            'fill': '#ffffff'
        });

        this.pressStart.anchor.setTo(0.5, 0.5);
        this.pressStart.x = this.game.width / 2;
        this.pressStart.y = 300;

        this.imgTitle.alpha = 0.3;
        this.game.add.tween(this.imgTitle)
            .to({ 'alpha': 1 }, 2000)
            .to({ 'alpha': 0.3 }, 2000)
            .loop(-1)
            .start();

        this.game.add.tween(this.pressStart)
            .to({ 'alpha': 0 }, 500)
            .to({ 'alpha': 1 }, 500)
            .loop(-1)
            .start();

        let fullScreenButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        fullScreenButton.onDown.add(this.toogleFullScreen, this);

        this.pressed = false;
        let startButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        startButton.onDown.add(this.startFade, this);
    }

    startFade() {
        if (!this.pressed) {
            this.pressed = true;
            this.game.camera.fade(0x000000, 1000);
            this.game.camera.onFadeComplete.add(this.startGame, this);
        }
    }

    startGame() {
        this.game.camera.onFadeComplete.removeAll(this);
        this.game.state.start('Play');
    }

    toogleFullScreen() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        if (this.game.scale.isFullScreen)
            this.game.scale.stopFullScreen();
        else
            this.game.scale.startFullScreen(false);
    }

    update() {

    }
}