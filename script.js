const menu = document.getElementById("menu");
const playButton = document.getElementById("playButton");
const scoreText = document.getElementById("score");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Estado do jogo
let gameRunning = false;
let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;

const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 100,
    size: 40,
    speed: 8
};

const keys = {};
const obstacles = [];
let obstacleSpeed = 4;

// Estrelas
const stars = [];

for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1
    });
}

// Controles
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// Botão jogar
playButton.onclick = () => {

    menu.style.display = "none";
    scoreText.style.display = "block";

    score = 0;
    obstacles.length = 0;

    player.x = canvas.width / 2 - 20;

    gameRunning = true;

};

// Criar obstáculo
function createObstacle() {

    obstacles.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40
    });

}

// Atualização
function update() {

    if (!gameRunning) return;

    // Movimento
    if (keys["ArrowLeft"] || keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"] || keys["d"]) {
        player.x += player.speed;
    }

    if (player.x < 0) player.x = 0;

    if (player.x > canvas.width - player.size) {
        player.x = canvas.width - player.size;
    }

    // Obstáculos
    if (Math.random() < 0.02) {
        createObstacle();
    }

    obstacleSpeed = 4 + score / 250;

    for (let i = obstacles.length - 1; i >= 0; i--) {

        const obstacle = obstacles[i];

        obstacle.y += obstacleSpeed;

        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1);
            continue;
        }

        // Colisão
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.size > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.size > obstacle.y
        ) {

            gameRunning = false;

            if (score > highScore) {
                highScore = Math.floor(score);
                localStorage.setItem("highScore", highScore);
            }

            alert(
                "💥 GAME OVER!\n\n" +
                "Pontuação: " + Math.floor(score) +
                "\nRecorde: " + highScore
            );

            location.reload();

        }

    }

    score += 0.1;

}

// Desenho
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estrelas
    ctx.fillStyle = "white";

    for (let star of stars) {

        ctx.fillRect(star.x, star.y, star.size, star.size);

        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }

    }

    // Jogador
    if (gameRunning) {

        ctx.shadowBlur = 25;
        ctx.shadowColor = "#00ff99";
        ctx.fillStyle = "#00ff99";

        ctx.fillRect(
            player.x,
            player.y,
            player.size,
            player.size
        );

    }

    // Obstáculos
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff3333";
    ctx.fillStyle = "#ff3333";

    for (const obstacle of obstacles) {

        ctx.fillRect(
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
        );

    }

    scoreText.innerHTML =
        `PONTOS: ${Math.floor(score)}<br>RECORDE: ${highScore}`;

    update();

    requestAnimationFrame(draw);

}

draw();