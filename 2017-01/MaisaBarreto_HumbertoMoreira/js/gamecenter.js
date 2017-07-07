
class Trophy extends Phaser.Sprite {

    constructor(game) {
        super(game, 0, 0, '')

        this.data = {}
        this.data['first death'] = 
        {name: 'first death', xp: 10, 
        title: 'KEEP CALM AND PLAY',
        description: 'First death on game'}
        
        this.data['water death'] = 
        {name: 'water death', xp: 15, 
        title: 'KEEP CALM AND STAY DRY',
        description: 'First death to water'}
        
        this.data['first diamond'] = 
        {name: 'first diamond', xp: 20, 
        title: 'DO YOU WANNA DIAMONDS?',
        description: 'you found first diamond'}
        
        this.data['all diamonds'] = 
        {name: 'all diamonds', xp: 500, 
        title: 'YOU GOTTA THEM',
        description: 'YOU GOTTA EVERY DIAMONDS '}

        this.data['only one emerald'] = 
        {name: 'only one emerald', xp: 1000, 
        title: 'GOTTA FIND THOSE GEMS',
        description: 'get only one emerald'}

        this.data['you lose'] = 
        {name: 'you lose', xp: 1, 
        title: 'YOU LOSE ALL YOUR LIVES',
        description: 'You died 3 times'}


        this.panels = [] // fila de paineis de trofeus
        this.achieved = [] // lista dos nomes do trofeus jah conquistados

        //ServerComm.clearTrophy((r) => console.log( JSON.stringify(r) ) ) 

        // listar os trofeus no servidor e atualizar this.achieved
        ServerComm.listTrophy('jhon', 'penguimsaver', 
            (response) => this.updateAchievedTrophies(response) )
    }

    updateAchievedTrophies(json) {
        // coloca os nomes dos trofeus na lista de controle: this.achieved
        let list = json['data']
        for (let t of list) {
            this.achieved.push(t['name'])
            this.addTrophyOnPage(t['name'])
        }
    }

    addNovo(){
        name = document.getElementById('username').value
        password= document.getElementById('password').value
        novo={}
        novo['password']=password
        novo['email']='email'

        ServerComm.addProfile(name, '', novo,  (response) => this.mudarpagina(response) )
    }

    mudarpagina(response){
        if (response['response'] == 'error') {
            console.log( response['data'])
            return
        }
        if(response['response'] == 'ok'){
            $('#form-login').hide()
            $('#labelNovo').hide()

            var x = document.getElementById('label-logged-in');
            x.style.display = 'block';

            var x = document.getElementById('labelNovo');
            x.value='ONLINE'



        }
    }

    createPanel(trophyName) {
       let panelY = this.game.height - 74 - this.panels.length * 74
       let panel = this.game.add.sprite(this.game.width - 250,
        panelY, 'trophy')
       panel.fixedToCamera = true 
        //panel.alpha = 0

        let labelX = 66
        let labelWidth = panel.width - labelX
        let style = {font: '10px Arial', fill: '#ffffff',
        wordWrap: true, wordWrapWidth: labelWidth}
        let label = this.game.add.text(labelX, 5, '', style)
        label.lineSpacing = -7
        panel.addChild(label)

        // define label
        label.text = this.data[trophyName].title + '   +'
        label.text+= this.data[trophyName].xp + '\n\n'
        label.text+= this.data[trophyName].description

        return panel
    }

    show(trophyName) {
        if (this.achieved.includes(trophyName))
            return

        ServerComm.addTrophy("john", "penguimsaver", this.data['first death'], 
            (response) => this.onServerResponse(response, trophyName) )

    }



    onServerResponse(response, trophyName) {
        if (response['response'] != 'ok') {
            console.log("ERRO de comunicao com o servidor")
            return
        }
        this.achieved.push(trophyName)

        let panel = this.createPanel(trophyName)
        this.panels.push(panel)
        // agenda a destruicao do panel
        this.game.time.events.add(Phaser.Timer.SECOND * 3,
            this.removePanel, this)
        
        this.addTrophyOnPage(trophyName)
    }

    addTrophyOnPage(trophyName) {
        // jQuery
/*
        $('#div-trophy').append(
            '<p>' + JSON.stringify(this.data[trophyName]) + '</p>'
        )
*/
$('#trophies-list-empty-label').hide()

let html = Templates.trophiesListItem(this.data[trophyName])
$('#div-trophy').append(html)
}

removePanel() {
    let p = this.panels.shift()
    p.destroy()
}




}

class Templates {}
Templates.trophiesListItem = Handlebars.compile(
    $('#template-trophies-list-item').html()
    )
Templates.profileItem = Handlebars.compile(
    $('#template-profile-item').html()
    )

class ServerComm {

   

    static addProfile(nome, game, data, callback){
        ServerComm.sendRequestTrophy(nome, game, 'add-profile', data, callback)
    }

    static addGame(nome, game, data, callback){
        ServerComm.sendRequestTrophy( nome, game, 'add-game', data, callback)
    }

    static queryProfile(nome, game, data, callback){
        ServerComm.sendRequestTrophy(nome, game, 'query-profile', data, callback)
    }

    static loadState(nome, game, phase,data, callback){
        ServerComm.sendLoadGame(nome, game, 'load-state', phase, '', callback)
    }

    static saveState(nome, game, phase,data, callback){
        ServerComm.sendLoadGame(nome, game, 'save-state', phase, data, callback)
    }

    static queryProfile(nome, game, data, callback){
        ServerComm.sendRequestTrophy( nome, game, 'query-profile', data, callback)
    }

    static addTrophy(nome, game, data, callback) {
        ServerComm.sendRequestTrophy(nome, game, 'add-trophy', data, callback)
        // ServerComm.sendRequestTrophy("john", "penguimsaver", 'add-trophy', data, callback)
    }

    static listTrophy(nome, game, callback) {
        // ServerComm.sendRequestTrophy(nome, game, 'list-trophy', '', callback)
        ServerComm.sendRequestTrophy("john","penguimsaver", 'list-trophy', '', callback)

    }

    static clearTrophy(nome, game, callback) {
        // ServerComm.sendRequestTrophy(nome, game, 'clear-trophy', '', callback)
        ServerComm.sendRequestTrophy("john", "penguimsaver", 'clear-trophy', '', callback)
    }

    // metodo generico a ser usado por todas as 
    // requisicoes de trofeus
    static sendRequestTrophy(user,jogo, opName, opData,  callback) {
        let data = {
            id: user,
            game: jogo,
            op: opName,
            data: opData
        }
        ServerComm.ajaxPost(data, callback)
    }
    static sendLoadGame(user,jogo, opName, phase, opData,  callback) {
        let data = {
            id: user,
            game: jogo,
            op: opName,
            fase: phase,
            data: opData
        }
        ServerComm.ajaxPost(data, callback)
    }

    static ajaxPost(data, callback) {
        let url = 'http://localhost:50000/game/profile/'
        $.post(url, JSON.stringify(data))
        .done(function(data, status) {
            let jsonObj = JSON.parse(JSON.stringify(data))
            console.log(JSON.stringify(data))
            callback(jsonObj)
        })
        .fail(function(jqXHR, status, errorThrown) {
            console.log('ERROR: cannot reach game server')
        })
    }
}




