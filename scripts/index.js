let keys = {
    mouseDown: false
};

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
        this.canvas.addEventListener('mousedown', (e) => {
            keys.mouseDown = true;
            let mousePos = getMousePos(this.canvas, e);
            gameArea.x = mousePos.x;
            gameArea.y = mousePos.y;
            trailer.clicked();
        });
        this.canvas.addEventListener('mousemove', (e) => {
            let mousePos = getMousePos(this.canvas, e);
            if (gameArea.x && gameArea.y) {
                if (keys.mouseDown && trailer.isClicked) {
                    trailer.x = mousePos.x;
                    trailer.y = mousePos.y;
                }
            }
        });
        this.canvas.addEventListener('mouseup', (e) => {
            keys.mouseDown = false;
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
    this.isClicked = false;
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
        if (currentBottom >= gameArea.y && currentTop <= gameArea.y && currentLeft <= gameArea.x && currentRight >= gameArea.x) {
            this.isClicked = true;
        } else this.isClicked = false;
    }
};

function updateGameArea() {
    gameArea.clear();
    trailer.update();
}

function getMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}