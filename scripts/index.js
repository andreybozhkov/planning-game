let gameArea = {
    canvas: (() => {
        let canvas = document.createElement('canvas');
        canvas.setAttribute('class', 'planningGameCanvas');
        return canvas;
    })(),
    start: function() {
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        let gameContainer = document.getElementById('gameContainer');
        gameContainer.appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
        gameContainer.addEventListener('mousedown', (e) => {
            gameArea.x = e.pageX;
            gameArea.y = e.pageY;
            console.log(gameArea.x);
            console.log(gameArea.y);
        });
        gameContainer.addEventListener('mouseup', (e) => {
            gameArea.x = false;
            gameArea.y = false;
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function startGame() {
    gameArea.start();
    trailer = new component(40, 20, 'blue', 20, 20);
};

function component (width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = () => {
        context = gameArea.context;
        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    this.clicked = () => {
        let currentLeft = this.x;
        let currentRight = this.x + this.width;
        let currentTop = this.y;
        let currentBottom = this.y + this.height;
        let clicked = false;
        if ((currentBottom >= gameArea.y) || (currentTop <= gameArea.y) || (currentLeft >= gameArea.x) || (currentRight <= gameArea.x)) {
            clicked = false;
        }
        return clicked;
    }
};

function updateGameArea() {
    gameArea.clear();
    if (gameArea.x && gameArea.y) {
        if (trailer.clicked()) {
            trailer.x += 10;
        }
    }
    trailer.update();
}