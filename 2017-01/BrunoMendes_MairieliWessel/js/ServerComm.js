class ServerComm {
    static addTrophy(data, callback) {
        ServerComm.sendRequest(Config.USERID, 'add-trophy', JSON.stringify(data), callback);
    }

    static listTrophy(callback) {
        ServerComm.sendRequest(Config.USERID, 'list-trophy', '', callback);
    }

    static clearTrophy(callback) {
        ServerComm.sendRequest(Config.USERID, 'clear-trophy', '', callback);
    }

    static saveState() {
        let data = { "x": Config.POSX, "y": Config.POSY, "level": Config.LEVEL, "score": Config.SCORE };
        ServerComm.sendRequest(Config.USERID, 'save-state', JSON.stringify(data), () => { });
    }

    static loadState(callback) {
        ServerComm.sendRequest(Config.USERID, 'load-state', '', callback);
    }

    static saveMedia(data, callback) {
        ServerComm.sendRequest(Config.USERID, 'save-media', JSON.stringify(data), callback);
    }

    static listMedia(data, callback) {
        ServerComm.sendRequest(Config.USERID, 'list-media', JSON.stringify(data), callback);
    }

    static addProfile(userid, data, callback) {
        ServerComm.sendRequest(userid, 'add-profile', JSON.stringify(data), callback);
    }

    static queryProfile(userid, data, callback) {
        ServerComm.sendRequest(userid, 'query-profile', JSON.stringify(data), callback);
    }

    static addGame(data, callback) {
        ServerComm.sendRequest(Config.USERID, 'add-game', JSON.stringify(data), callback);
    }

    static sendRequest(user, opName, opData, callback) {
        if (!user.trim()) {
            return;
        }
        let data = {
            id: user,
            game: Config.GAMEID,
            op: opName,
            data: opData
        }
        ServerComm.ajaxPost(data, callback)
    }

    static ajaxPost(data, callback) {
        $.post('http://' + self.location.host, JSON.stringify(data))
            .done(function (data, status) {
                callback(data);
            })
            .fail(function (jqXHR, status, errorThrown) {
                console.log('ERROR: cannot reach game server:');
            })
    }
}