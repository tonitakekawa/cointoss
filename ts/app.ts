

// ホントはテーブルにして抽出が好みだけど
var useWebAPI = document.domain == "localhost"
                ? false
                : true 

var head = useWebAPI ? "https://vegas.web-api.link/"
                     : "http://localhost/";

function submitSignUp()
{
    var email    = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var repeat   = document.getElementById('repeat').value;
    
    var requestJson =
    {
      "users":
      {
        "email": email,
        "pass": password
      }
    };

    var url = head + "user";

    var lambda = (responseJson, code) =>
    {
        var title = url;
        var msg = JSON.stringify(responseJson);
        iziToast.show({
            timeout:  20000,
            position: "bottomRight",
            title,
            message: msg,
            progressBarColor: 'rgb(0, 255, 184)'
        });

        //if(responseJson.data.result == true)
        {
            var swalArg =
            {
                ico: "info",
                title: "正常に登録されました",
                closeOnClickOutside: false
            };

            swal(swalArg)
        }
        /*
        else
        {
            var swalArg =
            {
                ico: "error",
                title: "登録されませんでした",
                closeOnClickOutside: false
            };

            swal(swalArg)
        }
        */
    }

    ajax(url, lambda, requestJson);
}

var lambdaStack = [];

function countToDoller(n)
{
    var msg = Array(n) // empty, empty, ...
        .fill("💰") // 💰,💰,...
        .join(""); // "💰 💰" ...
    return msg;
};

function betFunc()
{
    var url = head + 'cointoss/bet';

    ajax(url, (json ,code) => {
        showMessage('BET', code, json);
        moneyLabel.innerText = countToDoller(json.coin);
        play(json.bet);
    });
};

// 見通しが良くないなあ。
// 常に何かを待っている状態で、
// init ->
// 

function play(bet)
{
    var buttons = {
        cancel: {
            text: "表",
            value: 1,
            visible: true,
            className: "",
            closeModal: true
        },
        confirm: {
            text: "裏",
            value: 2,
            visible: true,
            className: "",
            closeModal: true
        }
    };
    var swalArg = {
        ico: "info",
        title: countToDoller(bet),
        buttons: buttons,
        closeOnClickOutside: false
    };

    swal(swalArg)
    .then(function (choose) {
        loadingImg.style.display = "block";

        var url = head + 'cointoss/game';

        // 初回プレイ
        ajax(url, (json ,code) => {
            
            showMessage('GAME', code, json);

            loadingImg.style.display = "none";
            if (json.win!=0) {
                var title = countToDoller(json.win);
                var buttons = {
                    cancel: {
                        text: "やめる",
                        value: 1,
                        visible: true,
                        className: "",
                        closeModal: true
                    },
                    confirm: {
                        text: "ダブルアップ",
                        value: 2,
                        visible: true,
                        className: "",
                        closeModal: true
                    }
                };
                // 当たり演出
                var swalArg = {
                    ico: "success",
                    title: title,
                    buttons: buttons,
                    closeOnClickOutside: false
                };

                swal(swalArg)
                .then((choose)=>
                {
                   if(choose==1)
                   {
                        var url = head + 'cointoss/init';

                        ajax(url, (json ,code) => {
                            showMessage('GAME', code, json);
                            moneyLabel.innerText = countToDoller(json.coin);
                        });
                   }
                   else
                   {
                        var url = head + 'cointoss/bet';
                        // ダブルアップ
                        ajax(url, (json ,code) => {
                            showMessage('GAME', code, json);
                            moneyLabel.innerText = countToDoller(json.coin);
                            play(json.hand);
                        });                  
                    } 
                });
            }
            else {
                // はずれ演出
                var title = "😭";
                // 当たり演出
                var swalArg = {
                    ico: "error",
                    title: title,
                    closeOnClickOutside: false
                };

                var url = head + 'cointoss/init';

                ajax(url, (json ,code) => {
                    showMessage('GAME', code, json);
                    moneyLabel.innerText = countToDoller(json.coin);
                });

                swal(swalArg);
            }
        }, 10);
    });
}


// アプリの状態として、
// ・通信中
// というのがあるといい

function submitLogIn()
{
    var email    = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    var requestJson =
    {
      "users":
      {
        "email": email,
        "pass": password
      }
    };

    var url = head + "login";

    var lambda = (responseJson, code) =>
    {
        var title = url;
        var msg = JSON.stringify(responseJson);
        iziToast.show({
            timeout:  20000,
            position: "bottomRight",
            title,
            message: msg,
            progressBarColor: 'rgb(0, 255, 184)'
        });

        if(responseJson.result == true)
        {
            var swalArg =
            {
                ico: "info",
                title: responseJson.message,
                closeOnClickOutside: false
            };

            swal(swalArg)
            .then(()=>{
                window.location.href = './index.html';
            });
        }
        else
        {
            var swalArg =
            {
                ico: "info",
                title: responseJson.message,
                closeOnClickOutside: false
            };

            swal(swalArg)
        }
    }

    ajax(url, lambda, requestJson);
}

function ajax(url, lambda, json={}, method='POST')
{
    //var url = head + 'cointoss/' + verb;
    
    fetch(url, {
        mode:         'cors',
        method :      method,
        credentials : "include",
        body        : JSON.stringify(json),
        headers     : new Headers({ "Content-type" : "application/json" })
    }).then(response => response.text())
    .then(text => 
    {
        var json = JSON.parse(text)
        lambda(json, 200);
        console.log(text)
    }
    );
}

function showMessage(req, code, json)
{
    //return;

    var msg =
    "S :" + json.state + " " +
    "C :" + json.coin  + " " +
    "H :" + json.hand  + " " +
    "W :" + json.win;  + " " 

    var state = json.state;

    var img = state == 'wait'   ? 'img/toWaitt.svg'
            : state == 'bet'    ? 'img/bet.svg'
            : state == 'result' ? 'img/game.svg'
            :                     'img/question.svg'

    var title = json.request + ' : ' + code;

    var arg =
    {
        timeout: 20000,
        image:img,
        position: "bottomRight",
        title,
        message: msg,
        progressBarColor: 'rgb(0, 255, 184)'
    }
    iziToast.show(arg);

    return null;
}

function onloadLogin()
{
    var filename = window.location.href.split('/').pop();


    var moneyLabel   = document.getElementById("moneyLabel");
    var loadingImg   = document.getElementById("loadingImg");
    var startButton  = document.getElementById("startButton");
    var testButton   = document.getElementById("testButton");
    var signUpButton = document.getElementById("signUpButton");

    document.getElementById('id01').style.display='block';
    document.getElementById('id01').style.width="auto";
};

function versionTest()
{
    var clientVersion = "new-vegas-client-0.0.0-develop";

    var versionUrl =  head + 'version';

    ajax(versionUrl, (json ,code) => {

        var arg = {};

        if(json.expectedClientVersion != clientVersion)
        {
            var msgList  = [
                `クライアントバージョン:${clientVersion}`,
                `予期するクライアントバージョン：${json.expectedClientVersion}`,
                `キャッシュクリアが必要です`
            ];

            var argList = msgList.map((msg)=> 
            {
                return {
                timeout: 20000,
                position: "bottomRight",
                message: msg,
                progressBarColor: 'rgb(0, 255, 184)'
                }
            });

            argList.forEach(element => {
                iziToast.show(element);
            });
        }
        else
        {
            arg =
            {
                timeout: 20000,
                position: "bottomRight",
                message: JSON.stringify(json),
                progressBarColor: 'rgb(0, 255, 184)'
            }
            iziToast.show(arg);
        }

    });
}

function onloadIndex()
{
    var moneyLabel   = document.getElementById("moneyLabel");
    var loadingImg   = document.getElementById("loadingImg");
    var startButton  = document.getElementById("startButton");
    var testButton   = document.getElementById("testButton");
    var signUpButton = document.getElementById("signUpButton");
    var loginButton  = document.getElementById("loginButton");

    // init
    loadingImg.style.display = "block";
    startButton.style.display = "none";
    //testButton.style.display = "none";
    
    moneyLabel.innerText = "loading";
    startButton.onclick  = betFunc;
    testButton.onclick   = versionTest;
    signUpButton.onclick = function ()
    {
        document.getElementById('id01').style.display='block';
        document.getElementById('id01').style.width="auto";
    }

    loginButton.onclick = function()
    {
        window.location.href = './login.html';
    }

    // サーバー初期化
    var url =  head + 'cointoss/init';

    ajax(url, (json ,code) => {
        loadingImg.style.display   = "none";
        startButton.style.display  = "block";
        //testButton.style.display = "none";
        showMessage("INIT", code, json);
        moneyLabel.innerText = countToDoller(json.coin);
    });


};
