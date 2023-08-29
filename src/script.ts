const log = console.log
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let score = 0;
const h1 = document.getElementById('score') as HTMLHeadingElement

canvas.width = 500
canvas.height = 500
enum DIR {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

let s = 25
let defX = Math.floor(s/2)
let defY = Math.floor(s/2)

let x = 0;
let y = 0;
let a = canvas.width/s;
let border: number = 2;


let dir: DIR = DIR.RIGHT

interface Cube{
    x:number,
    y:number,
}

class Snake{
    x = defX;
    y = defY;

    // head: Cube = {x:this.x, y:this.y}

    squares: Cube[] = [{x:this.x, y:this.y}]

    updatePos(){
        this.squares[0] = {x:this.x, y:this.y}
    }

    add(){
        this.squares.push({x:x,y:y})
        score++;
    }

    reset(){
        this.x = defX;
        this.y = defY
        this.squares = [{x:this.x,y:this.y}]
        score = 0;
    }

    collide(){

        if(this.x * a > canvas.width || this.y * a > canvas.height ||
            this.x * a < 0 || this.y * a < 0){
                this.reset()
                
                render();
        }

        if(this.squares.length > 1){
            for(let i = 1; i < this.squares.length; i++){
                if(this.squares[0].x == this.squares[i].x && this.squares[0].y == this.squares[i].y){
                    this.reset();
                }
            }
        }
    }
}

class Apple{
    x = 0;
    y = 0;

    respawn(){
        this.x = Math.floor(Math.random() * s)
        this.y = Math.floor(Math.random() * s)
    }

    collide(s: Snake){
        for(let square of s.squares){
            if(square.x == this.x && square.y == this.y){
                if(square == s.squares[0]){
                    s.add();
                }
                this.respawn()
                this.collide(s)
                break;
            }
        }
    }

    constructor(){
        this.respawn()
    }
}

let snake = new Snake()
let apple = new Apple()

const keyEvent = (e: KeyboardEvent) => {
    log(e.key)
    switch(e.key){
        case "ArrowLeft":
            if(dir != DIR.RIGHT){
                dir = DIR.LEFT
            }
            break;
        case "ArrowRight":
            if(dir != DIR.LEFT){
                dir = DIR.RIGHT
            }
            break;
        case "ArrowUp":
            if(dir != DIR.DOWN){
                dir = DIR.UP
            }
            break;
        case "ArrowDown":
            if(dir != DIR.UP){
                dir = DIR.DOWN
            }
            break;
    }
}

window.addEventListener('keydown', keyEvent)

const render = () => {

    for(let i = snake.squares.length - 1; i > 0; i--){
        snake.squares[i] = {
            x:snake.squares[i - 1].x, y:snake.squares[i - 1].y
        }
    }
    snake.updatePos()

    for(let square of snake.squares){
        ctx.fillRect(
            square.x * a + border, 
            square.y * a + border, 
            a - border * 2, 
            a - border * 2)
    }

    ctx.fillStyle = "red"
    ctx.fillRect(
        apple.x * a + border, 
        apple.y * a + border, 
        a - border * 2, 
        a - border * 2)
    ctx.fillStyle = "black"
}

setInterval(() => {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    render();
    h1.textContent = `Score: ${score}`
    snake.collide();
    apple.collide(snake);
    switch(dir){
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
}, 100)

// while(1){
//     
// }

log("Hello World")  