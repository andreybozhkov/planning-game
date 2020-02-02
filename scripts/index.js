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
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function startGame() {
    gameArea.start();
    trailer = new component(40, 20, 'blue', 10, 10);
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
};

function updateGameArea() {
    gameArea.clear();
    trailer.update();
}