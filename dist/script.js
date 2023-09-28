"use strict";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
let audioPath = {
    eat: "./eat.mp3",
    over: "./over.mp3",
    move: "./move.mp3"
};
let audio = new Audio();
let playAudio = (path) => {
    audio.src = path;
    // audio.play()
};
let score = 0;
let wCol = true;
let bCol = true;
let canPress = false;
const h1 = document.getElementById('score');
let hiScore = localStorage.getItem("score") || "0";
canvas.width = 450;
canvas.height = 450;
var DIR;
(function (DIR) {
    DIR[DIR["UP"] = 0] = "UP";
    DIR[DIR["DOWN"] = 1] = "DOWN";
    DIR[DIR["LEFT"] = 2] = "LEFT";
    DIR[DIR["RIGHT"] = 3] = "RIGHT";
})(DIR || (DIR = {}));
let s = 17;
let defX = Math.floor(s / 2);
let defY = Math.floor(s / 2);
let x = 0;
let y = 0;
let a = canvas.width / s;
let borderS = 2;
let borderA = 4;
let dir = DIR.RIGHT;
class Snake {
    x = defX;
    y = defY;
    // head: Cube = {x:this.x, y:this.y}
    squares = [{ x: this.x, y: this.y }];
    updatePos() {
        this.squares[0] = { x: this.x, y: this.y };
    }
    add() {
        this.squares.push({ x: x, y: y });
        score++;
    }
    reset() {
        this.x = defX;
        this.y = defY;
        this.squares = [{ x: this.x, y: this.y }];
        score = 0;
        playAudio(audioPath.over);
    }
    total() {
        return this.squares.length;
    }
    collide() {
        if (wCol) {
            if ((this.x * a) + a > canvas.width || (this.y * a) + a > canvas.height ||
                this.x * a < 0 || this.y * a < 0) {
                window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                console.log("COLLIDE");
                this.reset();
            }
        }
        else {
            if ((this.x * a) + a > canvas.width) {
                this.x = 0;
            }
            if ((this.y * a) + a > canvas.height) {
                this.y = 0;
            }
            if (this.x * a < 0) {
                this.x = s;
            }
            if (this.y * a < 0) {
                this.y = s;
            }
        }
        if (bCol) {
            if (snake.total() > 1) {
                for (let i = 1; i < snake.total(); i++) {
                    if (this.squares[0].x == this.squares[i].x && this.squares[0].y == this.squares[i].y) {
                        this.reset();
                    }
                }
            }
        }
    }
}
class Apple {
    x = 0;
    y = 0;
    respawn() {
        this.x = Math.floor(Math.random() * s);
        this.y = Math.floor(Math.random() * s);
    }
    collide(s) {
        for (let square of s.squares) {
            if (square.x == this.x && square.y == this.y) {
                if (square == s.squares[0]) {
                    s.add();
                    playAudio(audioPath.eat);
                }
                this.respawn();
                this.collide(s);
                break;
            }
        }
    }
    constructor() {
        this.respawn();
    }
}
let snake = new Snake();
let apple = new Apple();
const keyEvent = (e) => {
    if (canPress) {
        // playAudio(audioPath.move)
        switch (e.key) {
            case "ArrowLeft":
                if (dir != DIR.RIGHT) {
                    dir = DIR.LEFT;
                }
                break;
            case "ArrowRight":
                if (dir != DIR.LEFT) {
                    dir = DIR.RIGHT;
                }
                break;
            case "ArrowUp":
                if (dir != DIR.DOWN) {
                    dir = DIR.UP;
                }
                break;
            case "ArrowDown":
                if (dir != DIR.UP) {
                    dir = DIR.DOWN;
                }
                break;
        }
        canPress = false;
    }
};
window.addEventListener('keydown', keyEvent);
const render = () => {
    for (let i = snake.squares.length - 1; i > 0; i--) {
        snake.squares[i] = {
            x: snake.squares[i - 1].x, y: snake.squares[i - 1].y
        };
    }
    snake.updatePos();
    for (let i = snake.squares.length - 1; i >= 0; i--) {
        ctx.fillStyle = "#61ff3d";
        ctx.fillRect(snake.squares[i].x * a, snake.squares[i].y * a, a, a);
        ctx.fillStyle = `rgb(2, 66, 13,${(snake.total() - i) / snake.total()})`;
        ctx.fillRect(snake.squares[i].x * a + borderS, snake.squares[i].y * a + borderS, a - borderS * 2, a - borderS * 2);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(apple.x * a + borderA, apple.y * a + borderA, a - borderA * 2, a - borderA * 2);
    ctx.fillStyle = "black";
};
const game = () => {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    switch (dir) {
        case DIR.RIGHT:
            snake.x++;
            break;
        case DIR.LEFT:
            snake.x--;
            break;
        case DIR.UP:
            snake.y--;
            break;
        case DIR.DOWN:
            snake.y++;
            break;
    }
    snake.collide();
    apple.collide(snake);
    if (score > Number(hiScore) && wCol && bCol) {
        localStorage.setItem("score", String(score));
        hiScore = localStorage.getItem("score");
    }
    h1.textContent = `Score: ${score}`;
    document.getElementById("wallCol").textContent = `Wall Collision: ${wCol}`;
    document.getElementById("bodyCol").textContent = `Body Collision: ${bCol}`;
    document.getElementById("hi-score").textContent = `Highest Score: ${hiScore}`;
    render();
    canPress = true;
};
function setWCol() { wCol = !wCol; }
function setBCol() { bCol = !bCol; }
setInterval(game, 80);
