const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// USUARIO
const user = {
        x: 0,
        y: canvas.height/2 - 100/2,
        width: 20,
        height: 120,
        color: "WHITE",
        score: 0
}

//adversario
const com = {
        x: canvas.width - 20,
        y: canvas.height/2 - 100/2,
        width: 20,
        height: 120,
        color: "WHITE",
        score: 0
}

// bola
const ball = {
        x: canvas.width/2,
        y: canvas.height/2,
        radius: 12,
        speed: 10,
        velocityX: 8,
        velocityY: 8,
        color: "WHITE"
}

// linha central
const net = {
        x: canvas.width/2 - 1,
        y: 0,
        width: 2,
        height: 10,
        color: "WHITE"
}

// desenhando a linha
function drawNet(){
        for(let i = 0; i <= canvas.height; i+=15){
                drawRect(net.x, net.y + i, net.width, net.height, net.color);
        }
}

// desenharfundo
function drawRect(x,y,w,h,color){
        context.fillStyle = color;
        context.fillRect(x,y,w,h);
}

//  desenhar a bola
function desenharbola(x,y,r,color){
        context.fillStyle = color;
        context.beginPath();
        context.arc(x,y,r,0,Math.PI*2,false);
        context.closePath();
        context.fill();
}


function Escrevertexto(text,x,y,color){
        context.fillStyle = color;
        context.font = "45px Courier New";
        context.fillText(text,x,y);
}

// controle MOUSEMOVE
canvas.addEventListener("mousemove",moverpaddle);

function moverpaddle(evt){
        let rect = canvas.getBoundingClientRect();
        user.y = evt.clientY - rect.top - user.height/2;
}

// detectar colisao
function colisao(b,p){
        b.top = b.y - b.radius;
        b.bottom = b.y + b.radius;
        b.left = b.x - b.radius;
        b.right = b.x + b.radius;

        p.top = p.y;
        p.bottom = p.y + p.height;
        p.left = p.x;
        p.right = p.x + p.width;

        return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}


function resetarBola(){
        ball.x = canvas.width/2;
        ball.y = canvas.height/2;
        ball.velocityX = -ball.velocityX;
        ball.speed = 10;
}

function update(){
    
        // Muda o score qnd sai da area 
        if( ball.x - ball.radius < 0 ){
            com.score++;
            resetarBola();
        }else if( ball.x + ball.radius > canvas.width){
            user.score++;
            resetarBola();
        }

        // Aumentar a velocidade da bola
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
        
        // MOvimento do adversario
        com.y += ((ball.y - (com.y + com.height/2)))*0.1;
        
        // quando a bola bate em cima ou em baixo, aumentar a velocidade Y
        if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
            ball.velocityY = -ball.velocityY;
        }
        
        // Checar se bateu no adversario ou no jogador
        let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
        
        // se a bola bater no player
        if(colisao(ball,player)){
            
            let collidePoint = (ball.y - (player.y + player.height/2));
           
            collidePoint = collidePoint / (player.height/2);
            
            // fazer a bola mudar de direção qnd bate
            let angleRad = (Math.PI/4) * collidePoint;
            
            // mudar a velocidade horizontal e vertical
            let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);
            
          // aumenta a velocidade qnd bate em um paddle
            ball.speed += 0.5;
        }
        
        
        if(ball.speed >= 30){
                ball.speed = 30;
        }
    }

// Render the Game
function render(){
        // Clear the canvas
        drawRect(0,0, canvas.clientWidth, canvas.clientHeight, "BLACK");

        // Draw the net
        drawNet();

        //Draw the score
        Escrevertexto(user.score, canvas.width/4, canvas.height/8, "WHITE");
        Escrevertexto(com.score, 3*canvas.width/4, canvas.height/8, "WHITE");

        // Draw the user and computer paddle
        drawRect(user.x, user.y, user.width, user.height, user.color);
        drawRect(com.x, com.y, com.width, com.height, com.color);

        // Draw the ball
        desenharbola(ball.x, ball.y, ball.radius, ball.color);
}

// Game Init
function game(){
        update();
        render();
}

// Loop
const framePerSecond = 60;
setInterval(game, 1000/framePerSecond);