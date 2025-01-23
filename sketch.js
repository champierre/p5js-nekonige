let showCat = false;
let catX = 200; // 猫のX座標
let catSpeed = 3; // 猫の移動速度

function setup() {
    const canvas = createCanvas(400, 400);
    canvas.parent('main');
    
    // スタートボタンのイベントリスナーを設定
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        showCat = true;
    });
}

function draw() {
    background(240);
    
    if (showCat) {
        // 猫の移動処理
        catX += catSpeed;
        if (catX > width - 50 || catX < 50) {
            catSpeed = -catSpeed;
        }

        // 黄色の猫を描画
        fill(255, 255, 0); // 黄色
        noStroke();
        // 顔
        circle(catX, height/2, 100);
        // 耳
        triangle(catX - 50, height/2 - 25, catX - 30, height/2 - 50, catX - 10, height/2 - 25);
        triangle(catX + 50, height/2 - 25, catX + 30, height/2 - 50, catX + 10, height/2 - 25);
        // 目
        fill(0);
        circle(catX - 15, height/2 - 5, 10);
        circle(catX + 15, height/2 - 5, 10);
        // 鼻
        fill(255, 105, 180);
        circle(catX, height/2 + 5, 6);
    }
}
