// Variables globales y configuración básica
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameSpeed = 5;
let gravity = 0.5;
let gameOver = false;
let score = 0;
let highScore = 0;

// Objeto dinosaurio
let dino = {
    x: 50,
    y: canvas.height - 47,
    width: 44,
    height: 47,
    vy: 0,
    isJumping: false
};

// Objeto obstáculo (cacto)
let obstacle = {
    x: canvas.width,
    y: canvas.height - 40,
    width: 25,
    height: 40
};

// Carga de imágenes
let dinoImg = new Image();
dinoImg.src = "img/dino.png";
let cactusImg = new Image();
cactusImg.src = "img/cactus.png";

// Función principal del ciclo de juego
function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Actualiza posiciones y controla la lógica del juego
function update() {
    score++;

    // Aumentar velocidad cada 100 puntos
    if (score % 100 === 0 && score !== 0) {
        gameSpeed += 0.5;
    }

    // Física del salto
    if (dino.isJumping) {
        dino.vy += gravity;
        dino.y += dino.vy;
        if (dino.y >= canvas.height - dino.height) {
            dino.y = canvas.height - dino.height;
            dino.isJumping = false;
            dino.vy = 0;
        }
    }

    // Movimiento del obstáculo
    obstacle.x -= gameSpeed;
    if (obstacle.x + obstacle.width < 0) {
        obstacle.x = canvas.width + Math.random() * 200;
    }

    // Colisión
    if (collision(dino, obstacle)) {
        gameOver = true;
        if (score > highScore) {
            highScore = score;
        }
        document.getElementById("restartBtn").style.display = "block";
    }
}

// Detección de colisiones
function collision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Dibujo del juego
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Puntajes
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
    ctx.fillText("High Score: " + highScore, 10, 50);

    // Dino
    if (dinoImg.complete) {
        ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    } else {
        ctx.fillStyle = dino.isJumping ? "orange" : "green"; // Color cambia al saltar
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }

    // Cactus
    if (cactusImg.complete) {
        ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    } else {
        ctx.fillStyle = "brown";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

// Salto con espacio
document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !dino.isJumping && !gameOver) {
        dino.isJumping = true;
        dino.vy = -10;
        e.preventDefault();
    }
});

// Botón de reinicio automático
document.getElementById("restartBtn").addEventListener("click", function() {
    gameOver = false;
    score = 0;
    gameSpeed = 5;
    dino.y = canvas.height - dino.height;
    dino.isJumping = false;
    dino.vy = 0;
    obstacle.x = canvas.width;
    this.style.display = "none";
    gameLoop();
});


// Inicia el juego
window.onload = function() {
    gameLoop();
};