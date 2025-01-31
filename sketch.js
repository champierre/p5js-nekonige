let cats = [
    {
        x: 200,
        y: 200,
        size: 50,
        speed: 2,
        isMoving: false,
        animationFrame: 0,
        moveMode: 'chase', // 'chase' or 'random'
        direction: { x: 0, y: 0 }
    },
    {
        x: 300,
        y: 200,
        size: 50,
        speed: 2,
        isMoving: false,
        animationFrame: 0,
        moveMode: 'random',
        direction: { x: 0, y: 0 }
    },
    {
        x: 100,
        y: 200,
        size: 50,
        speed: 2,
        isMoving: false,
        animationFrame: 0,
        moveMode: 'random',
        direction: { x: 0, y: 0 }
    }
];

let mouse = {
    x: 100,
    y: 100,
    size: 40,
    speed: 4,
    isMoving: false,
    animationFrame: 0
};

let gameStartTime = 0;
let countdownStartTime = 0;
let isGameOver = false;
let score = 0;
let bestScore = 0;
let isGameStarted = false;
let gameState = 'title'; // 'title', 'countdown', 'playing', 'gameover'
let startButton;
let directionButtons = {
    up: null,
    down: null,
    left: null,
    right: null
};

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

    // 方向ボタンの設定
    directionButtons.up = select('#upButton');
    directionButtons.down = select('#downButton');
    directionButtons.left = select('#leftButton');
    directionButtons.right = select('#rightButton');

    // タッチイベントの設定
    setupDirectionButtons();
    
    resetGame();
}

function startGame() {
    resetGame();
    startButton.addClass('hidden');
    gameState = 'countdown';
    countdownStartTime = millis();
    
    // 2秒後にゲームを開始
    setTimeout(() => {
        gameState = 'playing';
        isGameStarted = true;
        gameStartTime = millis();
        
        // ネコとネズミの位置をランダムに設定
        for (let cat of cats) {
            cat.x = random(30 + cat.size/2, width - 30 - cat.size/2);
            cat.y = random(30 + cat.size/2, height - 30 - cat.size/2);
            
            // ランダムな方向を設定
            if (cat.moveMode === 'random') {
                const angle = random(TWO_PI);
                cat.direction.x = cos(angle);
                cat.direction.y = sin(angle);
            }
        }
        
        // ネズミの位置をネコから離れた位置に設定
        do {
            mouse.x = random(30 + mouse.size/2, width - 30 - mouse.size/2);
            mouse.y = random(30 + mouse.size/2, height - 30 - mouse.size/2);
        } while (cats.some(cat => dist(cat.x, cat.y, mouse.x, mouse.y) < 150)); // 全てのネコから最低150ピクセル離す
    }, 2000);
}

function resetGame() {
    // ネコの初期位置を設定
    cats[0].x = width / 2;
    cats[0].y = height / 2;
    cats[1].x = width * 3 / 4;
    cats[1].y = height / 2;
    cats[2].x = width / 4;
    cats[2].y = height / 2;
    
    mouse.x = width / 4;
    mouse.y = height / 4;
    isGameStarted = false;
    isGameOver = false;
    score = 0;
    startButton.removeClass('hidden');
}

function draw() {
    background(240);
    drawStage();
    
    // アニメーションフレームの更新
    if (frameCount % 10 === 0) {  // 10フレームごとに更新
        for (let cat of cats) {
            if (cat.isMoving) cat.animationFrame = (cat.animationFrame + 1) % 2;
        }
        if (mouse.isMoving) mouse.animationFrame = (mouse.animationFrame + 1) % 2;
    }
    
    if (gameState === 'countdown') {
        // カウントダウン表示
        for (let cat of cats) {
            drawCat(cat);
        }
        drawMouse();
        
        push();
        textSize(64);
        textAlign(CENTER, CENTER);
        fill(0);
        let remainingTime = 2 - floor((millis() - countdownStartTime) / 1000);
        text(remainingTime, width/2, height/2);
        pop();
    } else if (gameState === 'title') {
        // ゲーム開始前の表示
        for (let cat of cats) {
            drawCat(cat);
        }
        drawMouse();
    } else if (gameState === 'playing' && !isGameOver) {
        // ゲーム中
        score = floor((millis() - gameStartTime) / 1000);
        
        // キーの状態に基づいて移動処理
        let wasMoving = mouse.isMoving;
        mouse.isMoving = false;
        
        if (isGameStarted && !isGameOver) {
            if (keys.left) {
                mouse.x -= mouse.speed;
                mouse.isMoving = true;
            }
            if (keys.right) {
                mouse.x += mouse.speed;
                mouse.isMoving = true;
            }
            if (keys.up) {
                mouse.y -= mouse.speed;
                mouse.isMoving = true;
            }
            if (keys.down) {
                mouse.y += mouse.speed;
                mouse.isMoving = true;
            }
            
            // 画面外に出ないように制限
            mouse.x = constrain(mouse.x, 30 + mouse.size/2, width - 30 - mouse.size/2);
            mouse.y = constrain(mouse.y, 30 + mouse.size/2, height - 30 - mouse.size/2);
        }
        
        // 全てのネコの位置を更新して描画
        for (let cat of cats) {
            updateCatPosition(cat);
            drawCat(cat);
        }
        drawMouse();
        checkCollision();
        displayScore();
    } else if (gameState === 'gameover') {
        displayGameOver();
    }
}

function drawCat(cat) {
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
    
    pop();
}

function updateCatPosition(cat) {
    let wasMoving = cat.isMoving;
    cat.isMoving = true;

    if (cat.moveMode === 'chase') {
        // ネズミと猫の距離を計算
        let dx = mouse.x - cat.x;
        let dy = mouse.y - cat.y;
        let distance = sqrt(dx * dx + dy * dy);
        
        // ネズミの方向に移動
        cat.x += (dx / distance) * cat.speed;
        cat.y += (dy / distance) * cat.speed;
    } else {
        // ランダムな方向に移動
        cat.x += cat.direction.x * cat.speed;
        cat.y += cat.direction.y * cat.speed;

        // 壁に当たったら反射
        if (cat.x <= 30 + cat.size/2 || cat.x >= width - 30 - cat.size/2) {
            cat.direction.x *= -1;
        }
        if (cat.y <= 30 + cat.size/2 || cat.y >= height - 30 - cat.size/2) {
            cat.direction.y *= -1;
        }
    }
    
    // 画面外に出ないように制限(ステージの枠内に収める)
    cat.x = constrain(cat.x, 30 + cat.size/2, width - 30 - cat.size/2);
    cat.y = constrain(cat.y, 30 + cat.size/2, height - 30 - cat.size/2);
}

function checkCollision() {
    // いずれかのネコとネズミが接触したらゲームオーバー
    for (let cat of cats) {
        let distance = dist(mouse.x, mouse.y, cat.x, cat.y);
        if (distance < (cat.size + mouse.size) / 3) {
            isGameOver = true;
            gameState = 'gameover';
            if (score > bestScore) {
                bestScore = score;
            }
            startButton.removeClass('hidden');
            return;
        }
    }
}

function displayScore() {
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text('時間: ' + score + '秒', 30, 30);
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

function setupDirectionButtons() {
    // ボタンを押したときの処理
    function handleButtonPress(key) {
        keys[key] = true;
    }

    // ボタンを離したときの処理
    function handleButtonRelease(key) {
        keys[key] = false;
    }

    // マウス/タッチイベントの設定
    for (let direction in directionButtons) {
        let button = directionButtons[direction];
        
        // mousedown/touchstartイベント
        button.mousePressed(() => handleButtonPress(direction));
        button.elt.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleButtonPress(direction);
        });

        // mouseup/touchendイベント
        button.mouseReleased(() => handleButtonRelease(direction));
        button.elt.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleButtonRelease(direction);
        });

        // タッチデバイスでボタンの外に指が移動した場合
        button.elt.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            handleButtonRelease(direction);
        });
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
