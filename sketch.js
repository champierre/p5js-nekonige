let cat = {
    x: 200,
    y: 200,
    size: 50,
    speed: 2,
    isMoving: false,
    animationFrame: 0
};

let mouse = {
    x: 100,
    y: 100,
    size: 40,
    speed: 4,
    isMoving: false,
    animationFrame: 0
};

let gameStartTime = 0;
let isGameOver = false;
let score = 0;
let bestScore = 0;
let isGameStarted = false;
let startButton;

// キーの状態を保持する変数
let keys = {
    left: false,
    right: false,
    up: false,
    down: false
};

function setup() {
    const canvas = createCanvas(400, 400);
    canvas.parent('main');
    
    startButton = select('#startButton');
    startButton.mousePressed(startGame);
    
    resetGame();
}

function startGame() {
    resetGame();
    isGameStarted = true;
    gameStartTime = millis();
    startButton.attribute('disabled', '');
    
    // ネコとネズミの位置をランダムに設定
    cat.x = random(30 + cat.size/2, width - 30 - cat.size/2);
    cat.y = random(30 + cat.size/2, height - 30 - cat.size/2);
    
    // ネズミの位置をネコから離れた位置に設定
    do {
        mouse.x = random(30 + mouse.size/2, width - 30 - mouse.size/2);
        mouse.y = random(30 + mouse.size/2, height - 30 - mouse.size/2);
    } while (dist(cat.x, cat.y, mouse.x, mouse.y) < 150); // 最低150ピクセル離す
}

function resetGame() {
    cat.x = width / 2;
    cat.y = height / 2;
    mouse.x = width / 4;
    mouse.y = height / 4;
    isGameStarted = false;
    isGameOver = false;
    score = 0;
    startButton.removeAttribute('disabled');
}

function keyPressed() {
    if (!isGameStarted || isGameOver) return;
    
    if (keyCode === LEFT_ARROW) {
        mouse.x -= mouse.speed;
        mouse.isMoving = !mouse.isMoving;
    } else if (keyCode === RIGHT_ARROW) {
        mouse.x += mouse.speed;
        mouse.isMoving = !mouse.isMoving;
    } else if (keyCode === UP_ARROW) {
        mouse.y -= mouse.speed;
        mouse.isMoving = !mouse.isMoving;
    } else if (keyCode === DOWN_ARROW) {
        mouse.y += mouse.speed;
        mouse.isMoving = !mouse.isMoving;
    }
    
    // 画面外に出ないように制限
    mouse.x = constrain(mouse.x, 30 + mouse.size/2, width - 30 - mouse.size/2);
    mouse.y = constrain(mouse.y, 30 + mouse.size/2, height - 30 - mouse.size/2);
}

function draw() {
    background(240);
    drawStage();
    
    // アニメーションフレームの更新
    if (frameCount % 10 === 0) {  // 10フレームごとに更新
        if (cat.isMoving) cat.animationFrame = (cat.animationFrame + 1) % 2;
        if (mouse.isMoving) mouse.animationFrame = (mouse.animationFrame + 1) % 2;
    }
    
    if (!isGameStarted) {
        // ゲーム開始前の表示
        drawCat();
        drawMouse();
        fill(0);
        textSize(24);
        textAlign(CENTER, CENTER);
        text('スタートボタンを押してください', width/2, height/2 - 100);
    } else if (!isGameOver) {
        // ゲーム中
        score = floor((millis() - gameStartTime) / 1000);
        
        // キーの状態に基づいて移動処理
        if (isGameStarted && !isGameOver) {
            if (keys.left) {
                mouse.x -= mouse.speed;
            }
            if (keys.right) {
                mouse.x += mouse.speed;
            }
            if (keys.up) {
                mouse.y -= mouse.speed;
            }
            if (keys.down) {
                mouse.y += mouse.speed;
            }
            
            // 画面外に出ないように制限
            mouse.x = constrain(mouse.x, 30 + mouse.size/2, width - 30 - mouse.size/2);
            mouse.y = constrain(mouse.y, 30 + mouse.size/2, height - 30 - mouse.size/2);
        }
        
        updateCatPosition();
        drawCat();
        drawMouse();
        checkCollision();
        displayScore();
    } else {
        // ゲームオーバー時
        displayGameOver();
    }
}

function drawCat() {
    push();
    translate(cat.x, cat.y);
    
    // 猫の体
    fill(255, 255, 0); // 黄色
    noStroke();
    circle(0, 0, cat.size);
    
    // 耳
    if (cat.isMoving) {
        if (cat.animationFrame === 0) {
            // 動いているとき(フレーム1)
            triangle(-25, -8, -15, -18, -5, -8);
            triangle(25, -8, 15, -18, 5, -8);
        } else {
            // 動いているとき(フレーム2)
            triangle(-25, -12, -15, -22, -5, -12);
            triangle(25, -12, 15, -22, 5, -12);
        }
    } else {
        // 止まっているとき
        triangle(-25, -12, -15, -25, -5, -12);
        triangle(25, -12, 15, -25, 5, -12);
    }
    
    // 目
    fill(0);
    if (cat.isMoving) {
        if (cat.animationFrame === 0) {
            // 動いているとき(フレーム1)
            ellipse(-7, -2, 5, 3);
            ellipse(7, -2, 5, 3);
        } else {
            // 動いているとき(フレーム2)
            ellipse(-7, -2, 5, 1);
            ellipse(7, -2, 5, 1);
        }
    } else {
        // 止まっているとき
        circle(-7, -2, 5);
        circle(7, -2, 5);
    }
    
    // 鼻
    fill(255, 105, 180);
    circle(0, 3, 3);
    
    // ヒゲ(動きに応じて角度を変える)
    stroke(100);
    strokeWeight(1);
    if (cat.isMoving) {
        // 動いているときはヒゲを後ろに流す
        line(-2, 3, -15, 6);
        line(-2, 3, -15, 8);
        line(-2, 3, -15, 10);
        line(2, 3, 15, 6);
        line(2, 3, 15, 8);
        line(2, 3, 15, 10);
    } else {
        // 止まっているときは通常のヒゲ
        line(-2, 3, -15, 0);
        line(-2, 3, -15, 3);
        line(-2, 3, -15, 6);
        line(2, 3, 15, 0);
        line(2, 3, 15, 3);
        line(2, 3, 15, 6);
    }
    
    pop();
}

function drawMouse() {
    push();
    translate(mouse.x, mouse.y);
    
    // ネズミの体
    fill(150); // グレー
    noStroke();
    circle(0, 0, mouse.size);
    
    // 耳
    fill(200);
    if (mouse.isMoving) {
        if (mouse.animationFrame === 0) {
            // 動いているとき(フレーム1)
            ellipse(-15, -10, 15, 10);
            ellipse(15, -10, 15, 10);
        } else {
            // 動いているとき(フレーム2)
            ellipse(-15, -14, 15, 14);
            ellipse(15, -14, 15, 14);
        }
    } else {
        // 止まっているとき
        ellipse(-15, -15, 15, 15);
        ellipse(15, -15, 15, 15);
    }
    
    // 目
    fill(0);
    if (mouse.isMoving) {
        if (mouse.animationFrame === 0) {
            // 動いているとき(フレーム1)
            ellipse(-5, -5, 4, 3);
            ellipse(5, -5, 4, 3);
        } else {
            // 動いているとき(フレーム2)
            ellipse(-5, -5, 4, 1);
            ellipse(5, -5, 4, 1);
        }
    } else {
        // 止まっているとき
        circle(-5, -5, 4);
        circle(5, -5, 4);
    }
    
    // 鼻
    fill(255, 192, 203);
    circle(0, 0, 5);
    
    // ヒゲ
    stroke(100);
    strokeWeight(1);
    if (mouse.isMoving) {
        // 動いているときはヒゲを後ろに流す
        line(-2, 0, -15, -3);
        line(-2, 0, -15, 2);
        line(-2, 0, -15, 7);
        line(2, 0, 15, -3);
        line(2, 0, 15, 2);
        line(2, 0, 15, 7);
    } else {
        // 止まっているときは通常のヒゲ
        line(-2, 0, -15, -5);
        line(-2, 0, -15, 0);
        line(-2, 0, -15, 5);
        line(2, 0, 15, -5);
        line(2, 0, 15, 0);
        line(2, 0, 15, 5);
    }
}

function displayScore() {
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text('時間: ' + score + '秒', 10, 10);
}

// キーが押されたときの処理
function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        keys.left = true;
    } else if (keyCode === RIGHT_ARROW) {
        keys.right = true;
    } else if (keyCode === UP_ARROW) {
        keys.up = true;
    } else if (keyCode === DOWN_ARROW) {
        keys.down = true;
    }
}

// キーが離されたときの処理
function keyReleased() {
    if (keyCode === LEFT_ARROW) {
        keys.left = false;
    } else if (keyCode === RIGHT_ARROW) {
        keys.right = false;
    } else if (keyCode === UP_ARROW) {
        keys.up = false;
    } else if (keyCode === DOWN_ARROW) {
        keys.down = false;
    }
}

function displayGameOver() {
    background(240, 240, 240, 200);
    
    pop();
}

function mousePressed() {
    // キャンバス内のクリックのみを処理
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        if (isGameOver) {
            resetGame();
        }
    }
}

function drawStage() {
    // ステージの枠を描画
    push();
    strokeWeight(4);
    stroke(100);
    noFill();
    rect(10, 10, width - 20, height - 20);
    
    // 角の装飾
    const cornerSize = 20;
    // 左上
    line(10, 30, 30, 10);
    // 右上
    line(width - 30, 10, width - 10, 30);
    // 左下
    line(10, height - 30, 30, height - 10);
    // 右下
    line(width - 30, height - 10, width - 10, height - 30);
    pop();
}

function updateCatPosition() {
    // ネズミと猫の距離を計算
    let dx = mouse.x - cat.x;
    let dy = mouse.y - cat.y;
    let distance = sqrt(dx * dx + dy * dy);
    
    let wasMoving = cat.isMoving;
    cat.isMoving = true;
    
    // ネズミの方向に移動
    cat.x += (dx / distance) * cat.speed;
    cat.y += (dy / distance) * cat.speed;
    
    // 画面外に出ないように制限(ステージの枠内に収める)
    cat.x = constrain(cat.x, 30 + cat.size/2, width - 30 - cat.size/2);
    cat.y = constrain(cat.y, 30 + cat.size/2, height - 30 - cat.size/2);
}

function checkCollision() {
    let distance = dist(mouse.x, mouse.y, cat.x, cat.y);
    if (distance < (cat.size + mouse.size) / 3) {
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
    text('時間: ' + score + '秒', 30, 30);
}

function displayGameOver() {
    push();
    fill(240, 240, 240, 200);
    rect(0, 0, width, height);
    
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('ゲームオーバー!', width/2, height/2 - 40);
    textSize(24);
    text('スコア: ' + score + '秒', width/2, height/2);
    text('ベストスコア: ' + bestScore + '秒', width/2, height/2 + 30);
    
    textSize(16);
    text('スタートボタンでリスタート', width/2, height/2 + 70);
    pop();
}
