class Config {}
Config.WIDTH = 800
Config.HEIGHT= 480
Config.DEBUG = false
Config.ANTIALIAS = false
Config.ASSETS = 'assets/'
Config.CONTAINER_WIDTH  = Config.CONTAINER_HEIGHT * Config.RATIO
Config.CONTAINER_HEIGHT = 480
Config.RATIO = 1.77


var user_id = 'default-user'

class Game extends Phaser.Game {
    constructor() {
        super(Config.WIDTH, Config.HEIGHT, Phaser.CANVAS,
            'game-container', null, false, Config.ANTIALIAS)

        this.state.add('Play', PlayState, false)
        this.state.add('PlayTwo', PlayStateTwo, false)
        this.state.add('PlayThree', PlayStateThree, false)
        this.state.add('Level', LevelState, false)
        this.state.add('Title', TitleState, false)
        this.state.add('GameOver', GameOverState, false)        
        this.state.add('End', EndState, false)        
        this.state.start('Title')
    }
}

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
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE

        this.game.scale.setResizeCallback(function(scale, parentBounds) {
            let scaleX = Config.CONTAINER_WIDTH / Config.WIDTH
            let scaleY = Config.CONTAINER_HEIGHT / Config.HEIGHT

            this.game.scale.setUserScale(scaleX, scaleY, 0, 0)
        }, this)        
    }
}


class PlayStateThree extends Phaser.State {

    /* Método padrão de pré carregamento 
       Neste, adicionamos todos os recursos audiovisuais,
       além de algumas definições pré estabelecidas.
       */
       preload() {
        this.playerDied = 0
        this.displayText = null;
        this.checkpoint_x = 955
        this.checkpoint_y = 660
        let dir = Config.ASSETS
        /* Mapa */
        this.game.load.tilemap('level_village_three', `${dir}level_village_three.json`, 
            null, Phaser.Tilemap.TILED_JSON);
        /* Tilesets & Sprites */
        this.game.load.image('tiles-blocks',`${dir}blocks.png`);
        this.game.load.image('tiles-scenario',`${dir}scenario.png`);
        this.game.load.image('tiles-houses',`${dir}houses.png`);
        this.game.load.image('tiles-items',`${dir}items.png`);
        this.game.load.spritesheet('bone',`${dir}bone.png`, 30, 30);
        this.game.load.spritesheet('newspaper',`${dir}newspaper.png`, 32, 32);
        /* Personagem */
        this.game.load.spritesheet('player',`${dir}dog.png`, 33, 33);
        this.game.load.spritesheet('frog',`${dir}frog.png`, 16, 16);

        /* Audios */
        this.game.load.audio('bark', [`${dir}bark.mp3`, `${dir}bark.ogg`]);
        /* Fontes */
        this.game.load.image('trophy',`${dir}trophy-200x64.png`);
    }


    /* Método de criação do jogador 
       Instanciamos a classe do jogador, de acordo com suas respectivas coordenadas
       */
       createPlayer() {
        this.player = new Player(this.game, this.keys, this.checkpoint_x, this.checkpoint_y, 'player')
        this.game.add.existing(this.player)
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON); 
    }

    /* Método de criação do mapa do level 
       Os tilesets são adicionados, incluindo as texturas e blocos de colisão.
       */
       createMap() {
        /* O mapa e as suas respectivas layers podem ser vizualizadas
           através do Tilemap Editor. O arquivo fonte é o 'level_village.tmx'
           Baixe o software em: http://www.mapeditor.org/
           */

           /* Chave para o arquivo .JSON do mapa */
           this.map = this.game.add.tilemap('level_village_three')

           /* Chaves para os arquivos .PNG do mapa */
           this.map.addTilesetImage('tiles-scenario')
           this.map.addTilesetImage('tiles-blocks')
           this.map.addTilesetImage('tiles-houses')
           this.map.addTilesetImage('tiles-items')

           /* Layer dos objetos que são obstáculos (com colisão e dano) */
           this.deathBlocksLayer = this.map.createLayer('DeathBlocks')
           /* Layer dos objetos que não são blocos (apenas cenário) */
           this.nonBlocksLayer = this.map.createLayer('NonBlocksBackground')
           this.nonBlocksLayer = this.map.createLayer('NonBlocks')
           /* Layer dos objetos que são blocos (com colisão) */
           this.blocksLayer = this.map.createLayer('Blocks')
           /* Layer dos objetos que são checkpoints */
           this.checkpointsLayer = this.map.createLayer('Checkpoints')
           /* Colisão com os checkpoints (função defineCheckpoint é chamada) */
           this.map.setTileIndexCallback(9,this.defineCheckpoint,this,'Checkpoints')

           /* Definido colisão para os tilesets */
           this.map.setCollision([107,108,114,115,58,59], true, this.deathBlocksLayer)
           this.map.setCollisionBetween(52, 317, true, this.blocksLayer)
           this.map.setCollision(9, false, this.checkpointsLayer)

           this.deathBlocksLayer.resizeWorld()
           this.blocksLayer.resizeWorld()
       }

    /* Método padrão de criação do jogo  
       Nele definimos algumas classes e métodos auxiliares, e chamamos as instâncias responsáveis
       pelo jogador, mapa, botões e afins.
       */
       create() {
        //ServerComm.loadState(user_id, (response) => this.getCheckpoint(response))
        this.current_time = this.current_time + 10;
        this.game.canvas.id = 'canvas';
        /* Adicionando música ao jogo */

        /* Definição do sistema de físicas: jogos arcade */
        this.game.physics.startSystem(Phaser.Physics.ARCADE)

        /* Definições auxiliares */
        this.game.stage.backgroundColor = '#699EFC'
        this.keys = this.game.input.keyboard.createCursorKeys()
        let fullScreenButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.ONE)
        fullScreenButton.onDown.add(this.toogleFullScreen, this)
        let checkpointButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.C)
        checkpointButton.onDown.add(this.returnCheckpoint, this)
        let printButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.P)
        printButton.onDown.add(this.printScreen, this)
        let quitButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.Q)
        quitButton.onDown.add(this.quitGame, this)
        this.game.physics.arcade.gravity.y = 550
        this.score = 0

        /* Atualizando o relógio */
        this.current_time = 0;
        this.timer;
        this.timer = this.game.time.create(false);
        this.timer.loop(1000, this.updateClock, this);
        this.timer.start();

        /* Execução de métodos e classes auxiliares */
        this.createMap()
        this.createPlayer()
        this.createBones()
        this.createNewspaper()
        this.cretateHud()
        this.createEnemies()
        //listTrophies()
        //listLeaders()
        //listPrintScreen()
        this.trophy = new Trophy(this.game)
        this.game.add.existing(this.trophy)
    }

    /* Método padrão responsável por atualizar cada frame e aplicar as respectivas colisões */
    update() {
        if(this.player.y > this.world.height - this.player.body.height)
            this.restartGame()

        /* Colisão com a layer de blocos */
        this.game.physics.arcade.collide(this.player, this.blocksLayer)
        /* Colisão com a layer de checkpoints */
        this.game.physics.arcade.collide(this.player, this.checkpointsLayer)
        /* Colisão com a layer de obstáculos (função restartGame é chamada) */
        this.game.physics.arcade.collide(
            this.player, this.deathBlocksLayer, this.restartGame, null, this)

        // colisao do player com o grupo de moedas
        this.game.physics.arcade.overlap(
            this.player, this.bones, this.collectBone, null, this)
        this.game.physics.arcade.overlap(
            this.player, this.newspaper, this.collectNewspaper, null, this)
    }

    createEnemies() {
        this.frogs = this.game.add.group()
        // 51 eh o indice do tile
        this.map.createFromObjects('Enemies', 486, 'frog',
                        0, true, false, this.frogs, Frog) 
        this.frogs.forEach( (frog) => frog.start() )       
    }

    /* Método auxiliar de reprodução de música */
    playMusic(music_id) {
        var music;
        music = this.game.add.audio(music_id);
        music.play();
    }

    /* Método auxiliar de criação de textos in-game
    Acompanha na sequência o método de destruição, responsável por remover o texto */
    createText(text, duration) {
        if(this.displayText == null) {
            var style = { font: "20px Arial", fill: "#fff", fontWeight: "bold"};
            this.displayText = this.game.add.text(this.player.x, this.player.y, text, style);
            this.time.events.add(duration, this.destroyText, this)
        }
    }

    destroyText() {
        this.displayText.destroy()
        this.displayText = null;
    }

    /* Método auxiliar para reprodução do jogo em tela cheia */
    toogleFullScreen() {
        this.game.scale.fullScreenScaleMode = 
        Phaser.ScaleManager.EXACT_FIT;
        if (this.game.scale.isFullScreen)
            this.game.scale.stopFullScreen()
        else
            this.game.scale.startFullScreen(false)
    }

    /* Método auxiliar para reiniciar o jogo (caso o player morra/aceite o checkpoint) */
    restartGame() {
        this.playerDied = this.playerDied + 1
        if (this.playerDied >= 3) {
            this.playerDied = 0
            this.game.state.start('GameOver')
        }

        this.skyColors = ['#699EFC','#0f0f0f','#ffc37a']
        this.game.stage.backgroundColor = this.skyColors[Math.floor(Math.random() * this.skyColors.length)]
        this.returnCheckpoint()
    }

    /* Método auxiliar para definir um novo checkpoint */
    defineCheckpoint() {
        if(this.checkpoint_x != this.player.x && this.checkpoint_y != this.player.y && this.player.body.onFloor()) {
            this.createText('CHECKPOINT', 800)
            this.setCheckpoint()
        }
    }

    setCheckpoint() {
        this.checkpoint_x = this.player.x
        this.checkpoint_y = this.player.y
    }

    /* Método auxiliar para retornar o jogador ao último checkpoint */
    returnCheckpoint() {
        this.trophy.show('corrida_contra_o_tempo')
        this.player.x = this.checkpoint_x;
        this.player.y = this.checkpoint_y;
        this.camera.flash(0x000000)
    }

    getCheckpoint(response) {
        if(response['response'] == 'ok'){
            let cood = response['data'].split(',');
            let x = parseInt(cood[0].replace('{"x":',''))
            let y = parseInt((cood[1].replace('"y":','')).replace('}',''))
            this.checkpoint_x = x;
            this.checkpoint_y = y;
            this.player.x = this.checkpoint_x;
            this.player.y = this.checkpoint_y;
        }
    }

    printScreen() {
        var canvas = document.getElementById("canvas");
        checkPrintScreen('', canvas.toDataURL())
    }

    updateClock() {
        if(this.current_time == 30){
            this.trophy.show('corra_enquanto_ha_tempo')
        }
        this.current_time++;
        this.timerText.text = "Tempo: " + this.current_time ;
    }

    /* Método para criar os ossos (grupo e layer) */
    createBones() {
        this.bones = this.game.add.group()
        /* 1 é o ID do Bone */
        this.map.createFromObjects('Bones', 1, 'bone',
            0, true, false, this.bones, Bone)
    }

    /* Método chamado quando o jogador passa por um osso */
    collectBone(player, bone) {
        bone.destroy()
        this.addScore(bone.points)
    }

    /* Método para criar os jornais (grupo e layer) */
    createNewspaper() {
        this.newspaper = this.game.add.group()
        /* 2 é o ID do Jornal */
        this.map.createFromObjects('Newspaper', 2, 'newspaper',
            0, true, false, this.newspaper, Newspaper)
    }

    /* Método chamado quando o jogador passa por um jornal */
    collectNewspaper(player, newspaper) {
        newspaper.destroy()
        this.addScore(newspaper.points)
    }

    cretateHud() {
        var style = { font: "20px Arial", fill: "#fff", fontWeight: "bold"};
        this.scoreText = this.game.add.text(16, 20, "Pontos: ", style);
        this.timerText = this.game.add.text(16, 43, "Tempo: ", style);
        this.timerText.fixedToCamera = true;
        this.scoreText.fixedToCamera = true;        
    }

    quitGame() {
        this.game.state.start('GameOver')
    }

    addScore(amount) {
        if(this.score == 10)
            this.trophy.show('colecionador_de_ossos')

        if(this.score == 50)
            this.trophy.show('bom_pra_cachorro')

        this.score += amount
        this.scoreText.text = "Pontos: " + this.score
    }

    render() {
        if (Config.DEBUG) {
            this.game.debug.body(this.player)
        }
    }
}

class PlayStateTwo extends Phaser.State {

    /* Método padrão de pré carregamento 
       Neste, adicionamos todos os recursos audiovisuais,
       além de algumas definições pré estabelecidas.
       */
       preload() {
        this.playerDied = 0
        this.displayText = null;
        this.checkpoint_x = 100
        this.checkpoint_y = 630
        let dir = Config.ASSETS
        /* Mapa */
        this.game.load.tilemap('level_village_two', `${dir}level_village_two.json`, 
            null, Phaser.Tilemap.TILED_JSON);
        /* Tilesets & Sprites */
        this.game.load.image('tiles-blocks',`${dir}blocks.png`);
        this.game.load.image('tiles-scenario',`${dir}scenario.png`);
        this.game.load.image('tiles-houses',`${dir}houses.png`);
        this.game.load.image('tiles-items',`${dir}items.png`);
        this.game.load.spritesheet('bone',`${dir}bone.png`, 30, 30);
        this.game.load.spritesheet('frog',`${dir}frog.png`, 16, 16);

        this.game.load.spritesheet('newspaper',`${dir}newspaper.png`, 32, 32);
        /* Personagem */
        this.game.load.spritesheet('player',`${dir}dog.png`, 33, 33);
        /* Audios */
        this.game.load.audio('bark', [`${dir}bark.mp3`, `${dir}bark.ogg`]);
        /* Fontes */
        this.game.load.image('trophy',`${dir}trophy-200x64.png`);
    }


    /* Método de criação do jogador 
       Instanciamos a classe do jogador, de acordo com suas respectivas coordenadas
       */
       createPlayer() {
        this.player = new Player(this.game, this.keys, this.checkpoint_x, this.checkpoint_y, 'player')
        this.game.add.existing(this.player)
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON); 
    }

    createEnemies() {
        this.frogs = this.game.add.group()
        // 51 eh o indice do tile
        this.map.createFromObjects('Enemies', 486, 'frog',
                        0, true, false, this.frogs, Frog) 
        this.frogs.forEach( (frog) => frog.start() )       
    }

    /* Método de criação do mapa do level 
       Os tilesets são adicionados, incluindo as texturas e blocos de colisão.
       */
       createMap() {
        /* O mapa e as suas respectivas layers podem ser vizualizadas
           através do Tilemap Editor. O arquivo fonte é o 'level_village.tmx'
           Baixe o software em: http://www.mapeditor.org/
           */

           /* Chave para o arquivo .JSON do mapa */
           this.map = this.game.add.tilemap('level_village_two')

           /* Chaves para os arquivos .PNG do mapa */
           this.map.addTilesetImage('tiles-scenario')
           this.map.addTilesetImage('tiles-blocks')
           this.map.addTilesetImage('tiles-houses')
           this.map.addTilesetImage('tiles-items')

           /* Layer dos objetos que são obstáculos (com colisão e dano) */
           this.deathBlocksLayer = this.map.createLayer('DeathBlocks')
           /* Layer dos objetos que não são blocos (apenas cenário) */
           this.nonBlocksLayer = this.map.createLayer('NonBlocksBackground')
           this.nonBlocksLayer = this.map.createLayer('NonBlocks')
           /* Layer dos objetos que são blocos (com colisão) */
           this.blocksLayer = this.map.createLayer('Blocks')
           /* Layer dos objetos que são checkpoints */
           this.checkpointsLayer = this.map.createLayer('Checkpoints')
           /* Colisão com os checkpoints (função defineCheckpoint é chamada) */
           this.map.setTileIndexCallback(9,this.defineCheckpoint,this,'Checkpoints')

           /* Definido colisão para os tilesets */
           this.map.setCollision([107,108,114,115,58,59], true, this.deathBlocksLayer)
           this.map.setCollisionBetween(52, 317, true, this.blocksLayer)
           this.map.setCollision(9, false, this.checkpointsLayer)

           this.deathBlocksLayer.resizeWorld()
           this.blocksLayer.resizeWorld()
       }

    /* Método padrão de criação do jogo  
       Nele definimos algumas classes e métodos auxiliares, e chamamos as instâncias responsáveis
       pelo jogador, mapa, botões e afins.
       */
       create() {
        //ServerComm.loadState(user_id, (response) => this.getCheckpoint(response))
        this.current_time = this.current_time + 10;
        this.game.canvas.id = 'canvas';
        /* Adicionando música ao jogo */

        /* Definição do sistema de físicas: jogos arcade */
        this.game.physics.startSystem(Phaser.Physics.ARCADE)

        /* Definições auxiliares */
        this.game.stage.backgroundColor = '#699EFC'
        this.keys = this.game.input.keyboard.createCursorKeys()
        let fullScreenButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.ONE)
        fullScreenButton.onDown.add(this.toogleFullScreen, this)
        let checkpointButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.C)
        checkpointButton.onDown.add(this.returnCheckpoint, this)
        let printButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.P)
        printButton.onDown.add(this.printScreen, this)
        let quitButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.Q)
        quitButton.onDown.add(this.quitGame, this)
        this.game.physics.arcade.gravity.y = 550
        this.score = 0

        /* Atualizando o relógio */
        this.current_time = 0;
        this.timer;
        this.timer = this.game.time.create(false);
        this.timer.loop(1000, this.updateClock, this);
        this.timer.start();

        /* Execução de métodos e classes auxiliares */
        this.createMap()
        this.createPlayer()
        this.createBones()
        this.createNewspaper()
        this.cretateHud()
        this.createEnemies()
        //listTrophies()
        //listLeaders()
        //listPrintScreen()
        this.trophy = new Trophy(this.game)
        this.game.add.existing(this.trophy)
    }

    /* Método padrão responsável por atualizar cada frame e aplicar as respectivas colisões */
    update() {
        if(this.player.y > this.world.height - this.player.body.height)
            this.restartGame()

        /* Colisão com a layer de blocos */
        this.game.physics.arcade.collide(this.player, this.blocksLayer)
        /* Colisão com a layer de checkpoints */
        this.game.physics.arcade.collide(this.player, this.checkpointsLayer)
        /* Colisão com a layer de obstáculos (função restartGame é chamada) */
        this.game.physics.arcade.collide(
            this.player, this.deathBlocksLayer, this.restartGame, null, this)

        // colisao do player com o grupo de moedas
        this.game.physics.arcade.overlap(
            this.player, this.bones, this.collectBone, null, this)
        this.game.physics.arcade.overlap(
            this.player, this.newspaper, this.collectNewspaper, null, this)
    }

    /* Método auxiliar de reprodução de música */
    playMusic(music_id) {
        var music;
        music = this.game.add.audio(music_id);
        music.play();
    }

    /* Método auxiliar de criação de textos in-game
    Acompanha na sequência o método de destruição, responsável por remover o texto */
    createText(text, duration) {
        if(this.displayText == null) {
            var style = { font: "20px Arial", fill: "#fff", fontWeight: "bold"};
            this.displayText = this.game.add.text(this.player.x, this.player.y, text, style);
            this.time.events.add(duration, this.destroyText, this)
        }
    }

    destroyText() {
        this.displayText.destroy()
        this.displayText = null;
    }

    /* Método auxiliar para reprodução do jogo em tela cheia */
    toogleFullScreen() {
        this.game.scale.fullScreenScaleMode = 
        Phaser.ScaleManager.EXACT_FIT;
        if (this.game.scale.isFullScreen)
            this.game.scale.stopFullScreen()
        else
            this.game.scale.startFullScreen(false)
    }

    /* Método auxiliar para reiniciar o jogo (caso o player morra/aceite o checkpoint) */
    restartGame() {
        this.playerDied = this.playerDied + 1
        if (this.playerDied >= 3) {
            this.playerDied = 0
            //ServerComm.gameOver(user_id, this.score, 
            //    (response) => scoreSaved(response))
            this.game.state.start('GameOver')
        }

        this.skyColors = ['#699EFC','#0f0f0f','#ffc37a']
        this.game.stage.backgroundColor = this.skyColors[Math.floor(Math.random() * this.skyColors.length)]
        this.returnCheckpoint()
    }

    /* Método auxiliar para definir um novo checkpoint */
    defineCheckpoint() {
        if(this.checkpoint_x != this.player.x && this.checkpoint_y != this.player.y && this.player.body.onFloor()) {
            this.createText('CHECKPOINT', 800)
            //ServerComm.saveState(user_id, {x: this.player.x, y: this.player.y}, 
            //    (response) => this.setCheckpoint(response))
            this.setCheckpoint()
        }
        return true
    }

    setCheckpoint() {
        this.checkpoint_x = this.player.x
        this.checkpoint_y = this.player.y
    }

    /* Método auxiliar para retornar o jogador ao último checkpoint */
    returnCheckpoint() {
        this.trophy.show('corrida_contra_o_tempo')
        this.player.x = this.checkpoint_x;
        this.player.y = this.checkpoint_y;
        this.camera.flash(0x000000)
    }

    getCheckpoint(response) {
        if(response['response'] == 'ok'){
            let cood = response['data'].split(',');
            let x = parseInt(cood[0].replace('{"x":',''))
            let y = parseInt((cood[1].replace('"y":','')).replace('}',''))
            this.checkpoint_x = x;
            this.checkpoint_y = y;
            this.player.x = this.checkpoint_x;
            this.player.y = this.checkpoint_y;
        }
    }

    printScreen() {
        var canvas = document.getElementById("canvas");
        //ServerComm.saveMedia(user_id, {mimeType: 'image/png', src: canvas.toDataURL()}, 
          //  (response) => checkPrintScreen(response, canvas.toDataURL()))
        checkPrintScreen('', canvas.toDataURL())
    }

    updateClock() {
        if(this.current_time == 30){
            this.trophy.show('corra_enquanto_ha_tempo')
        }
        this.current_time++;
        this.timerText.text = "Tempo: " + this.current_time ;
    }

    /* Método para criar os ossos (grupo e layer) */
    createBones() {
        this.bones = this.game.add.group()
        /* 1 é o ID do Bone */
        this.map.createFromObjects('Bones', 1, 'bone',
            0, true, false, this.bones, Bone)
    }

    /* Método chamado quando o jogador passa por um osso */
    collectBone(player, bone) {
        bone.destroy()
        this.addScore(bone.points)
    }

    /* Método para criar os jornais (grupo e layer) */
    createNewspaper() {
        this.newspaper = this.game.add.group()
        /* 2 é o ID do Jornal */
        this.map.createFromObjects('Newspaper', 2, 'newspaper',
            0, true, false, this.newspaper, Newspaper)
    }

    /* Método chamado quando o jogador passa por um jornal */
    collectNewspaper(player, newspaper) {
        newspaper.destroy()
        this.addScore(newspaper.points)
    }

    cretateHud() {
        var style = { font: "20px Arial", fill: "#fff", fontWeight: "bold"};
        this.scoreText = this.game.add.text(16, 20, "Pontos: ", style);
        this.timerText = this.game.add.text(16, 43, "Tempo: ", style);
        this.timerText.fixedToCamera = true;
        this.scoreText.fixedToCamera = true;        
    }

    quitGame() {
        //ServerComm.gameOver(user_id, this.score, 
                //(response) => scoreSaved(response))
        this.game.state.start('GameOver')
    }

    addScore(amount) {
        if(this.score == 10)
            this.trophy.show('colecionador_de_ossos')

        if(this.score == 50)
            this.trophy.show('bom_pra_cachorro')

        this.score += amount
        this.scoreText.text = "Pontos: " + this.score
    }

    render() {
        if (Config.DEBUG) {
            this.game.debug.body(this.player)
        }
    }
}

class PlayState extends Phaser.State {

    /* Método padrão de pré carregamento 
       Neste, adicionamos todos os recursos audiovisuais,
       além de algumas definições pré estabelecidas.
       */
       preload() {
        this.playerDied = 0
        this.displayText = null;
        this.checkpoint_x = 955
        this.checkpoint_y = 660
        let dir = Config.ASSETS
        /* Mapa */
        this.game.load.tilemap('level_village', `${dir}level_village.json`, 
            null, Phaser.Tilemap.TILED_JSON);
        /* Tilesets & Sprites */
        this.game.load.image('tiles-blocks',`${dir}blocks.png`);
        this.game.load.image('tiles-scenario',`${dir}scenario.png`);
        this.game.load.image('tiles-houses',`${dir}houses.png`);
        this.game.load.image('tiles-items',`${dir}items.png`);
        this.game.load.spritesheet('bone',`${dir}bone.png`, 30, 30);
        this.game.load.spritesheet('newspaper',`${dir}newspaper.png`, 32, 32);
        /* Personagem */
        this.game.load.spritesheet('player',`${dir}dog.png`, 33, 33);
        this.game.load.spritesheet('frog',`${dir}frog.png`, 16, 16);

        /* Audios */
        this.game.load.audio('bark', [`${dir}bark.mp3`, `${dir}bark.ogg`]);
        /* Fontes */
        this.game.load.image('trophy',`${dir}trophy-200x64.png`);
    }


    /* Método de criação do jogador 
       Instanciamos a classe do jogador, de acordo com suas respectivas coordenadas
       */
       createPlayer() {
        this.player = new Player(this.game, this.keys, this.checkpoint_x, this.checkpoint_y, 'player')
        this.game.add.existing(this.player)
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON); 
    }


    /* Método de criação do mapa do level 
       Os tilesets são adicionados, incluindo as texturas e blocos de colisão.
       */
       createMap() {
        /* O mapa e as suas respectivas layers podem ser vizualizadas
           através do Tilemap Editor. O arquivo fonte é o 'level_village.tmx'
           Baixe o software em: http://www.mapeditor.org/
           */

           /* Chave para o arquivo .JSON do mapa */
           this.map = this.game.add.tilemap('level_village')

           /* Chaves para os arquivos .PNG do mapa */
           this.map.addTilesetImage('tiles-scenario')
           this.map.addTilesetImage('tiles-blocks')
           this.map.addTilesetImage('tiles-houses')
           this.map.addTilesetImage('tiles-items')

           /* Layer dos objetos que são obstáculos (com colisão e dano) */
           this.deathBlocksLayer = this.map.createLayer('DeathBlocks')
           /* Layer dos objetos que não são blocos (apenas cenário) */
           this.nonBlocksLayer = this.map.createLayer('NonBlocksBackground')
           this.nonBlocksLayer = this.map.createLayer('NonBlocks')
           /* Layer dos objetos que são blocos (com colisão) */
           this.blocksLayer = this.map.createLayer('Blocks')
           /* Layer dos objetos que são checkpoints */
           this.checkpointsLayer = this.map.createLayer('Checkpoints')
           /* Colisão com os checkpoints (função defineCheckpoint é chamada) */
           this.map.setTileIndexCallback(9,this.defineCheckpoint,this,'Checkpoints')

           /* Definido colisão para os tilesets */
           this.map.setCollision([107,108,114,115,58,59], true, this.deathBlocksLayer)
           this.map.setCollisionBetween(52, 317, true, this.blocksLayer)
           this.map.setCollision(9, false, this.checkpointsLayer)

           this.deathBlocksLayer.resizeWorld()
           this.blocksLayer.resizeWorld()
       }

    /* Método padrão de criação do jogo  
       Nele definimos algumas classes e métodos auxiliares, e chamamos as instâncias responsáveis
       pelo jogador, mapa, botões e afins.
       */
       create() {
        //ServerComm.loadState(user_id, (response) => this.getCheckpoint(response))
        this.current_time = this.current_time + 10;
        this.game.canvas.id = 'canvas';
        /* Adicionando música ao jogo */

        /* Definição do sistema de físicas: jogos arcade */
        this.game.physics.startSystem(Phaser.Physics.ARCADE)

        /* Definições auxiliares */
        this.game.stage.backgroundColor = '#699EFC'
        this.keys = this.game.input.keyboard.createCursorKeys()
        let fullScreenButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.ONE)
        fullScreenButton.onDown.add(this.toogleFullScreen, this)
        let checkpointButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.C)
        checkpointButton.onDown.add(this.returnCheckpoint, this)
        let printButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.P)
        printButton.onDown.add(this.printScreen, this)
        let quitButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.Q)
        quitButton.onDown.add(this.quitGame, this)
        this.game.physics.arcade.gravity.y = 550
        this.score = 0

        /* Atualizando o relógio */
        this.current_time = 0;
        this.timer;
        this.timer = this.game.time.create(false);
        this.timer.loop(1000, this.updateClock, this);
        this.timer.start();

        /* Execução de métodos e classes auxiliares */
        this.createMap()
        this.createPlayer()
        this.createBones()
        this.createNewspaper()
        this.cretateHud()
        //this.createEnemies()
        //listTrophies()
        //listLeaders()
        //listPrintScreen()
        this.trophy = new Trophy(this.game)
        this.game.add.existing(this.trophy)
    }

    /* Método padrão responsável por atualizar cada frame e aplicar as respectivas colisões */
    update() {
        if(this.player.y > this.world.height - this.player.body.height)
            this.restartGame()

        /* Colisão com a layer de blocos */
        this.game.physics.arcade.collide(this.player, this.blocksLayer)
        /* Colisão com a layer de checkpoints */
        this.game.physics.arcade.collide(this.player, this.checkpointsLayer)
        /* Colisão com a layer de obstáculos (função restartGame é chamada) */
        this.game.physics.arcade.collide(
            this.player, this.deathBlocksLayer, this.restartGame, null, this)

        // colisao do player com o grupo de moedas
        this.game.physics.arcade.overlap(
            this.player, this.bones, this.collectBone, null, this)
        this.game.physics.arcade.overlap(
            this.player, this.newspaper, this.collectNewspaper, null, this)
        this.game.physics.arcade.overlap(
            this.player, this.frogs, this.restartGame, null, this)
    }

    /* Método auxiliar de reprodução de música */
    playMusic(music_id) {
        var music;
        music = this.game.add.audio(music_id);
        music.play();
    }

    /* Método auxiliar de criação de textos in-game
    Acompanha na sequência o método de destruição, responsável por remover o texto */
    createText(text, duration) {
        if(this.displayText == null) {
            var style = { font: "20px Arial", fill: "#fff", fontWeight: "bold"};
            this.displayText = this.game.add.text(this.player.x, this.player.y, text, style);
            this.time.events.add(duration, this.destroyText, this)
        }
    }

    destroyText() {
        this.displayText.destroy()
        this.displayText = null;
    }

    /* Método auxiliar para reprodução do jogo em tela cheia */
    toogleFullScreen() {
        this.game.scale.fullScreenScaleMode = 
        Phaser.ScaleManager.EXACT_FIT;
        if (this.game.scale.isFullScreen)
            this.game.scale.stopFullScreen()
        else
            this.game.scale.startFullScreen(false)
    }

    quitGame() {
        //ServerComm.gameOver(user_id, this.score, 
        //        (response) => scoreSaved(response))
        this.game.state.start('GameOver')
    }

    /* Método auxiliar para reiniciar o jogo (caso o player morra/aceite o checkpoint) */

    restartGame() {
        this.playerDied = this.playerDied + 1
        if (this.playerDied >= 3) {
            //ServerComm.gameOver(user_id, this.score, 
            //    (response) => scoreSaved(response))
            this.playerDied = 0
            this.game.state.start('GameOver')
        }

        this.skyColors = ['#699EFC','#0f0f0f','#ffc37a']
        this.game.stage.backgroundColor = this.skyColors[Math.floor(Math.random() * this.skyColors.length)]
        this.returnCheckpoint()
    }

    /* Método auxiliar para definir um novo checkpoint */
    defineCheckpoint() {
        if(this.checkpoint_x != this.player.x && this.checkpoint_y != this.player.y && this.player.body.onFloor()) {
            this.createText('CHECKPOINT', 800)
            //ServerComm.saveState(user_id, {x: this.player.x, y: this.player.y}, 
                //(response) => this.setCheckpoint(response))
            this.setCheckpoint()
        }
        return true
    }

    setCheckpoint() {
            this.checkpoint_x = this.player.x
            this.checkpoint_y = this.player.y
    }

    /* Método auxiliar para retornar o jogador ao último checkpoint */
    returnCheckpoint() {
        this.trophy.show('corrida_contra_o_tempo')
        this.player.x = this.checkpoint_x;
        this.player.y = this.checkpoint_y;
        this.camera.flash(0x000000)
    }

    getCheckpoint(response) {
        if(response['response'] == 'ok'){
            let cood = response['data'].split(',');
            let x = parseInt(cood[0].replace('{"x":',''))
            let y = parseInt((cood[1].replace('"y":','')).replace('}',''))
            this.checkpoint_x = x;
            this.checkpoint_y = y;
            this.player.x = this.checkpoint_x;
            this.player.y = this.checkpoint_y;
        }
    }

    printScreen() {
        var canvas = document.getElementById("canvas");
        //ServerComm.saveMedia(user_id, {mimeType: 'image/png', src: canvas.toDataURL()}, 
         //   (response) => checkPrintScreen(response, canvas.toDataURL()))
        checkPrintScreen('',canvas.toDataURL())
    }

    updateClock() {
        if(this.current_time == 30){
            this.trophy.show('corra_enquanto_ha_tempo')
        }
        this.current_time++;
        this.timerText.text = "Tempo: " + this.current_time ;
    }

    /* Método para criar os ossos (grupo e layer) */
    createBones() {
        this.bones = this.game.add.group()
        /* 1 é o ID do Bone */
        this.map.createFromObjects('Bones', 1, 'bone',
            0, true, false, this.bones, Bone)
    }

    /* Método chamado quando o jogador passa por um osso */
    collectBone(player, bone) {
        bone.destroy()
        this.addScore(bone.points)
    }

    /* Método para criar os jornais (grupo e layer) */
    createNewspaper() {
        this.newspaper = this.game.add.group()
        /* 2 é o ID do Jornal */
        this.map.createFromObjects('Newspaper', 2, 'newspaper',
            0, true, false, this.newspaper, Newspaper)
    }

    /* Método chamado quando o jogador passa por um jornal */
    collectNewspaper(player, newspaper) {
        newspaper.destroy()
        this.addScore(newspaper.points)
    }

    cretateHud() {
        var style = { font: "20px Arial", fill: "#fff", fontWeight: "bold"};
        this.scoreText = this.game.add.text(16, 20, "Pontos: ", style);
        this.timerText = this.game.add.text(16, 43, "Tempo: ", style);
        this.timerText.fixedToCamera = true;
        this.scoreText.fixedToCamera = true;        
    }

    addScore(amount) {
        if(this.score == 10)
            this.trophy.show('colecionador_de_ossos')

        if(this.score == 50)
            this.trophy.show('bom_pra_cachorro')

        this.score += amount
        this.scoreText.text = "Pontos: " + this.score
    }

    render() {
        if (Config.DEBUG) {
            this.game.debug.body(this.player)
        }
    }
}

function listTrophies() {
    console.log(user_id)
    ServerComm.listTrophy(user_id, (response) => displayTrophy(response));
}

function displayTrophy(response) {
    var trophy = JSON.parse(response['data']);
    var index;

    if(trophy.length > 0) {
        $("#list-group").empty();
    }

    for(index = 0; index < trophy.length; ++index){
        appendTrophy(trophy[index]['title'], trophy[index]['description'],index)
    }  
}

function appendTrophy(trophy_title, trophy_description, index) {
    var  list_group_item = document.createElement("a");
    list_group_item.classList.add('list-group-item');
    list_group_item.id = 'list_group_item-' + index
    document.getElementById('list-group').appendChild(list_group_item);

    var item_header = document.createElement("h4");
    item_header.classList.add('list-group-item-heading');
    item_header.innerHTML = trophy_title
    document.getElementById('list_group_item-' + index).appendChild(item_header);

    var item_header = document.createElement("p");
    item_header.classList.add('list-group-item-text');
    item_header.innerHTML = trophy_description
    document.getElementById('list_group_item-' + index).appendChild(item_header);
}

function listPrintScreen() {
    ServerComm.listMedia(user_id, (response) => displayImages(response));
}


function checkPrintScreen(response, data) {
    appendImage(data)
}

function displayImages(response){
    var images = JSON.parse(response['data']);
    var index;

    if(images.length > 0){
        $("#screenshots").empty();
    }

    for(index = 0; index < images.length; ++index){
        appendImage(images[index]['src'], index)
    }
}

function appendImage(src, i) {
    $("#screen-default").empty();

    var img = document.createElement("IMG");
    img.classList.add('col-md-3');
    img.id = 'screenshot'
    img.src = src;
    img.width = "150";
    img.height = "150";
    document.getElementById('screenshots').appendChild(img);
}

function listLeaders() {
    ServerComm.listPontos(user_id, (response) => displayLeaders(response));    
}

function displayLeaders(response) {
    var leaders = JSON.parse(response['data']);
    var index;

    if(leaders.length > 0){
        $("#list-group-pontuacao").empty();
    }

    for(index = 0; index < leaders.length; ++index){
        appendLeader(leaders[index], index)
    }
}

function appendLeader(leader, index) {
    var  list_group_item = document.createElement("li");
    list_group_item.classList.add('list-group-item');
    list_group_item.id = 'list_group_item-' + index
    document.getElementById('list-group-pontuacao').appendChild(list_group_item);

    var item_header = document.createElement("span");
    item_header.classList.add('badge');
    item_header.innerHTML = leader['pontos']
    document.getElementById('list_group_item-' + index).appendChild(item_header);

    var item_i_header = document.createElement("i");
    item_i_header.classList.add('fa');
    item_i_header.classList.add('fa-user')
    item_i_header.innerHTML = ' ' + leader['id']
    document.getElementById('list_group_item-' + index).appendChild(item_i_header);
}

function scoreSaved(response) {
    console.log('Pontuação salva com sucesso!')
}

const GAME = new Game()
