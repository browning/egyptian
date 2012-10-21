var Card = (function () {
    function Card(suit, value) {
        this.suit = suit;
        this.value = value;
        this.back_image = "cardback.gif";
        this.front_image = "cardfront.gif";
    }
    return Card;
})();
var Player = (function () {
    function Player() {
        this.library = new Array();
    }
    Player.prototype.play_card = function () {
        if(this.library.length == 0) {
            return null;
        } else {
            return this.library.pop();
        }
    };
    return Player;
})();
var GameState = (function () {
    function GameState(canvas) {
        this.canvas = canvas;
        this.preload_image("images/b1fv.gif");
        this.card_back = new Image();
        this.card_back.src = "images/b1fv.gif";
        for(var i = 1; i <= 13; i++) {
            var name = i.toString();
            if(i == 11) {
                name = "j";
            }
            if(i == 12) {
                name = "q";
            }
            if(i == 13) {
                name = "k";
            }
            this.preload_image("images/s" + name + ".gif");
            this.preload_image("images/h" + name + ".gif");
            this.preload_image("images/d" + name + ".gif");
            this.preload_image("images/c" + name + ".gif");
        }
        this.players = new Array();
        this.players.push(new Player());
        this.players.push(new Player());
        this.players.push(new Player());
        this.players.push(new Player());
        this.stack = new Array();
        this.turn_index = 0;
        this.deal_cards();
    }
    GameState.prototype.preload_image = function (img_path) {
        var img = new Image();
        img.src = img_path;
    };
    GameState.prototype.deal_cards = function () {
        var deck = new Array();
        for(var i = 2; i <= 14; i++) {
            deck.push(new Card("c", i));
            deck.push(new Card("s", i));
            deck.push(new Card("h", i));
            deck.push(new Card("d", i));
        }
        deck.sort(function () {
            return 0.5 - Math.random();
        });
        var player_index = 0;
        while(deck.length > 0) {
            this.players[player_index].library.push(deck.pop());
            if(++player_index >= 4) {
                player_index = 0;
            }
        }
    };
    GameState.prototype.clear_canvas = function () {
        this.canvas.fillStyle = "#00cc00";
        this.canvas.beginPath();
        this.canvas.rect(0, 0, 640, 480);
        this.canvas.closePath();
        this.canvas.fill();
    };
    GameState.prototype.draw_players = function () {
        this.canvas.drawImage(this.card_back, 280, 0);
        this.canvas.drawImage(this.card_back, 0, 200);
        this.canvas.drawImage(this.card_back, 560, 200);
        this.canvas.drawImage(this.card_back, 280, 380);
        return;
    };
    GameState.prototype.execute_game_logic = function () {
        this.play_cards();
    };
    GameState.prototype.draw_card_in_center = function (c) {
        var image = new Image();
        var name = c.value.toString();
        if(name == "11") {
            name = "j";
        }
        if(name == "12") {
            name = "q";
        }
        if(name == "13") {
            name = "k";
        }
        if(name == "14") {
            name = "1";
        }
        image.src = "images/" + c.suit + name + ".gif";
        this.canvas.drawImage(image, 280, 200);
    };
    GameState.prototype.play_cards = function () {
        if(this.turn_index == 0) {
        } else {
            if(new Date().getTime() > last_action + speed) {
                var to_play = this.players[this.turn_index].library.pop();
                this.stack.push(to_play);
                this.turn_index = this.turn_index + 1;
                if(this.turn_index == 4) {
                    this.turn_index = 0;
                }
                last_action = new Date().getTime();
            }
        }
    };
    GameState.prototype.onclick = function (e) {
        var clicked_library = false;
        if(e.screenX > 280 && e.screenX < 280 + 100 && e.screenY > 380 && e.screenY < 380 + 200) {
            clicked_library = true;
        }
        if(this.turn_index == 0 && clicked_library) {
            this.turn_index = 1;
        }
    };
    return GameState;
})();
var state;
var speed = 1500;
var last_action = 0;
function game_loop() {
    state.clear_canvas();
    state.draw_players();
    state.execute_game_logic();
    if(state.stack.length > 0) {
        state.draw_card_in_center(state.stack[state.stack.length - 1]);
    }
    state.loop = setTimeout(this.game_loop, 1000 / 50);
}
window.onload = function () {
    var canvas = document.getElementById('screen');
    var canvas_context = canvas["getContext"]('2d');
    state = new GameState(canvas_context);
    canvas.addEventListener('click', function (event) {
        state.onclick(event);
    }, false);
    game_loop();
};
