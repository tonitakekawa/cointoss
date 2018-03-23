window.onload = () =>
{

//--

var moneyLabel  = document.getElementById("moneyLabel");
var startButton = document.getElementById("startButton");
var loadingImg  = document.getElementById("loadingImg");

var coin = 3;
var bet  = 1;

// init
loadingImg.style.display = "none";

var countToDoller = (n) =>
{
    var msg = Array(n)      // empty, empty, ...
                .fill("💰")   // 💰,💰,...
                .join("");   // "💰 💰" ...
    
    return msg;
};

moneyLabel.innerText = countToDoller(coin);

startButton.onclick = () =>
{
    

    var buttons =
    {
        cancel: {
            text: "表",
            value: 1,
            visible: true,
            className: "",
            closeModal: true,
        },
        confirm: {
            text: "裏",
            value: 2,
            visible: true,
            className: "",
            closeModal: true
        }
    };

    var swalArg =
    {
        ico: "info",
        title : countToDoller(bet),
        buttons,
        closeOnClickOutside: false
    };

    swal(swalArg)
    .then((choose)=>{

        loadingImg.style.display = "block";

                coin -= bet;
                moneyLabel.innerText = countToDoller(coin);


        setTimeout(()=>{
            var min   = 1;
            var max   = 2;
            var result = Math.floor( Math.random() * (max + 1 - min) ) + min ;

            console.log(result);
            loadingImg.style.display = "none";

            if( result == choose )
            {
                var title = countToDoller(bet) + "➡" + countToDoller(bet*2)

                var buttons =
                {
                    cancel: {
                        text: "やめる",
                        value: 1,
                        visible: true,
                        className: "",
                        closeModal: true,
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
                var swalArg =
                {
                    ico: "success",
                    title,
                    buttons,
                    closeOnClickOutside: false
                };

                coin += bet;
                moneyLabel.innerText = countToDoller(coin);

                swal(swalArg)
            }
            else
            {
                // はずれ演出
                var title = "😭";

                // 当たり演出
                var swalArg =
                {
                    ico: "error",
                    title,
                    closeOnClickOutside: false,
                    timer: 3000,
                };

                swal(swalArg)
            }

        }, 1000);
    });


};

//---

};