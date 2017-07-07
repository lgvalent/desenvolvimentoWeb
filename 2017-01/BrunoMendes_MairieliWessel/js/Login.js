function login(e = null) {
    if (e) {
        e.preventDefault();
    }
    if (!$("#password").val().trim() || !$("#userid").val().trim()) {
        fail("Entre com dados válidos");
        return;
    }
    let datasend = { password: $("#password").val().trim() };
    ServerComm.queryProfile($("#userid").val().trim(), datasend, (data) => {
        if (data.response == "ok") {
            Config.USERID = $("#userid").val().trim();
            ServerComm.loadState((datastate) => { loadState(datastate) });
            $("#logged-as").html($("#userid").val().trim());
            $("#useridProfile").html($("#userid").val().trim());
            $("#lastloginProfile").html(JSON.parse(data.data).lastLogin);
            $("#emailProfile").html(JSON.parse(data.data).email);
            $("#buttonModalRegister").hide();
            $("#form-login").hide();
            $("#label-logged-in").show();
        } else {
            fail(data.data);
        }
    });
}

function register(e) {
    e.preventDefault();
    if (!$("#passwordregister").val().trim() || !$("#emailregister").val().trim() || !$("#useridregister").val().trim()) {
        fail("Entre com dados válidos");
        return;
    }
    let datasend = { password: $("#passwordregister").val().trim(), email: $("#emailregister").val().trim() };
    ServerComm.addProfile($("#useridregister").val().trim(), datasend, (data) => {
        if (data.response == "ok") {
            $("#password").val($("#passwordregister").val());
            $("#userid").val($("#useridregister").val());
            login();
            $('#registerModal').modal('hide');
        } else {
            fail(data.data);
        }
    });
}

function loadScreenShots(json) {
    if (json.data != "") {
        $('#div-screenshot').empty();
        let medias = JSON.parse(json.data);
        for (let media of medias) {
            $('#div-screenshot').append(
                appendScreenShot(media.src)
            )
        }
    }
}

function loadState(data) {
    if (data.data) {
        let state = JSON.parse(data.data)
        if (state.x != 0 && state.y != 0) {
            Config.SCORE = state.score;            
            Config.LEVEL = state.level;
            Config.POSX = state.x;
            Config.POSY = state.y;
            if (Config.LEVEL <= 3) {
                GAME.state.start('Play', true, true);
            }
            ServerComm.listMedia({ mimeType: 'image/png', start: 0, count: 30 }, (res) => { loadScreenShots(res) })
        }
    }
}

function fail(msg) {
    $.notify(msg, { close: true, color: "#fff", background: "#ff4136", align: "right", verticalAlign: "button", delay: 5000 });
}