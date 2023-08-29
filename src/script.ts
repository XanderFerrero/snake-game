const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let score = 0;
let wCol = true;
let bCol = true;

const h1 = document.getElementById('score') as HTMLHeadingElement
let hiScore: string = localStorage.getItem("score") || "0";

canvas.width = 450
canvas.height = 450

enum DIR {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

let s = 17
let defX = Math.floor(s/2)
let defY = Math.floor(s/2)

let x = 0;
let y = 0;
let a = canvas.width/s;
let borderS: number = 2;
let borderA: number = 4;


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

    total(){
        return this.squares.length
    }

    collide(){
        if(wCol){
            if((this.x * a) + a > canvas.width || (this.y * a) + a > canvas.height ||
                this.x * a < 0 || this.y * a < 0){
                    console.log("COLLIDE")
                    this.reset()
            }
        }else{
            if((this.x * a) + a > canvas.width){
                this.x = 0;
            }
    
            if((this.y * a) + a  > canvas.height){
                this.y = 0;
            }   
    
            if(this.x * a < 0){
                this.x = s;
            }
        }

        if(bCol){
            if(this.y * a < 0){
                this.y = s;
            }
        }

        if(snake.total() > 1){
            for(let i = 1; i < snake.total(); i++){
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

    for(let i = 0; i < snake.squares.length; i++){
        
        ctx.fillStyle = "#61ff3d"
        
        ctx.fillRect(
            snake.squares[i].x * a, 
            snake.squares[i].y * a, 
            a, 
            a)
            
        ctx.fillStyle = `rgb(2, 66, 13,${(snake.total() - i)/snake.total()})`
        ctx.fillRect(
            snake.squares[i].x * a + borderS, 
            snake.squares[i].y * a + borderS, 
            a - borderS * 2, 
            a - borderS * 2)
    }

    ctx.fillStyle = "red"
    ctx.fillRect(
        apple.x * a + borderA, 
        apple.y * a + borderA, 
        a - borderA * 2, 
        a - borderA * 2)
    ctx.fillStyle = "black"
}

const game = () => {
    ctx.fillRect(0,0, canvas.width, canvas.height)
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
    snake.collide();
    apple.collide(snake);

    if(score > Number(hiScore) && wCol && bCol){
        localStorage.setItem("score", String(score))
        hiScore = localStorage.getItem("score")!
    }

    h1.textContent = `Score: ${score}`
    document.getElementById("wallCol")!.textContent =  `Wall Collision: ${wCol}`
    document.getElementById("bodyCol")!.textContent =  `Body Collision: ${bCol}`
    document.getElementById("hi-score")!.textContent = `Highest Score: ${hiScore}`
    render();
}

function setWCol() {wCol = !wCol}
function setBCol() {bCol = !bCol}

setInterval(game, 80)    