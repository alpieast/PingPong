(function () {

    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        //Code using this script here
        start();
       };
    document.body.appendChild(script);




    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 300,
            left: 450,
            borderRadius: 0,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 262
        },
        stick2:{
            right:0,
            top:262
        },
        scoreboard:{
            width: '100%',
            height: 55,
            margin: 'auto'
        },
        score1:{
            width: 200,
            height: 50,
            float: 'left',
            font: '40px Arial, sans-serif'
           
        },
        score2:{
            width: 200,
            height: 50,
            float: 'right',
            font: '40px Arial, sans-serif'
        }
    };

    var CONSTS = {
    	gameSpeed: 20,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0
    };

    function constsReset(){
        CONSTS.score1 = 0;
        CONSTS.score2 = 0;
        CONSTS.stick1Speed = 0;
        CONSTS.stick2Speed = 0;
        CONSTS.ballTopSpeed = 0;
        CONSTS.ballLeftSpeed = 0;
        $('#score-left').text('Player 1: ' + CONSTS.score1);
        $('#score-right').text('Player 2: ' + CONSTS.score2);
        roll();
        
    }

    function constsWriterToLocal(){
        localStorage.setItem('consts', JSON.stringify(CONSTS));
    }

    var localStoredConsts = JSON.parse(localStorage.getItem('consts'));
   

    function start() {

        
        if(localStoredConsts){
            CONSTS = localStoredConsts;
        }
        draw();
        setEvents();
        roll();
        loop();
    }

    function draw() {
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'scoreboard'}).css(CSS.scoreboard).appendTo('#pong-game');
        $('<div/>', {id: 'score-left'}).css(CSS.score1).appendTo('#scoreboard');
        $('<div/>', {id: 'score-right'}).css(CSS.score2).appendTo('#scoreboard');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick)).appendTo('#pong-game');
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.stick)).appendTo('#pong-game');
        $('#score-left').text('Player 1: ' + CONSTS.score1);
        $('#score-right').text('Player 2: ' + CONSTS.score2);
    }

    function setEvents() {

        //Player 1 & Player 2
        $(document).on('keydown', function (e) {
            if (e.keyCode == 87 && !(CSS.stick1.top <= 0) ) {    
                CONSTS.stick1Speed = -5;               
            }else if (e.keyCode == 83 && !(CSS.stick1.top >= CSS.arena.height - CSS.stick1.height) ) {
                CONSTS.stick1Speed = +5;                                                 
            }else if (e.keyCode == 38 && !(CSS.stick2.top <= 0)) {    
                CONSTS.stick2Speed = -5;
            }else if (e.keyCode == 40 && !(CSS.stick2.top >= CSS.arena.height - CSS.stick2.height)) {
                CONSTS.stick2Speed = +5;                                   
            }
        });


    }

    function loop() {
        window.pongLoop = setInterval(function () {
         
            constsWriterToLocal();
            

            if(CONSTS.score1 == 5){
                if(window.confirm("game over. Player1 Wins!")){
                    constsReset();
                }
            }else if(CONSTS.score2 == 5){
                if(window.confirm("game over. Player2 Wins!")){
                    constsReset();
                }
                
            }
            
            //stick1
            CSS.stick1.top += CONSTS.stick1Speed;
            $('#stick-1').css('top', CSS.stick1.top);

            if(CSS.stick1.top <= 0 ||
                CSS.stick1.top >= CSS.arena.height - CSS.stick1.height) 
                {
                    CONSTS.stick1Speed = 0;  
                }

            //stick 2
            CSS.stick2.top += CONSTS.stick2Speed;
            $('#stick-2').css('top', CSS.stick2.top);

            if(CSS.stick2.top <= 0 ||
                CSS.stick2.top >= CSS.arena.height - CSS.stick2.height) 
                {
                    CONSTS.stick2Speed = 0;  
                    
                }

            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;
            
            
            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }

            $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});

                //check if stick1 returns the ball back
                if( CSS.ball.left <= CSS.stick.width && 
                    CSS.ball.top > CSS.stick1.top &&
                    CSS.ball.top < CSS.stick1.top + CSS.stick.height)
                {
                    CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1
                }
                //check if ball makes a point at left side
                else if(CSS.ball.left < CSS.stick.width)
                {
                    roll();
                    CONSTS.score2 += 1;
                    $('#score-right').text('Player 2: ' + CONSTS.score2);
                }
                //check if stick2 returns the ball back
                else if(
                    CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width&& 
                    CSS.ball.top > CSS.stick2.top &&
                    CSS.ball.top < CSS.stick2.top + CSS.stick.height){
                    CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1
                    
                }
                //check if ball makes a point at right side
                else if(CSS.ball.left > CSS.arena.width - CSS.ball.width - CSS.stick.width)
                {
                    roll();
                    CONSTS.score1 += 1;
                    $('#score-left').text('Player 1: ' + CONSTS.score1);
                }

        }, CONSTS.gameSpeed);
    }

    function roll() {
        
        CSS.ball.top = CSS.arena.height/2 - CSS.ball.height;
        CSS.ball.left = CSS.arena.width/2 - CSS.ball.width;

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }

    
})();