let catImg;
let showCat = false;

function preload() {
    catImg = loadImage('assets/cat.svg');
}

function setup() {
    const canvas = createCanvas(400, 400);
    canvas.parent('main');
    imageMode(CENTER);
    
    // スタートボタンのイベントリスナーを設定
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        showCat = true;
    });
}

function draw() {
    background(240);
    
    if (showCat) {
        // 画面中央にネコを表示
        image(catImg, width/2, height/2, 100, 100);
    }
}
