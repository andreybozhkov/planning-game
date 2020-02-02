function startGame() {
    gameArea.start();
}

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
    }
}