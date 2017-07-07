class PlayState extends GameState {
    preload() {
        let dir = Config.ASSETS
        // MAP
        this.game.load.tilemap(`level${Config.LEVEL}`, `${dir}map${Config.LEVEL}.json`, null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-1', `${dir}tilesheet-64x64.png`);
        this.game.load.image('background', `${dir}background3.png`);
        this.game.load.image('trophy', `${dir}trophy-200x64.png`);

        // Sprites        
        this.game.load.spritesheet('saw', `${dir}saws.png`, 64, 64);
        this.game.load.spritesheet('flyer', `${dir}flyers.png`, 216, 148);
        this.game.load.spritesheet('jumper', `${dir}jumper.png`, 216, 148);
        this.game.load.spritesheet('spiker', `${dir}spikers.png`, 120, 159);
        this.game.load.spritesheet('sawfree', `${dir}saw.png`, 128, 128);
        this.game.load.spritesheet('coinred', `${dir}coinred.png`, 64, 64);
        this.game.load.spritesheet('coinblue', `${dir}coinblue.png`, 64, 64);
        this.game.load.spritesheet('coinyellow', `${dir}coinyellow.png`, 64, 64);
        this.game.load.spritesheet('checkpoint', `${dir}checkpoint2.png`, 64, 64);
        this.game.load.spritesheet('checkpointfinal', `${dir}checkpoint1.png`, 64, 64);
        this.game.load.spritesheet('cointransparent', `${dir}cointransparent.png`, 64, 64);
        this.game.load.atlasJSONArray('player', `${dir}player.png`, `${dir}player.json`)

        // Audios
        this.game.load.audio('theme', 'assets/sounds/theme.ogg')
        this.game.load.audio('trophy', 'assets/sounds/trophy.mp3')
        this.game.load.audio('died', 'assets/sounds/died.mp3')
        this.game.load.audio('yahoo', 'assets/sounds/yahoo.mp3')
    }

    createPlayer() {
        this.lastCheckin = [50, 100];
        this.player = new Player(this.game, this.keys, Config.POSX, Config.POSY, 'player')
        this.game.add.existing(this.player)
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    }

    createMap() {
        this.map = this.game.add.tilemap(`level${Config.LEVEL}`)
        this.map.addTilesetImage('tiles-1')
        this.mapLayer = this.map.createLayer('MapLayer')
        this.map.setCollisionBetween(1, 9, true, 'MapLayer')
        this.map.setCollisionBetween(23, 31, true, 'MapLayer')
        this.map.setCollisionBetween(45, 53, true, 'MapLayer')

        this.map.setCollisionBetween(199, 207, true, 'MapLayer')
        this.map.setCollisionBetween(221, 229, true, 'MapLayer')
        this.map.setCollisionBetween(243, 251, true, 'MapLayer')

        this.map.setCollisionBetween(133, 141, true, 'MapLayer')
        this.map.setCollisionBetween(155, 163, true, 'MapLayer')
        this.map.setCollisionBetween(177, 185, true, 'MapLayer')

        this.map.setCollisionBetween(123, 129, true, 'MapLayer')
        this.map.setCollisionBetween(123, 129, true, 'MapLayer')
        this.map.setCollisionBetween(145, 151, true, 'MapLayer')
        this.map.setCollisionBetween(193, 198, true, 'MapLayer')
        this.map.setCollisionBetween(215, 219, true, 'MapLayer')
        this.mapLayer.resizeWorld()
    }

    createSaw() {
        this.saws = this.add.group();
        this.map.createFromObjects('Saws', 13, 'saw', 0, true, false, this.saws, Saw)
    }

    createSawFree() {
        this.sawsFree = this.add.group();
        this.map.createFromObjects('Saws', 104, 'sawfree', 0, true, false, this.sawsFree, SawFreeDown)
        this.map.createFromObjects('Saws', 105, 'sawfree', 0, true, false, this.sawsFree, SawFreeRight)
        this.map.createFromObjects('Saws', 83, 'sawfree', 0, true, false, this.sawsFree, SawFreeLeft)
    }

    createFlyers() {
        this.flyers = this.game.add.group();
        this.map.createFromObjects('Saws', 230, 'flyer', 0, true, false, this.flyers, Flyer);
        this.flyers.forEach((flyer) => flyer.start());
    }

    createJumpers() {
        this.jumpers = this.game.add.group();
        this.map.createFromObjects('Saws', 231, 'jumper', 0, true, false, this.jumpers, Jumper);
        this.jumpers.forEach((jumper) => jumper.start());
    }

    createSpikers() {
        this.spikers = this.game.add.group();
        this.map.createFromObjects('Saws', 232, 'spiker', 0, true, false, this.spikers, Spiker);
        this.spikers.forEach((spiker) => spiker.start());
    }

    createCheckpoints() {
        this.checkpoints = this.game.add.group();
        this.checkpoints.enableBody = true;
        this.map.createFromObjects('Checkpoint', 189, 'checkpoint', 0, true, false, this.checkpoints);
        this.map.createFromObjects('Checkpoint', 191, 'checkpointfinal', 0, true, false, this.checkpoints);
        this.checkpoints.forEach((point) => { point.body.allowGravity = false; }, this);
    }

    createCoins() {
        this.coins = this.game.add.group()
        this.map.createFromObjects('Coins', 38, 'coinred', 0, true, false, this.coins, CoinRed)
        this.map.createFromObjects('Coins', 37, 'coinyellow', 0, true, false, this.coins, CoinYellow)
        this.map.createFromObjects('Coins', 36, 'coinblue', 0, true, false, this.coins, CoinBlue)
        this.map.createFromObjects('Coins', 35, 'cointransparent', 0, true, false, this.coins, CoinTransparent)
    }

    cretateHud() {
        this.scoreText = this.game.add.text(16, 16, '', { fontSize: "16px", fill: '#ffffff' });
        this.scoreText.text = "COINS: " + Config.SCORE;
        this.scoreText.fixedToCamera = true;
    }

    addScore(amount) {
        Config.SCORE += amount;
        ServerComm.saveState();
        this.scoreText.text = "COINS: " + Config.SCORE;
    }

    create() {
        super.create();
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        this.game.stage.backgroundColor = '#000000'

        let bg = this.game.add.tileSprite(0, 0, Config.WIDTH, Config.HEIGHT, 'background')
        bg.fixedToCamera = true

        this.keys = this.game.input.keyboard.createCursorKeys()
        this.game.physics.arcade.gravity.y = 550

        let fullScreenButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE)
        fullScreenButton.onDown.add(this.toogleFullScreen, this)

        let screenshotButton = this.game.input.keyboard.addKey(Phaser.Keyboard.P)
        screenshotButton.onDown.add(this.takeScreenShot, this)

        let audio = this.game.add.audio('theme')
        audio.loop = true
        audio.play()
        this.createMap();
        this.createPlayer();
        this.createCoins();
        this.createSawFree();
        this.createSaw();
        this.createFlyers();
        this.createJumpers();
        this.createSpikers();
        this.cretateHud();
        this.trophy = new Trophy(this.game);
        this.game.add.existing(this.trophy);
        ServerComm.listTrophy((response) => this.updateTrophies(response))
        this.game.camera.flash(0x000000, 1000);
        this.levelCleared = false
        this.createCheckpoints();
    }

    updateTrophies(json) {
        if (json['data'] != "") {
            let list = JSON.parse(json['data']);
            for (let t of list) {
                if (!Config.ACHIEVED.includes(t['name'])) {
                    Config.ACHIEVED.push(t['name']);
                    GAME.state.states.Play.trophy.addTrophyOnPage(t['name']);
                }
            }
        }
    }

    loadNextLevel() {
        if (!this.levelCleared) {
            this.levelCleared = true;
            this.game.camera.fade(0x000000, 1000);
            this.game.camera.onFadeComplete.add(this.changeLevel, this);
        }
    }

    changeLevel() {
        Config.LEVEL += 1;
        this.game.camera.onFadeComplete.removeAll(this)
        if (Config.LEVEL <= 3) {
            ServerComm.saveState();
            this.game.state.restart()
        } else {
            Config.LEVEL = 1;
            ServerComm.saveState();
            this.game.state.start('Win')
        }
    }

    takeScreenShot() {
        this.trophy.show("screenshot");
        let img = this.game.canvas.toDataURL();
        ServerComm.saveMedia({ mimeType: 'image/png', src: img }, () => { appendScreenShot(img); });
    }

    toogleFullScreen() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        if (this.game.scale.isFullScreen)
            this.game.scale.stopFullScreen()
        else
            this.game.scale.startFullScreen(false)
    }

    update() {
        this.game.physics.arcade.collide(this.player, this.mapLayer);
        this.game.physics.arcade.collide(this.player, this.sawsFree, this.sawCollidePlayer, null, this);
        this.game.physics.arcade.collide(this.player, this.saws, this.sawCollidePlayer, null, this);
        this.game.physics.arcade.collide(this.player, this.flyers, this.sawCollidePlayer, null, this);
        this.game.physics.arcade.collide(this.player, this.jumpers, this.sawCollidePlayer, null, this);
        this.game.physics.arcade.collide(this.player, this.spikers, this.sawCollidePlayer, null, this);
        this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.game.physics.arcade.collide(this.sawsFree, this.mapLayer, this.sawFreeCollideMap, null, this);
        this.game.physics.arcade.collide(this.saws, this.mapLayer, this.sawCollideMap, null, this);
        this.game.physics.arcade.overlap(this.player, this.checkpoints, this.collectCheckpoint, null, this);
    }

    collectCheckpoint(player, checkpoint) {
        if (checkpoint.key == "checkpointfinal") {
            Config.POSX = 50;
            Config.POSY = 100;
            this.loadNextLevel();
        } else if ((player.x != Config.POSX && Config.POSY != player.y) && (checkpoint.x != Config.POSX && Config.POSY != checkpoint.y)) {
            this.trophy.show("checkpoint");
            Config.POSX = checkpoint.x;
            Config.POSY = checkpoint.y;
            ServerComm.saveState();
        }
    }

    collectCoin(player, coin) {
        if (coin.key == "cointransparent") {
            this.trophy.show('coinTransparent');
            this.game.sound.play('yahoo')
        }
        this.trophy.show('firstCoin');
        coin.destroy()
        this.addScore(coin.points)
    }

    sawCollidePlayer() {
        this.playerDied()
    }

    sawCollideMap(saw, map) {
        saw.invertMovement();
    }

    sawFreeCollideMap(saw, map) {
        saw.collideMap()
    }

    playerDied() {
        this.trophy.show('firstDeath');
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.x = Config.POSX;
        this.player.y = Config.POSY;
        this.game.sound.play('died')
        this.camera.shake(0.02, 200);
    }

    renderGroup(member) {
        this.game.debug.body(member);
    }

    render() {
        if (Config.DEBUG) {
            this.spikers.forEachAlive(this.renderGroup, this);
            this.game.debug.body(this.player)
            this.game.debug.bodyInfo(this.player)
        }
    }

}