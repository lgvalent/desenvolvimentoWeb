
class TitleState extends Phaser.State {
    preload() {
        let dir = Config.ASSETS
        this.game.load.image('title',`${dir}game-logo.png`);
        this.game.load.image('background-title',`${dir}background-title.png`); 
    }

    create() {
        super.create()
        this.backgroundImage = this.game.add.sprite(0, 0, 'background-title');
        this.backgroundImage.height = Config.HEIGHT
        this.backgroundImage.width = Config.WIDTH
        this.imgTitle = this.game.add.image(0, 0, 'title')
        this.imgTitle.anchor.setTo(0.5, 0.5)
        this.imgTitle.x = this.game.width/2
        this.imgTitle.y = 150

        this.pressStart = this.game.add.text(0, 0,
            ' Aperte qualquer tecla para iniciar! ' ,
            {fontSize: '16px', fill: '#ffffff',  backgroundColor: 'rgba(black, 0.25)'} )
        this.pressStart.anchor.setTo(0.5, 0.5)
        this.pressStart.x = this.game.width/2
        this.pressStart.y = 300
        
        // qualquer tecla muda para a proxima cena
        this.game.input.onDown.add(this.startFade, this)

        // fade no titulo
        this.imgTitle.alpha = 0.3
        this.game.add.tween(this.imgTitle)
        .to( {alpha: 1}, 2000)
        .to( {alpha: 0.3}, 2000)
        .loop(-1)
        .start()

        // fade no presstart
        this.game.add.tween(this.pressStart)
        .to( {alpha: 0}, 500)
        .to( {alpha: 1}, 500)
        .loop(-1)
        .start()

        this.pressed = false
    }

    startFade() {
        if (!this.pressed) {
            this.pressed = true
            this.game.camera.fade(0x000000, 1000)
            this.game.camera.onFadeComplete.add(this.startGame, this)
        }
    }

    startGame() {
        this.game.camera.onFadeComplete.removeAll(this)
        this.game.state.start('Level')
    }

    update() {
    }
}


class LevelState extends Phaser.State {
    preload() {
        let dir = Config.ASSETS
        this.game.load.image('levels-logo',`${dir}levels-logo.png`);
        this.game.load.image('background-title',`${dir}background-title.png`); 
    }

    create() {
        super.create()
        this.backgroundImage = this.game.add.sprite(0, 0, 'background-title');
        this.backgroundImage.height = Config.HEIGHT
        this.backgroundImage.width = Config.WIDTH

        this.imgTitle = this.game.add.image(0, 0, 'levels-logo')
        this.imgTitle.anchor.setTo(0.5, 0.5)
        this.imgTitle.x = this.game.width/2
        this.imgTitle.y = 80

        this.faseUm = this.game.add.text(0, 0,
            ' Fase 1 - O início da jornada ' ,
            {fontSize: '22px', fill: '#ffffff',  backgroundColor: 'rgba(black, 0.25)'} )
        this.faseUm.anchor.setTo(0.5, 0.5)
        this.faseUm.x = this.game.width/2
        this.faseUm.y = 150
        this.faseUm.inputEnabled = true;
        this.faseUm.events.onInputDown.add(this.startFadeOne, this);

        this.faseDois = this.game.add.text(0, 0,
            ' Fase 2 - Correr sim, desistir jamais ' ,
            {fontSize: '22px', fill: '#ffffff',  backgroundColor: 'rgba(black, 0.25)'} )
        this.faseDois.anchor.setTo(0.5, 0.5)
        this.faseDois.x = this.game.width/2
        this.faseDois.y = 200
        this.faseDois.inputEnabled = true;
        this.faseDois.events.onInputDown.add(this.startFadeTwo, this);

        this.faseTres = this.game.add.text(0, 0,
            ' Para reinicar o jogo, aperte a letra Q ' ,
            {fontSize: '22px', fill: '#ffffff',  backgroundColor: 'rgba(black, 0.25)'} )
        this.faseTres.anchor.setTo(0.5, 0.5)
        this.faseTres.x = this.game.width/2
        this.faseTres.y = 250

        this.imgTitle.alpha = 0.3
        this.game.add.tween(this.imgTitle)
        .to( {alpha: 1}, 2000)
        .to( {alpha: 0.3}, 2000)
        .loop(-1)
        .start()
    }

    startFadeOne() {
        this.game.camera.fade(0x000000, 1000)
        this.game.camera.onFadeComplete.add(this.startGameOne, this)
    }

    startGameOne() {
        this.game.camera.onFadeComplete.removeAll(this)
        this.game.state.start('Play')
    }

    startFadeTwo() {
        this.game.camera.fade(0x000000, 1000)
        this.game.camera.onFadeComplete.add(this.startGameTwo, this)
    }

    startGameTwo() {
        this.game.camera.onFadeComplete.removeAll(this)
        this.game.state.start('PlayTwo')
    }

    startFadeThree() {
        this.game.camera.fade(0x000000, 1000)
        this.game.camera.onFadeComplete.add(this.startGameThree, this)
    }

    startGameThree() {
        this.game.camera.onFadeComplete.removeAll(this)
        this.game.state.start('PlayThree')
    }

    update() {
    }
}

class EndState extends Phaser.State {
    preload() {
        let dir = Config.ASSETS
        this.game.load.image('end-logo',`${dir}end-logo.png`);
        this.game.load.image('background-title',`${dir}background-title.png`); 
    }

    create() {
        super.create()
        this.backgroundImage = this.game.add.sprite(0, 0, 'background-title');
        this.backgroundImage.height = Config.HEIGHT
        this.backgroundImage.width = Config.WIDTH

        this.imgTitle = this.game.add.image(0, 0, 'end-logo')
        this.imgTitle.anchor.setTo(0.5, 0.5)
        this.imgTitle.x = this.game.width/2
        this.imgTitle.y = 150

        this.imgTitle.alpha = 0.3
        this.game.add.tween(this.imgTitle)
        .to( {alpha: 1}, 2000)
        .to( {alpha: 0.3}, 2000)
        .loop(-1)
        .start()

        this.pressStart = this.game.add.text(0, 0,
            ' Aperte qualquer tecla para continuar! ' ,
            {fontSize: '16px', fill: '#ffffff',  backgroundColor: 'rgba(black, 0.25)'} )
        this.pressStart.anchor.setTo(0.5, 0.5)
        this.pressStart.x = this.game.width/2
        this.pressStart.y = 300
        
        this.game.add.tween(this.pressStart)
        .to( {alpha: 0}, 500)
        .to( {alpha: 1}, 500)
        .loop(-1)
        .start()

        // qualquer tecla muda para a proxima cena
        this.game.input.onDown.add(this.startFade, this)

    }

    startFade() {
        this.game.camera.fade(0x000000, 1000)
        this.game.camera.onFadeComplete.add(this.startGame, this)
    }

    startGame() {
        this.game.camera.onFadeComplete.removeAll(this)
        this.game.state.start('Play')
    }

    update() {
    }
}

class GameOverState extends Phaser.State {
    preload() {
        let dir = Config.ASSETS
        this.game.load.image('gameover-logo',`${dir}gameover-logo.png`);
        this.game.load.image('background-title',`${dir}background-title.png`); 
    }

    create() {
        super.create()
        this.backgroundImage = this.game.add.sprite(0, 0, 'background-title');
        this.backgroundImage.height = Config.HEIGHT
        this.backgroundImage.width = Config.WIDTH

        this.imgTitle = this.game.add.image(0, 0, 'gameover-logo')
        this.imgTitle.anchor.setTo(0.5, 0.5)
        this.imgTitle.x = this.game.width/2
        this.imgTitle.y = 150

        this.imgTitle.alpha = 0.3
        this.game.add.tween(this.imgTitle)
        .to( {alpha: 1}, 2000)
        .to( {alpha: 0.3}, 2000)
        .loop(-1)
        .start()

        this.pressStart = this.game.add.text(0, 0,
            ' Aperte qualquer tecla para voltar ao menu! ' ,
            {fontSize: '16px', fill: '#ffffff',  backgroundColor: 'rgba(black, 0.25)'} )
        this.pressStart.anchor.setTo(0.5, 0.5)
        this.pressStart.x = this.game.width/2
        this.pressStart.y = 300
        
        this.game.add.tween(this.pressStart)
        .to( {alpha: 0}, 500)
        .to( {alpha: 1}, 500)
        .loop(-1)
        .start()

        // qualquer tecla muda para a proxima cena
        this.game.input.onDown.add(this.startFade, this)

    }

    startFade() {
        this.game.camera.fade(0x000000, 1000)
        this.game.camera.onFadeComplete.add(this.startGame, this)
    }

    startGame() {
        this.game.camera.onFadeComplete.removeAll(this)
        this.game.state.start('Title')
    }

    update() {
    }
}
