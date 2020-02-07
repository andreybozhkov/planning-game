let keys = {
    mouseDown: false
};
let offset = {};
let time = 30 * 1000;
let timeSeconds = time / 1000;
let draggedVehiclePlatenr = '';

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
            trucks.forEach(truck => {
                truck.clicked();
                if (truck.isClicked) {
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
                        if (draggedVehiclePlatenr.length === 0) {
                            draggedVehiclePlatenr = trailer.plateNr;
                        }
                        offset.deltaX = mousePos.x - offset.lastX;
                        offset.lastX = mousePos.x;
                        offset.deltaY = mousePos.y - offset.lastY;
                        offset.lastY = mousePos.y;
                        trailer.x += offset.deltaX;
                        trailer.y += offset.deltaY;
                    }
                });
                trucks.forEach(truck => {
                    if (truck.isClicked) {
                        if (draggedVehiclePlatenr.length === 0) {
                            draggedVehiclePlatenr = truck.plateNr;
                        }
                        offset.deltaX = mousePos.x - offset.lastX;
                        offset.lastX = mousePos.x;
                        offset.deltaY = mousePos.y - offset.lastY;
                        offset.lastY = mousePos.y;
                        truck.x += offset.deltaX;
                        truck.y += offset.deltaY;
                    }
                });
            }
        });
        this.canvas.addEventListener('mouseup', (e) => {
            if (draggedVehiclePlatenr.length > 0) {
                let mousePos = getMousePos(this.canvas, e);
                if (trailers.findIndex(vehicle => vehicle.plateNr === draggedVehiclePlatenr) >= 0) {
                    trucks.forEach(truck => {
                        truck.matchDrop(mousePos, draggedVehiclePlatenr);
                    });
                } else if (trucks.findIndex(vehicle => vehicle.plateNr === draggedVehiclePlatenr) >= 0) {
                    trailers.forEach(trailer => {
                        trailer.matchDrop(mousePos, draggedVehiclePlatenr);
                    });
                }
            }
            draggedVehiclePlatenr = '';
            keys.mouseDown = false;
            gameArea.x = false;
            gameArea.y = false;
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
};

function startGame() {
    gameArea.start();
    timer = new component(60, 20, 'black', '', 'timer');
    trailers = [];
    generateTrailers(20);
    positionVehicles(trailers);
    trucks = [];
    generateTrucks(20);
    positionVehicles(trucks);
    matchedTrucksWithTrailers = [];
};

function component(width, height, color, plateNr, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.plateNr = plateNr;
    this.isClicked = false;
    this.color = color;
    this.update = () => {
        context = gameArea.context;
        if (this.type === 'timer') {
            if (time % 1000 === 0) {
                timeSeconds -= 1;
            }
            this.x = gameArea.canvas.width / 2;
            this.y = 25;
            context.font = '20px Arial';
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.fillText(`Time remaining to match a trailer to each truck: ${timeSeconds} seconds.`, this.x, this.y);
        } else {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
            if (this.type === 'trailer') {
                context.font = '20px Arial';
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.fillText(this.plateNr, this.x + this.width / 2, this.y + this.height / 1.3);
            } else if (this.type === 'truck') {
                context.font = '15px Arial';
                context.fillStyle = 'black';
                context.textAlign = 'center';
                context.fillText(this.plateNr, this.x + this.width / 2, this.y + this.height / 1.4, this.width);
            }
        }
    };
    this.clicked = () => {
        let currentLeft = this.x;
        let currentRight = this.x + this.width;
        let currentTop = this.y;
        let currentBottom = this.y + this.height;
        if (currentBottom >= gameArea.y && currentTop <= gameArea.y && currentLeft <= gameArea.x && currentRight >= gameArea.x) {
            this.isClicked = true;
        } else this.isClicked = false;
    };
    this.matchDrop = (mouseUpCoords, plateNr) => {
        if (plateNr !== this.plateNr && mouseUpCoords.x >= this.x && mouseUpCoords.x <= this.x + this.width && mouseUpCoords.y >= this.y && mouseUpCoords.y <= this.y + this.height) {
            if (this.type === 'truck') {
                addMatch(trucks.find(v => v.plateNr === this.plateNr), trailers.find(v => v.plateNr === plateNr));
            } else if (this.type === 'trailer') {
                addMatch(trucks.find(v => v.plateNr === plateNr), trailers.find(v => v.plateNr === this.plateNr));
            }
        }
    };
};

function matchedTruckWithTrailer(truck, trailer) {
    this.x = 0;
    this.y = 0;
    this.truck = truck;
    this.trailer = trailer;
    this.width = truck.width + 2 + trailer.width;
    this.height = trailer.height;
    this.update = () => {
        context = gameArea.context;
        // fill truck
        context.fillStyle = truck.color;
        context.fillRect(this.x, this.y, truck.width, truck.height);
        context.font = '15px Arial';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.fillText(truck.plateNr, this.x + truck.width / 2, this.y + truck.height / 1.4, truck.width);
        // fill trailer
        context.fillStyle = trailer.color;
        context.fillRect(this.x + truck.width + 2, this.y, trailer.width, trailer.height);
        context.font = '20px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(trailer.plateNr, this.x + truck.width + trailer.width / 2, this.y + trailer.height / 1.3);
    };
}


function updateGameArea() {
    time -= 20;
    if (time <= 0) {
        gameArea.stop();
    }
    gameArea.clear();
    timer.update();
    trailers.forEach(trailer => {
        trailer.update();
    });
    trucks.forEach(truck => {
        truck.update();
    });
    positionMatched(matchedTrucksWithTrailers);
}

function getMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function generateTrailers(nrOfTrucks) {
    let startNr = 1;
    for (i = startNr; i <= nrOfTrucks; i++) {
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
        trailers.push(new component(90, 30, 'blue', `ABC${nrSeries}`, 'trailer'));
    }
}

function positionVehicles(vehiclesArray) { // TO DO: fix the max limit of vehicles possible to be drawn on the canvas or implement "waiting list" for drawing
    let marginLeft = 10;
    let marginRight = gameArea.canvas.width - 10;
    let marginTop = 40;
    let marginBottom = gameArea.canvas.height / 2;
    let spacing = 10;
    if (vehiclesArray[0].type === 'truck') {
        marginTop = gameArea.canvas.height / 2 + 10;
        marginBottom = gameArea.canvas.height;
        spacing = 30;
    }
    let lastX = marginLeft;
    let lastY = marginTop;
    let limitReached = false;

    vehiclesArray.forEach(vehicle => {
        if (!limitReached) {
            vehicle.x = lastX;
            vehicle.y = lastY;
            vehicle.update();
        }

        if (lastX + vehicle.width * 2 + spacing > marginRight) {
            lastX = marginLeft;
            if (lastY + vehicle.height * 2 + spacing > marginBottom) {
                limitReached = true;
            }
            else lastY += vehicle.height + spacing;
        } else {
            lastX += vehicle.width + spacing;
        }
    })
}

function generateTrucks(nrOfTrucks) {
    let startNr = 1;
    for (i = startNr; i <= nrOfTrucks; i++) {
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
        trucks.push(new component(30, 30, 'red', `X${nrSeries}`, 'truck'));
    }
}

function positionMatched(vehiclesArray) {
    let marginLeft = 10;
    let marginRight = gameArea.canvas.width - 10;
    let marginTop = gameArea.canvas.height - gameArea.canvas.height / 4;
    let marginBottom = gameArea.canvas.height;
    let spacing = 10;
    let lastX = marginLeft;
    let lastY = marginTop;

    vehiclesArray.forEach(vehicle => {
        vehicle.x = lastX;
        vehicle.y = lastY;
        vehicle.update();

        if (lastX + vehicle.width * 2 + spacing > marginRight) {
            lastX = marginLeft;
            if (lastY + vehicle.height * 2 + spacing > marginBottom) {
                limitReached = true;
            }
            else lastY += vehicle.height + spacing;
        } else {
            lastX += vehicle.width + spacing;
        }
    })
}

function addMatch(truck, trailer) {
    matchedTrucksWithTrailers.push(new matchedTruckWithTrailer(truck, trailer));
}