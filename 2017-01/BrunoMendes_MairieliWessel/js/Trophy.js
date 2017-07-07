class Trophy extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0, '');
        this.data = {};
        this.data['firstDeath'] = { name: 'firstDeath', xp: 10, title: 'KEEP CALM AND PLAY', description: 'First death on game' };
        this.data['firstCoin'] = { name: 'firstCoin', xp: 10, title: 'STARTING FINANCES', description: 'First coin on game' };
        this.data['wallJump'] = { name: 'wallJump', xp: 30, title: 'NINJA', description: 'Do a wall jump' };
        this.data['coinTransparent'] = { name: 'coinTransparent', xp: 50, title: 'TREASURE HUNTER', description: 'Collect transparent coin' };
        this.data['screenshot'] = { name: 'screenshot', xp: 10, title: 'CAMERAMAN', description: 'Take a Screenshot' };
        this.data['checkpoint'] = { name: 'checkpoint', xp: 20, title: 'SAVED GAME', description: 'Save the Game' };
        this.panels = [];
    }

    createPanel(trophyName) {
        this.game.sound.play('trophy');
        let panelY = this.game.height - 74 - this.panels.length * 74
        let panel = this.game.add.sprite(this.game.width - 250, panelY, 'trophy')
        panel.fixedToCamera = true

        let labelX = 70
        let labelWidth = panel.width - labelX
        let style = {
            font: '12px Arial', fill: '#ffffff',
            wordWrap: true, wordWrapWidth: labelWidth
        }
        let label = this.game.add.text(labelX, 7, '', style)
        label.lineSpacing = -7
        panel.addChild(label)

        // define label
        label.text = this.data[trophyName].title + '   +'
        label.text += this.data[trophyName].xp + '\n\n'
        label.text += this.data[trophyName].description

        return panel
    }

    show(trophyName) {
        if (Config.ACHIEVED.includes(trophyName))
            return
        Config.ACHIEVED.push(trophyName)
        ServerComm.addTrophy(this.data[trophyName], (response) => this.onServerResponse(response, trophyName))
    }

    onServerResponse(response, trophyName) {
        if (response['response'] != 'ok') {
            console.log("ERRO de comunicao com o servidor")
            let indexToRemove = Config.ACHIEVED.indexOf(trophyName);
            if (indexToRemove > -1) {
                Config.ACHIEVED.splice(indexToRemove, 1);
            }
            return
        }

        let panel = this.createPanel(trophyName)
        this.panels.push(panel)
        // agenda a destruicao do panel
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.removePanel, this)

        this.addTrophyOnPage(trophyName)
    }

    addTrophyOnPage(trophyName) {
        $('#div-trophy').append(
            `
                <a class="list-group-item" sytle="margin-bottom: 5px">
                    <h4 class="list-group-item-heading">${this.data[trophyName].title} <span class="badge">+${this.data[trophyName].xp}</span></h4>
                    <p class="list-group-item-text">${this.data[trophyName].description}</p>
                </a>
            `
        )
        $('#xp-total').text("+" + (Number($('#xp-total').text()) + Number(this.data[trophyName].xp)));
    }

    removePanel() {
        let p = this.panels.shift()
        p.destroy()
    }

    clearTrophies() {
        ServerComm.clearTrophy(() => { this.removeFromAchieved() });
    }

    removeFromAchieved() {
        Config.ACHIEVED = [];
    }
}