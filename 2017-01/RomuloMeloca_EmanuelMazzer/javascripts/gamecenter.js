class ServerComm {
    static addTrophy(data, callback) {
        ServerComm.sendRequestTrophy('add-trophy', data, callback);
    }

    static listTrophy(callback) {
        ServerComm.sendRequestTrophy('list-trophy', {}, callback);
    }

    static clearTrophy(callback) {
        ServerComm.sendRequestTrophy('clear-trophy', {}, callback);
    }

    // metodo generico a ser usado por todas as 
    // requisicoes de trofeus
    static sendRequestTrophy(opName, opData, callback) {
        opData.password = Config.PROFILE.data.password;
        let data = {
            id: Config.PROFILE.id,
            game: Config.PROFILE.game,
            op: opName,
            data: opData
        };
        ServerComm.ajaxPost(data, callback);
    }

    static logout() {
        let button = $("#form-login-button");
        button.attr("onclick", "ServerComm.login()");
        button.html('<span class="glyphicon glyphicon-log-in"></span>Login');
    }

    static signup() {
        let strLogin = $('#login-login').val();
        let strPassword = $('#login-password').val();
        let request = {
            id: strLogin,
            game: "marioevolution",
            op: 'add-profile',
            data: {
                password: strPassword
            }
        }
        ServerComm.ajaxPost(request, function (data) {
            if (data.response === "ok") {
                Config.PROFILE.id = strLogin;
                Config.PROFILE.id = strPassword;
                let button = $("#form-login-button");
                button.attr("onclick", "ServerComm.logout()");
                button.html('<span class="glyphicon glyphicon-log-in"></span>Logout');
                ServerComm.populateProfile(data.data);
            } else {
                alert("Credenciais inválidas!");
            }
        });
    }

    static login() {
        let strLogin = $('#login-login').val();
        let strPassword = $('#login-password').val();
        let request = {
            id: strLogin,
            game: "marioevolution",
            op: 'query-profile',
            data: {
                password: strPassword
            }
        }
        ServerComm.ajaxPost(request, function (data) {
            if (data.response === "ok" && data.data.password === strPassword) {
                Config.PROFILE.id = strLogin;
                Config.PROFILE.data.password = strPassword;
                let button = $("#form-login-button");
                button.attr("onclick", "ServerComm.logout()");
                button.html('<span class="glyphicon glyphicon-log-in"></span>Logout');
                ServerComm.populateProfile(data.data);
            } else {
                alert("Credenciais inválidas!");
            }
        });
    }

    static populateProfile(data) {
        Config.PROFILE.id = data.id;
        Config.PROFILE.data.password = data.password;
        Config.PROFILE.data.score = data.score;
        Config.PROFILE.data.lifes = data.lifes;
        Config.PROFILE.data.level = data.level;
        Config.PROFILE.data.coordinate.x = data.coordinate.x;
        Config.PROFILE.data.coordinate.y = data.coordinate.y;
        Config.PROFILE.data.screenshots = data.screenshots;
        Config.PROFILE.data.trophies = data.trophies;
    }

    static ajaxPost(data, callback) {
        let url = '/games';
        $.post(url, JSON.stringify(data))
                .done(function (data, status) {
                    callback(data);
                    $('#status').addClass("label-success").removeClass("label-warning");
                    $('#status').text("ONLINE");
                })
                .fail(function (jqXHR, status, errorThrown) {
                    console.log('ERROR: cannot reach game server');
                    $('#status').addClass("label-warning").removeClass("label-success");
                    $('#status').text('OFFLINE');
                });
    }
}