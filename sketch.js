let showCat = false;
let catX = 200; // 猫のX座標
let catY = 200; // 猫のY座標
let catSpeedX = 0; // X方向の速度
let catSpeedY = 0; // Y方向の速度
let catSpeed = 3; // 猫の移動速度

function setup() {
    const canvas = createCanvas(400, 400);
    canvas.parent('main');
    
    // スタートボタンのイベントリスナーを設定
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        showCat = true;
        // ランダムな角度を生成（0から360度）
        let angle = random(360);
        // 角度をラジアンに変換
        let radian = radians(angle);
        // X方向とY方向の速度成分を計算
        catSpeedX = catSpeed * cos(radian);
        catSpeedY = catSpeed * sin(radian);
    });
}

function draw() {
    background(240);
    
    if (showCat) {
        // 猫の移動処理
        catX += catSpeedX;
        catY += catSpeedY;

        // 画面端での跳ね返り処理
        if (catX > width - 50 || catX < 50) {
            catSpeedX = -catSpeedX;
        }
        if (catY > height - 50 || catY < 50) {
            catSpeedY = -catSpeedY;
        }

        // 黄色の猫を描画
        fill(255, 255, 0); // 黄色
        noStroke();
        // 顔
        circle(catX, catY, 100);
        // 耳
        triangle(catX - 50, catY - 25, catX - 30, catY - 50, catX - 10, catY - 25);
        triangle(catX + 50, catY - 25, catX + 30, catY - 50, catX + 10, catY - 25);
        // 目
        fill(0);
        circle(catX - 15, catY - 5, 10);
        circle(catX + 15, catY - 5, 10);
        // 鼻
        fill(255, 105, 180);
        circle(catX, catY + 5, 6);
    }
}
