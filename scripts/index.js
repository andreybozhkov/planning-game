let keys = {
    mouseDown: false
};

let offset = {};

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
            trailers.forEach(trailer => {
                trailer.clicked();
                if (trailer.isClicked) {
                    offset.lastX = mousePos.x;
                    offset.lastY = mousePos.y;
                }
            });
        });
        this.canvas.addEventListener('mousemove', (e) => {
            let mousePos = getMousePos(this.canvas, e);
            if (gameArea.x && gameArea.y && keys.mouseDown) {
                trailers.forEach(trailer => {
                    if (trailer.isClicked) {
                        offset.deltaX = mousePos.x - offset.lastX;
                        offset.lastX = mousePos.x;
                        offset.deltaY = mousePos.y - offset.lastY;
                        offset.lastY = mousePos.y;
                        trailer.x += offset.deltaX;
                        trailer.y += offset.deltaY;
                    }
                });
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
    trailers = [];
    //trailer0 = new component(90, 30, 'blue', 'ABC000');
    generateTrailers(10);
};

function component(width, height, color, plateNr) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.plateNr = plateNr;
    this.isClicked = false;
    this.update = () => {
        context = gameArea.context;
        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.font = '20px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(this.plateNr, this.x + this.width / 2, this.y + this.height / 1.3);
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
    trailers.forEach(trailer => {
        trailer.update();
    });
}

function getMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function generateTrailers(nrOfTrailers) {
    let startNr = 1;
    for (i = startNr; i <= nrOfTrailers; i++) {
        let nrSeries = '';
        if (i < 10) {
            nrSeries = `00${i}`;
        }
        else if (i >= 10 && i < 100) {
            nrSeries = `0${i}`;
        }
        else if (i >= 100) {
            nrSeries = `${i}`;
        }
        trailers.push(new component(90, 30, 'blue', `ABC${nrSeries}`));
    }
}