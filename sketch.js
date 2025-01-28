let cat = {
    x: 200,
    y: 200,
    size: 50,
    speed: 3
};

let gameStartTime = 0;
let isGameOver = false;
let score = 0;
let bestScore = 0;
let isGameStarted = false;
let startButton;

function setup() {
    const canvas = createCanvas(400, 400);
    canvas.parent('main');
    
    startButton = select('#startButton');
    startButton.mousePressed(startGame);
    
    resetGame();
}

function startGame() {
    isGameStarted = true;
    gameStartTime = millis();
    startButton.attribute('disabled', '');
}

function resetGame() {
    cat.x = width / 2;
    cat.y = height / 2;
    isGameStarted = false;
    isGameOver = false;
    score = 0;
    startButton.removeAttribute('disabled');
}

function draw() {
    background(240);
    
    if (!isGameStarted) {
        // ゲーム開始前の表示
        drawCat();
        fill(0);
        textSize(24);
        textAlign(CENTER, CENTER);
        text('スタートボタンを押してください', width/2, height/2 - 100);
    } else if (!isGameOver) {
        // ゲーム中
        score = floor((millis() - gameStartTime) / 1000);
        updateCatPosition();
        drawCat();
        checkCollision();
        displayScore();
    } else {
        // ゲームオーバー時
        displayGameOver();
    }
}

function updateCatPosition() {
    // マウスと猫の距離を計算
    let dx = mouseX - cat.x;
    let dy = mouseY - cat.y;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance < 150) {  // マウスが近づいたら逃げる
        // マウスの反対方向に移動
        cat.x -= (dx / distance) * cat.speed;
        cat.y -= (dy / distance) * cat.speed;
    }
    
    // 画面外に出ないように制限
    cat.x = constrain(cat.x, cat.size/2, width - cat.size/2);
    cat.y = constrain(cat.y, cat.size/2, height - cat.size/2);
}

function drawCat() {
    push();
    translate(cat.x, cat.y);
    
    // 猫の体
    fill(255, 255, 0); // 黄色
    noStroke();
    circle(0, 0, cat.size);
    
    // 耳
    triangle(-25, -12, -15, -25, -5, -12);
    triangle(25, -12, 15, -25, 5, -12);
    
    // 目
    fill(0);
    circle(-7, -2, 5);
    circle(7, -2, 5);
    
    // 鼻
    fill(255, 105, 180);
    circle(0, 3, 3);
    
    pop();
}

function checkCollision() {
    let distance = dist(mouseX, mouseY, cat.x, cat.y);
    if (distance < cat.size/2) {
        isGameOver = true;
        if (score > bestScore) {
            bestScore = score;
        }
        startButton.removeAttribute('disabled');
    }
}

function displayScore() {
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text('時間: ' + score + '秒', 10, 10);
}

function displayGameOver() {
    background(240, 240, 240, 200);
    
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('ゲームオーバー!', width/2, height/2 - 40);
    textSize(24);
    text('スコア: ' + score + '秒', width/2, height/2);
    text('ベストスコア: ' + bestScore + '秒', width/2, height/2 + 30);
    
    textSize(16);
    text('スタートボタンでリスタート', width/2, height/2 + 70);
}
