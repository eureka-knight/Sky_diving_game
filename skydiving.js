const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOver');
const usernameForm = document.getElementById('usernameForm');
const welcomeMessage = document.getElementById('welcomeMessage');
const startButton = document.getElementById('startGame');
const playAgainButton = document.getElementById('playAgain');
const usernameInput = document.getElementById('username');
const owner = document.getElementById('owner');
const title = document.getElementById('title');





// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game state variables
let score;
let gameOver;
let gameStarted;

// Skydiver and bird properties
const skydiver = {
    x: canvas.width / 2,
    y: 10,
    width: 90,
    height: 110,
    speed: 6,
};

const birds = [];
const numBirds = 5;
const initialSpeed = 2; // Initial speed of birds
const acceleration = 0.005; // Acceleration in pixels per frame squared

function initializeBirds() {
    birds.length = 0; // Clear existing birds
    for (let i = 0; i < numBirds; i++) {
        birds.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 200, // Start below the canvas
            width: 40,
            height: 20,
            
            speed: initialSpeed, // Initial speed
            acceleration: acceleration, // Acceleration value
        });
    }
}

// Initialize game state
function initializeGame() {
    score = 0;
    gameOver = false;
    gameStarted = false;

    // Reset skydiver position
    skydiver.x = canvas.width / 2;
    skydiver.y = 10;

    initializeBirds();
}

// Keyboard controls
const keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// Draw skydiver
// Load the skydiver image
const skydiverImage = new Image();
skydiverImage.src = 'skydiver_image.png'; // Replace with the correct path to your image

function drawSkydiver() {
    if (skydiverImage.complete) {
        ctx.drawImage(skydiverImage, skydiver.x, skydiver.y, skydiver.width, skydiver.height);
    } else {
        skydiverImage.onload = function () {
            ctx.drawImage(skydiverImage, skydiver.x, skydiver.y, skydiver.width, skydiver.height);
        };
    }
}

// Draw birds
// Load the bird image
const birdImage = new Image();
birdImage.src = 'bird_image.png'; // Replace with the path to your bird image

function drawBirds() {
    birds.forEach(bird => {
        if (birdImage.complete) {
            ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
        } else {
            birdImage.onload = function () {
                ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
            };
        }
    });
}


// Draw score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Draw game over screen
function showGameOver() {
    // gameOverScreen.textContent = `Game Over! Final Score: ${score}`;
    gameOverScreen.style.display = 'block';
    cancelAnimationFrame(animationId); // Stop animation
}

// Check for collision
function checkCollision() {
    birds.forEach(bird => {
        // Calculate the distance between the skydiver and the bird
        const distX = Math.abs(skydiver.x + skydiver.width / 2 - (bird.x + bird.width / 2));
        const distY = Math.abs(skydiver.y + skydiver.height / 2 - (bird.y + bird.height / 2));

        // Check if the distance in both X and Y is less than the sum of their half widths/heights
        if (distX < (skydiver.width / 2 + bird.width / 2) &&
            distY < (skydiver.height / 2 + bird.height / 2)) {
            gameOver = true;
            showGameOver();
        }
    });
}


// Update positions
function update() {
    if (gameOver) return;

    if (keys['ArrowUp']) skydiver.y -= skydiver.speed;
    if (keys['ArrowDown']) skydiver.y += skydiver.speed;
    if (keys['ArrowLeft']) skydiver.x -= skydiver.speed;
    if (keys['ArrowRight']) skydiver.x += skydiver.speed;

    birds.forEach(bird => {
        bird.speed += bird.acceleration; // Apply acceleration to speed
        bird.y -= bird.speed; // Move birds upward
        if (bird.y < -bird.height) { // If bird moves off the top
            bird.y = canvas.height; // Reset bird position to the bottom
            bird.x = Math.random() * canvas.width;
            // Do not reset speed; continue increasing speed with acceleration
            score++; // Increment score when a bird successfully avoids the skydiver
        }
    });

    checkCollision();
}

// Render the game
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSkydiver();
    drawBirds();
    drawScore();
}

// Main game loop
function gameLoop() {
    update();
    render();
    if (!gameOver) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Start the game loop
let animationId;
function startGame() {
    usernameForm.style.display = 'none'; // Hide username form
    title.style.display = 'none';  // hide titles
    owner.style.display = 'none';  // hide name
    welcomeMessage.style.display = 'block'; // Show welcome message

    setTimeout(() => {
        welcomeMessage.style.display = 'none'; // Hide welcome message after 3 seconds
        gameStarted = true;
        gameLoop(); // Start the game loop
    }, 3000);
}

// Handle form submission
startButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        welcomeMessage.textContent = `Good Luck, ${username}!`;
        initializeGame();
        startGame();
    } else {
        alert('Please enter a username.');
    }
});

// Handle play again button
playAgainButton.addEventListener('click', () => {
    resetGame();
});

// Reset game state
function resetGame() {
    initializeGame();
    gameOverScreen.style.display = 'none'; // Hide game over screen
    usernameForm.style.display = 'none'; // Hide username form if still visible
    welcomeMessage.style.display = 'none'; // Hide welcome message if visible

    startGame(); // Restart the game
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
