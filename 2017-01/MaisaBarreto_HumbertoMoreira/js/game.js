class Config {}
Config.RATIO = 1.77
Config.HEIGHT= 1024
Config.CONTAINER_HEIGHT = 550
Config.WIDTH = Config.HEIGHT * Config.RATIO
Config.CONTAINER_WIDTH  = Config.CONTAINER_HEIGHT * Config.RATIO
Config.DEBUG = false
Config.ANTIALIAS = false
Config.ASSETS = 'assets/'
Config.LEVEL = 1
Config.SCORE = 0
Config.CurrentX =-1
Config.CurrentY =-1
Config.nameUser=-1
Config.nameGame="penguimsavers"

class Game extends Phaser.Game {
    constructor() {
        super(Config.WIDTH, Config.HEIGHT, Phaser.CANVAS,
            'game-container', null, false, Config.ANTIALIAS)

        this.state.add('Play', PlayState, false)
        this.state.add('Derrota', Derrota, false)
        this.state.add('Venceu', Venceu, false)
        this.state.add('Title', TitleState, false)        
        this.state.start('Title')
    }
}
// CLASSE GENERICA DE TELAS //////////////////////////////////////////////////////
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

        // escala da tela        
        this.game.scale.setResizeCallback(function(scale, parentBounds) {
            //this.game.scale.setMaximum()
            let scaleX = Config.CONTAINER_WIDTH / Config.WIDTH
            let scaleY = Config.CONTAINER_HEIGHT / Config.HEIGHT

            this.game.scale.setUserScale(scaleX, scaleY, 0, 0)
        }, this)        
    }
}

// Tela de Titulo
class TitleState extends GameState {
    preload() {
        let dir = Config.ASSETS
        this.game.load.image('title',`${dir}title.png`); 
        console.log('TITLE SCREEN') 
    }

    create() {
        super.create()

        this.imgTitle = this.game.add.image(0, 0, 'title')
        this.imgTitle.anchor.setTo(0.5, 0.5)
        this.imgTitle.x = this.game.width/2
        this.imgTitle.y = 150

        this.pressStart = this.game.add.text(0, 0,
            'Press ENTER to begin' ,
            {fontSize: '16px', fill: '#ffffff'} )
        this.pressStart.anchor.setTo(0.5, 0.5)
        this.pressStart.x = this.game.width/2
        this.pressStart.y = 300


        let startButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.ENTER)
        
        startButton.onDown.add(this.startFade, this)

        // qualquer tecla muda para a proxima cena
        //this.game.input.onDown.add(this.startFade, this)

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
        var x = document.getElementById('labelNovo');
        // x.value='ONLINE'

        if (!this.pressed ) {
            this.pressed = true
            this.game.camera.fade(0x000000, 1000)
            this.game.camera.onFadeComplete.add(this.startGame, this)
        }
    }

    startGame() {
        // preparar o jogo
        // reset de highscore e controle de carregamento de estado do servidor
        Config.SCORE = 0
        Config.LEVEL = 1

        // evitar bug de levar o callback para outra tela (state)
        this.game.camera.onFadeComplete.removeAll(this)
        this.game.state.start('Play')


        ServerComm.loadState(Config.nameUser,  Config.nameGame, 'load-state', Config.level, (response) => carregarEstado(response) )
        
    }




    update() {
    }
}

class PlayState extends GameState {
    preload() {
        let dir = Config.ASSETS

        // mapa
        if (Config.LEVEL == 1) {
            this.game.load.tilemap('fundo', `${dir}fundo.json`,  null, Phaser.Tilemap.TILED_JSON);
        }

        else  if (Config.LEVEL == 2) {
            this.game.load.tilemap('fundo', `${dir}fundo2.json`,  null, Phaser.Tilemap.TILED_JSON);
        }

        else if (Config.LEVEL == 3) {
            this.game.load.tilemap('fundo', `${dir}fundo3.json`,  null, Phaser.Tilemap.TILED_JSON);
        }

        this.game.load.image('spritesheet_ground',`${dir}spritesheet_ground.png`);
        this.game.load.image('spritesheet_tiles',`${dir}spritesheet_tiles.png`);

        this.game.load.spritesheet('dude',`${dir}penguin_sprites1.png`, 101,120 );
        this.game.load.spritesheet('02_preview',`${dir}Preview4.jpg`, 75, 75);
        this.game.load.spritesheet('spritesheet_hud',`${dir}spritesheet_hud.png`, 75, 75);
        this.game.load.spritesheet('arvores',`${dir}trees.png`, 75, 75);
        this.game.load.spritesheet('things',`${dir}things.png`, 75, 75);

        this.game.load.image('background',`${dir}img.jpg`);
        this.game.load.image('emerald',`${dir}coin.png`);
        
        this.game.load.image('trophy',`${dir}trophy-200x64.png`);
        this.game.load.image('life3',`${dir}life3.png`);
        this.game.load.image('life2',`${dir}life2.png`);
        this.game.load.image('life1',`${dir}life1.png`);
        this.game.load.spritesheet('check',`${dir}check.png`, 72, 71);
        this.game.load.spritesheet('enemy',`${dir}8.png`, 105,75);
        this.game.load.spritesheet('enemy1',`${dir}15.png`, 92,105);
        this.game.load.spritesheet('enemy2',`${dir}5.png`, 113,62);

        this.trophy = new Trophy(this.game)
        this.game.add.existing(this.trophy)
    }

    createPlayer() {
        if(Config.CurrentX!=-1 && Config.CurrentY!=-1  ){
         this.player = new Player(this.game, this.keys, Config.CurrentX, Config.CurrentY, 'dude')
     }else{

        if (Config.LEVEL == 1) {
            this.player = new Player(this.game, this.keys, 50, 500, 'dude')
        }
        else if (Config.LEVEL == 2) {
            this.player = new Player(this.game, this.keys, 6900, 7000, 'dude')
        }
        else if (Config.LEVEL == 3) {
            this.player = new Player(this.game, this.keys, 50, 500, 'dude')
        }
    }
    this.game.add.existing(this.player)

        // camera seca
        //this.game.camera.follow(this.player)

        // camera suave: 0.1 para X e Y eh o fator de interpolacao do deslocamento
        // da camera -> quanto maior, mais rapido ela segue o jogador
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1); 
    }

    createMap() {
        // chave para o arquivo .json carregado no metodo preload()
        this.map = this.game.add.tilemap('fundo')
        // this.map2 = this.game.add.tilemap('fundo2')
        // this.map3 = this.game.add.tilemap('fundo3')
        // chave para o arquivo .png de tileset carregado no metodo preload()
        // corresponde ao nome usado para o tileset dentro do Tiled Editor

        this.map.addTilesetImage('spritesheet_ground')
        this.map.addTilesetImage('spritesheet_tiles')

        this.map.addTilesetImage('02_preview')

        this.map.addTilesetImage('spritesheet_hud')
        this.map.addTilesetImage('arvores')
        this.map.addTilesetImage('things')
        
        this.map.addTilesetImage('check')

         // deve ter o mesmo nome usado na camada criada no Tiled Editor
        this.mapLayer = this.map.createLayer('Tiles')

        this.mapLayer2 = this.map.createLayer('Agua')

        // this.mapLayer3 = this.map.createLayer('CheckPoints')
        //this.mapLayer3= this.map.createLayer('Vidas')


        this.map.setCollision([33], true, 'Tiles') 
        this.map.setCollision([25], true, 'Tiles')
        this.map.setCollisionBetween(129, 261, true, 'Tiles')

        this.map.setCollision([10], true, 'Agua')
        this.map.setCollision([121], true, 'Agua') 
        this.map.setCollision([10], true, 'Agua')
        this.map.setCollision([122], true, 'Agua') 
       
        this.map.setCollision([122], true, 'Agua') 
        // this.map.setCollision([53], true, 'CheckPoints')

        this.mapLayer.resizeWorld()
        this.mapLayer2.resizeWorld() 
        // this.mapLayer3.resizeWorld()
    }

    createVidas() {
        this.vidas = this.game.add.group()    
        this.map.createFromObjects('Vidas', 299, 'spritesheet_hud', 0, true, false, this.vidas, Vida)
    }

    createCoins() {
        this.coins = this.game.add.group()
        this.map.createFromObjects('Coins', 294, 'spritesheet_hud',  0, true, false, this.coins, Coin )
    }


    createCheckPoints() {
        this.checkpoints = this.game.add.group()
        this.map.createFromObjects('CheckPoints', 371, 'check',  0, true, false, this.checkpoints, CheckPoints)
        console.log("Criou os checkPoints")
    }


    cretateHud() {
        this.scoreText = this.game.add.text(80, 80, '', { fontSize: "40px", fill: '#ffffff' });
        this.scoreText.text = "0";
        this.scoreText.fixedToCamera = true;   
        this.scoreGem = this.game.add.sprite(10, 80, 'emerald')
        this.scoreGem.fixedToCamera = true

        let levelText = this.game.add.text(16, 16, `Level ${Config.LEVEL}`,  { fontSize: "46px", fill: '#ffffff' })
        levelText.anchor.setTo(0.5, 0.5)
        levelText.x = this.game.width/2
        levelText.y = 100
        levelText.fixedToCamera = true;        

        // efeito do texto de Level
        levelText.alpha = 0
        this.game.add.tween(levelText)
        .to( {alpha: 1}, 1000, Phaser.Easing.Linear.None, false, 1000 )
        .to( {alpha: 0}, 1000, Phaser.Easing.Linear.None, false, 2000)
        .start()
    }
    

    createLife() { 
        this.life =3; 
        this.life1 = this.game.add.sprite(10, 10,'life1')
        this.life1.fixedToCamera = true
        
        this.life2 = this.game.add.sprite(10, 10,'life2')
        this.life2.fixedToCamera = true
        
        this.life3 = this.game.add.sprite(10, 10,'life3')
        this.life3.fixedToCamera = true    
    }


    addScore(amount) {
        this.score += amount
        this.scoreText.text = this.score

    }

    createEnemies() {
        this.joaninhas = this.game.add.group()
        // 51 eh o indice do tile
        this.map.createFromObjects('Enemies', 386, 'enemy',  0, true, false, this.joaninhas, Joaninha) 
        this.joaninhas.forEach( (joaninha) => joaninha.start() )  

        this.abrirBoca = this.game.add.group()
        this.map.createFromObjects('Enemies', 390, 'enemy1',  0, true, false, this.abrirBoca, AbrirBoca) 

        this.serra = this.game.add.group()
        this.map.createFromObjects('Enemies', 39, 'enemy2',  0, true, false, this.serra, Serra) 
    
    }

    carregarEstado(response) {
        if(response['response'] == 'ok'){
            Config.CurrentX=response['data'].x
            Config.CurrentX=response['data'].y
        }
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        this.game.stage.backgroundColor = '#000000'
        this.game.stage.backgroundImage="assets/04_preview.jpg"
        //this.game.renderer.renderSession.roundPixels = true;

        let bg = this.game.add.tileSprite(0, 0, Config.WIDTH, Config.HEIGHT, 'background')
        bg.fixedToCamera = true
        
        this.keys = this.game.input.keyboard.createCursorKeys()
        this.game.physics.arcade.gravity.y = 550
        this.score = 0

        let fullScreenButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.ONE)
        fullScreenButton.onDown.add(this.toogleFullScreen, this)

        let screenshotButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.P)
        screenshotButton.onDown.add(this.takeScreenShot, this)

        this.createMap()
        this.createPlayer()

        this.cretateHud()
        this.createLife()

		this.createCoins() // deve ser apos o createMap()
        this.createCheckPoints()

        this.createEnemies()
        this.trophy = new Trophy(this.game)
        this.game.add.existing(this.trophy)
        this.game.camera.flash(0x000000, 1000)
        // ao passar sobre o tile da bandeira -> troca de level
        this.map.setTileIndexCallback(19,this.loadNextLevel, this)
        this.levelCleared = false
        this.addScore(0)

        ServerComm.loadState(Config.nameUser,  Config.nameGame, 'load-state', Config.level, (response) => carregarEstado(response) )
        
    }



    loadNextLevel() {
        if (!this.levelCleared) {
            this.levelCleared = true
            this.game.camera.fade(0x000000, 1000)
            this.game.camera.onFadeComplete.add(this.changeLevel, this)
        }
    }

    changeLevel() {
        Config.LEVEL += 1
        Config.SCORE = this.score
        this.game.camera.onFadeComplete.removeAll(this)// bug
        if(Config.Level==4){
            this.game.state.start('Venceu')
        }else{
            if (Config.LEVEL <= 3){
                this.game.state.restart()
            }else{
                this.game.state.start('Title')
            }
        }
    }


    takeScreenShot() {
        // jQuery
        let imgData = this.game.canvas.toDataURL()

        $('#div-screenshot').append(
            `<img src=${imgData} alt='game screenshot' class='screenshot'>`
            )        
    }

    toogleFullScreen() {
        this.game.scale.fullScreenScaleMode =  Phaser.ScaleManager.EXACT_FIT;
        if (this.game.scale.isFullScreen)
            this.game.scale.stopFullScreen()
        else
            this.game.scale.startFullScreen(false)
    }

    update() {
        // colisao do player com o mapa
        this.game.physics.arcade.collide(this.player, this.mapLayer)
        //this.game.physics.arcade.collide(this.player, this.mapLayer2)
        // colisao do player com a camada de armadilhas
        this.game.physics.arcade.collide(this.player, this.mapLayer2 , this.playerDied, null, this)

        this.game.physics.arcade.overlap(this.player, this.checkpoints, this.collectCheckPoints, null, this)
        // colisao do player com o grupo de moedas
        this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this)

        this.game.physics.arcade.overlap( this.player, this.vida, this.collectVida, null, this)
        // colisao do player com inimigos
        this.game.physics.arcade.overlap(this.player, this.joaninhas, this.playerDied, null, this)
        this.game.physics.arcade.overlap(this.player, this.serra, this.playerDied, null, this)
        this.game.physics.arcade.overlap(this.player, this.abrirBoca, this.playerDied, null, this)

       // this.game.physics.arcade.overlap(this.player, this.checkPoints, this.collectCheckPoints, null, this)
   }

   collectCoin(player, coin) {
        // destroi permanentemente o objeto
        coin.destroy() 
        // esconde o objeto e desliga colisao (para reuso futuro)
        this.addScore(coin.points)
        if(this.score==1){
            this.trophy.show('first diamond')   
        }
        if(this.score==200){
            this.trophy.show('all diamonds')   
        }
    }

    collectCheckPoints(player, checkpoints){
// console.log("Check")

        this.savePosicao = {}
        this.savePosicao['x']=checkpoints.x
        this.savePosicao['y']=checkpoints.y      

        checkpoints.destroy()

        ServerComm.saveState(Config.nameUser, Config.nameGame,  this.savePosicao, Config.Level,     (response) => salvarPos(response))
        
    }
    salvarPos(){
        if(response['response'] = 'ok'){
           Config.CurrentX=checkpoints.x
           Config.CurrentY=checkpoints.y
       }

   }

   collectVida(player, vida) {
        // esconde o objeto e desliga colisao (para reuso futuro)
        if(this.life == 2){
            this.life3 = this.game.add.sprite(10,10,'life3')
            this.life3.fixedToCamera = true
            this.life = this.life+1
        }
        else if(this.life == 1){
            this.life2 = this.game.add.sprite(10, 10,'life2')
            this.life2.fixedToCamera = true
            this.life = this.life+1
        }
        if(this.vidas==1)
        {
            this.trophy.show('you collect a life')   
            this.vidas=0
        }

    }

    playerDied() {
        console.log('player died')     
        this.life=this.life-1;

        if(this.life==0)
        {
            this.trophy.show('you lose') 

            Config.SCORE = 0
            Config.LEVEL = 1

        // evitar bug de levar o callback para outra tela (state)
        this.game.camera.onFadeComplete.removeAll(this)
        this.game.state.start('Derrota')

    }else if(this.life == 2){
        this.life3.destroy()
        this.trophy.show('first death') 
    }else if(this.life == 1){
        this.life2.destroy()
    }  

    if (Config.LEVEL == 1) {
        this.player.x = 50
        this.player.y = 500
    }else if (Config.LEVEL == 2) {
        this.player.x = 6000
        this.player.y = 7000
    }else  if (Config.LEVEL == 3) {
        this.player.x = 50
        this.player.y = 500
    }  

    this.camera.shake(0.02, 500)
}

render() {
    if (Config.DEBUG) {
        this.game.debug.body(this.player)
    }
}
}

window.onload = function() {
    // funciona como singleton
    const GAME = new Game()
}

class Derrota extends GameState {
    preload() {
        let dir = Config.ASSETS
        this.game.load.image('perdeu',`${dir}perdeu.png`); 
        console.log('PERDEU') 
    }

    create() {
        super.create()

        this.imgTitle = this.game.add.image(0, 0, 'perdeu')
        this.imgTitle.anchor.setTo(0.5, 0.5)
        this.imgTitle.x = this.game.width/2
        this.imgTitle.y = 150

        this.pressStart = this.game.add.text(0, 0,
            'Press to Restart the game' ,
            {fontSize: '16px', fill: '#ffffff'} )
        this.pressStart.anchor.setTo(0.5, 0.5)
        this.pressStart.x = this.game.width/2
        this.pressStart.y = 300


        let startButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.ENTER)
        
        startButton.onDown.add(this.startFade, this)

        // qualquer tecla muda para a proxima cena
        //this.game.input.onDown.add(this.startFade, this)

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
        var x = document.getElementById('labelNovo');
        // x.value='ONLINE'

        // if (!this.pressed && x.value=='ONLINE') {
            if (!this.pressed ) {
                this.pressed = true
                this.game.camera.fade(0x000000, 1000)
                this.game.camera.onFadeComplete.add(this.startGame, this)


            }
        }

        startGame() {
        // preparar o jogo
        // reset de highscore e controle de carregamento de estado do servidor
        Config.SCORE = 0
        Config.LEVEL = 1

        // evitar bug de levar o callback para outra tela (state)
        this.game.camera.onFadeComplete.removeAll(this)
        this.game.state.start('Play')

        //this.
    }


    update() {
    }
}


class Venceu extends GameState {
    preload() {
        let dir = Config.ASSETS
        this.game.load.image('venceu',`${dir}Venceu.png`); 
        console.log('Parabéns Voĉe Venceu') 
    }

    create() {
        super.create()

        this.imgTitle = this.game.add.image(0, 0, 'venceu')
        this.imgTitle.anchor.setTo(0.5, 0.5)
        this.imgTitle.x = this.game.width/2
        this.imgTitle.y = 150

        this.pressStart = this.game.add.text(0, 0,
            'Press to Restart game' ,
            {fontSize: '16px', fill: '#ffffff'} )
        this.pressStart.anchor.setTo(0.5, 0.5)
        this.pressStart.x = this.game.width/2
        this.pressStart.y = 300


        let startButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.ENTER)
        
        startButton.onDown.add(this.startFade, this)

        // qualquer tecla muda para a proxima cena
        //this.game.input.onDown.add(this.startFade, this)

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
        var x = document.getElementById('labelNovo');
        // x.value='ONLINE'

        if (!this.pressed ) {
            this.pressed = true
            this.game.camera.fade(0x000000, 1000)
            this.game.camera.onFadeComplete.add(this.startGame, this)
        }
    }

    startGame() {
        // preparar o jogo
        // reset de highscore e controle de carregamento de estado do servidor
        Config.SCORE = 0
        Config.LEVEL = 1

        // evitar bug de levar o callback para outra tela (state)
        this.game.camera.onFadeComplete.removeAll(this)
        this.game.state.start('Play')
    }



    update() {
    }
}
