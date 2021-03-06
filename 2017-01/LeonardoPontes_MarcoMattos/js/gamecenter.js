class ServerComm {
    static addTrophy(data, callback) {
        ServerComm.sendRequest(Config.USER_ID, 'add-trophy', data, callback);
    }

    static listTrophy(callback) {
        ServerComm.sendRequest(Config.USER_ID, 'list-trophy', '', callback);
    }

    static listMedia(callback) {
        ServerComm.sendRequest(Config.USER_ID, 'list-media', '', callback);
    }

    static clearTrophy(callback) {
        ServerComm.sendRequest(Config.USER_ID, 'clear-trophy', '', callback);
    }

    static addScore(data, callback) {
        ServerComm.sendRequest(Config.USER_ID, 'add-score', data, callback);
    }

    static addSavePoint(data, callback) {
        ServerComm.sendRequest(Config.USER_ID, 'save-point', data, callback);
    }

    static saveMedia(data, callback) {
        ServerComm.sendRequest(Config.USER_ID, 'save-media', data, callback);
    }
    static getRanking(data, callback) {
        ServerComm.sendRequest(Config.USER_ID, 'get-ranking', data, callback);
    }

    static login(data, callback) {
        ServerComm.ajaxPost(data, callback)
    }

    static afterLogin() {
        window.localStorage.setItem('usuario', Config.USER_ID);
//        $("#trophy-div").html('');
//        $("#div-trophy").remove();
//       $("#trophy-div").empty();
//        document.getElementById("trophy-li").innerHTML = "";
        $("#div-trophy").remove();
        $("#trophy-div").append("<ul id=\"div-trophy\" class=\"list-group\"> </ul>");
        ServerComm.listTrophy(function (trophys) {
            let data = trophys.data;
            data.forEach(function (trophy) {
                let t = {name: trophy.nameTrophy, xp: trophy.xpTrophy,
                    title: trophy.titleTrophy,
                    description: trophy.descriptionTrophy};
                let html = Templates.trophiesListItem(t)
                $('#div-trophy').append(html)
            });
        });
        ServerComm.listMedia(function (images) {
            let data = images.data;
            data.forEach(function (item) {
                $('#div-screenshot').append(`<img src=${item.image} alt='game screenshot' class='screenshot'>`)
            });
        });
    }

    // metodo generico a ser usado por todas as 
    // requisicoes de trofeus
    static sendRequest(user, opName, opData, callback) {
        if (Config.USER_ID != null) {
            let data = {
                id: user,
                op: opName,
                data: opData
            }
            ServerComm.ajaxPost(data, callback)
        }
    }

    static testConn() {
        let url = '/game'
        $.post(url, JSON.stringify({}))
                .done(function ( {}, status) {
                    Config.CONN = true;
                    $('#status').addClass("label-success").removeClass("label-warning");
                    $('#status').text("ONLINE");
                })
                .fail(function (jqXHR, status, errorThrown) {
                    Config.CONN = false;
                    $('#status').addClass("label-warning").removeClass("label-success");
                    $('#status').text('OFFLINE');
                })
    }

    static ajaxPost(data, callback) {
        if (Config.CONN === true) {
            let url = '/game'
            $.post(url, JSON.stringify(data))
                    .done(function (data, status) {
                        $('#status').addClass("label-success").removeClass("label-warning");
                        $('#status').text("ONLINE");
                        let jsonObj = JSON.parse(data)
                        callback(jsonObj)
                    })
                    .fail(function (jqXHR, status, errorThrown) {
                        $('#status').addClass("label-warning").removeClass("label-success");
                        $('#status').text('OFFLINE');
                    })
        }
    }
}



