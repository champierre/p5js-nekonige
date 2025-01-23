let showCat = false;

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
        // 画面中央にピンク色の円を描画（猫の顔を表現）
        fill(255, 182, 193); // ピンク色
        noStroke();
        // 顔
        circle(width/2, height/2, 100);
        // 耳
        triangle(width/2 - 50, height/2 - 25, width/2 - 30, height/2 - 50, width/2 - 10, height/2 - 25);
        triangle(width/2 + 50, height/2 - 25, width/2 + 30, height/2 - 50, width/2 + 10, height/2 - 25);
        // 目
        fill(0);
        circle(width/2 - 15, height/2 - 5, 10);
        circle(width/2 + 15, height/2 - 5, 10);
        // 鼻
        fill(255, 105, 180);
        circle(width/2, height/2 + 5, 6);
    }
}
