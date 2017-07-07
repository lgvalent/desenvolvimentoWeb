
class Trophy extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0, '')

        this.data = {}

        this.data['corra_enquanto_ha_tempo'] = 
        {name: 'corra_enquanto_ha_tempo', xp: 5, 
        title: 'O tempo nao para',
        description: 'Ja se passaram trinta segundos, hora de correr!'}

        this.data['colecionador_de_ossos'] = 
        {name: 'colecionador_de_ossos', xp: 10, 
        title: 'O colecionador de ossos',
        description: 'Por coletar os primeiros ossos do jogo.'}

        this.data['bom_pra_cachorro'] = 
        {name: 'bom_pra_cachorro', xp: 30, 
        title: 'Bom pra cachorro!',
        description: 'Uau, voce coletou cinquenta pontos que valem mais do que dinheiro!'}

        this.data['corrida_contra_o_tempo'] = 
        {name: 'corrida_contra_o_tempo', xp: 15, 
        title: 'Corrida contra o tempo',
        description: 'Por retornar a ultima posicao e ganhar dez segundos no relogio.'}

        this.panels = []
        this.achieved = []

        ServerComm.listTrophy(user_id, 
            (response) => this.updateAchievedTrophies(response) )
    }

    updateAchievedTrophies(json) {
        console.log(json)
        let list = JSON.parse(json['data']);
        for (let t of list) {
            this.achieved.push(t['name'])
        }
    }

    createPanel(trophyName) {
       let panelY = this.game.height - 74 - this.panels.length * 74
       let panel = this.game.add.sprite(this.game.width - 250,
                        panelY, 'trophy')
        panel.fixedToCamera = true 

        let labelX = 66
        let labelWidth = panel.width - labelX
        let style = {font: '10px Arial', fill: '#ffffff',
            wordWrap: true, wordWrapWidth: labelWidth}
        let label = this.game.add.text(labelX, 5, '', style)
        label.lineSpacing = -7
        panel.addChild(label)

        label.text = this.data[trophyName].title + '   +'
        label.text+= this.data[trophyName].xp + '\n\n'
        label.text+= this.data[trophyName].description

        return panel
    }

    show(trophyName) {
        if (this.achieved.includes(trophyName))
            return
            
        ServerComm.addTrophy(user_id, this.data[trophyName], 
            (response) => this.onServerResponse(response, trophyName))
    }

    onServerResponse(response, trophyName) {
        if (response['response'] != 'ok') {
            console.log("Problemas ao se comunicar com o servidor!")
            return
        }
        this.achieved.push(trophyName)

        let panel = this.createPanel(trophyName)
        this.panels.push(panel)

        this.game.time.events.add(Phaser.Timer.SECOND * 3,
            this.removePanel, this)
    }

    removePanel() {
        let p = this.panels.shift()
        p.destroy()
    }
}

class ServerComm {
    static addTrophy(user_id, data, callback) {
        console.log(user_id)
        ServerComm.sendRequestTrophy(
            user_id, 'add-trophy', data, callback)
    }

    static listTrophy(user_id, callback) {

        ServerComm.sendRequestTrophy(
            user_id, 'list-trophy', '', callback)
    }

    static clearTrophy(user_id, callback) {
        console.log(user_id)

        ServerComm.sendRequestTrophy(
            user_id, 'clear-trophy', '', callback)
    }

    static saveState(user_id, data, callback) {
        console.log(user_id)

        ServerComm.sendRequestTrophy(
            user_id, 'save-state', data, callback)
    }

    static loadState(user_id, callback) {
        console.log(user_id)

        ServerComm.sendRequestTrophy(
            user_id, 'load-state', '', callback)
    }

    static saveMedia(user_id, data, callback) {
        console.log(user_id)

        ServerComm.sendRequestTrophy(
            user_id, 'save-media', data, callback)
    }

    static listMedia(user_id, callback) {
        console.log(user_id)

        ServerComm.sendRequestTrophy(
            user_id, 'list-media', '', callback)
    }

    static addProfile(user_id, data, callback) {
        console.log(user_id)

        ServerComm.sendRequestTrophy(
            user_id, 'add-profile', data, callback)        
    }

    static queryProfile(user_id, data, callback) {
        console.log(user_id)

        ServerComm.sendRequestTrophy(
            user_id, 'query-profile', data, callback)        
    }

    static gameOver (user_id, data, callback) {
        ServerComm.sendRequestTrophy(
            user_id, 'game-over', data, callback)        
    }

    static listPontos (user_id, callback) {
        ServerComm.sendRequestTrophy(
            user_id, 'list-pontos', '', callback)        
    }

    static sendRequestTrophy(user, opName, opData, callback) {
        console.log(opName)
        let data = {
            id: user,
            op: opName,
            data: opData
        }
        ServerComm.ajaxPost(data, callback)
    }

    static ajaxPost(data, callback) {
        let url = 'http://localhost:8000'

        $.post(url, JSON.stringify(data))
            .done(function(data, status) {
                let jsonObj = JSON.parse(data)
                callback(jsonObj)
            })
            .fail(function(jqXHR, status, errorThrown) {
                console.log('ERROR: cannot reach game server')
            })
    }
}