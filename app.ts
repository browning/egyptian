class Card {
    suit: string;
    value: number;
    front_image: string;
    back_image: string;

    constructor (suit: string, value: number) { 
        this.suit = suit;
        this.value = value;
        this.back_image = "cardback.gif";
        this.front_image = "cardfront.gif";
    }
}

class Player {
    library: Card[];

    constructor () {
        this.library = new Array();
    }
    
    play_card() {
        if (this.library.length == 0)
            return null;
        else
            return this.library.pop();
    }
}

class GameState {
    players: Player[];
    stack: Card[]; // the pile of cards in the middle //
    turn_index: number;
    canvas: CanvasRenderingContext2D;
    card_back: HTMLImageElement;
    loop: Number;

    constructor (canvas: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.preload_image("images/b1fv.gif");
        this.card_back = new Image();
        this.card_back.src = "images/b1fv.gif";
    
        // preload all card images
        for (var i = 1; i <= 13; i++) {
            var name = i.toString();

            if ( i == 11 )
                name = "j";
            if ( i == 12 )
                name = "q";
            if ( i == 13 )
                name = "k";

            this.preload_image("images/s" + name + ".gif");
            this.preload_image("images/h" + name + ".gif");
            this.preload_image("images/d" + name + ".gif");
            this.preload_image("images/c" + name + ".gif");
        }

        // set up the 4 players // human player is player 0
        this.players = new Array();
        this.players.push(new Player());
        this.players.push(new Player());
        this.players.push(new Player());
        this.players.push(new Player());

        this.stack = new Array();
        this.turn_index = 0;
        this.deal_cards();
    }

    preload_image(img_path: string) {
        var img=new Image();
        img.src=img_path;
    }

    deal_cards() {
        var deck = new Array();
        for (var i = 2; i <= 14; i++) {
            deck.push(new Card("c", i));
            deck.push(new Card("s", i));
            deck.push(new Card("h", i));
            deck.push(new Card("d", i));
        }
        deck.sort(function () { return 0.5 - Math.random() });
        var player_index = 0;
        while (deck.length > 0) {
            this.players[player_index].library.push(deck.pop());
            if (++player_index >= 4 )
                player_index = 0;
        }
    }

    clear_canvas() {
      this.canvas.fillStyle = "#00cc00";  
      this.canvas.beginPath();  
      this.canvas.rect(0, 0, 640, 480);    
      this.canvas.closePath();  
      this.canvas.fill();  
    }  

    draw_players() {
        this.canvas.drawImage(this.card_back,280,0);
        this.canvas.drawImage(this.card_back, 0, 200);
        this.canvas.drawImage(this.card_back, 560, 200);
        this.canvas.drawImage(this.card_back, 280, 380);
        return;
    }

    execute_game_logic() {
        this.play_cards();
    }

    draw_card_in_center(c: Card) {
        var image = new Image();
            var name = c.value.toString();
            if (name == "11")
                name = "j";
            if ( name == "12")
                name = "q";
            if ( name == "13")
                name = "k";
            if ( name == "14")
                name = "1";
            image.src = "images/" + c.suit + name + ".gif";
            this.canvas.drawImage(image, 280, 200);
    }

    play_cards() {
        if (this.turn_index == 0) {
            // wait for human to play card
        }
        else {
            // play card from Player's library
            var to_play = this.players[this.turn_index].library.pop();
            this.stack.push(to_play);
            this.turn_index = this.turn_index + 1;
            if (this.turn_index == 4)
                this.turn_index = 0;
        }
    }

    onclick() {
        if (this.turn_index == 0)
            this.turn_index = 1;
    }
   
}

var state;

function game_loop() {
     state.clear_canvas();
     state.draw_players();
     state.execute_game_logic();
     if (state.stack.length > 0)
        state.draw_card_in_center(state.stack[state.stack.length - 1]);
     state.loop = setTimeout(this.game_loop, 1000 / 50);  
}

window.onload = () => {
    var canvas = document.getElementById('screen');
    var canvas_context = canvas["getContext"]('2d');
    
    state = new GameState(canvas_context);
    canvas.addEventListener('click', function (event) { state.onclick(); } , false);

    game_loop();
};