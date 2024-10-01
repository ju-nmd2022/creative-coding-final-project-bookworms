let handpose;
let video;
let hands = [];

function preload(){
handpose = ml5.handPose();

}

function setup(){
createCanvas(windowWidth, windowHeight);
video = createCapture(VIDEO);
video.size(windowWidth, windowHeight);
video.hide();

handpose.detectStart(video, getHandsData);
}

function draw(){
push();
translate(video.width, 0);
scale(-1,1);
image(video, 0, 0);

background(0);

for(let hand of hands){
let handsMiddle = hand.middle_finger_mcp;

noStroke();
fill(0, 255, 255);
ellipse(handsMiddle.x, handsMiddle.y, 30);


    /* let indexFinger = hand.index_finger_tip;
    let thumb = hand.thumb_tip;

    let centerX = (indexFinger.x + thumb.x) / 2;
    let centerY = (indexFinger.y + thumb.y) / 2;

    let distance = dist(indexFinger.x, indexFinger.y, thumb.x, thumb.y);

    noStroke();
    fill(255, 0 , 255);
    ellipse(centerX, centerY, distance); */
}
pop();

pathTriangle();

}

function getHandsData(results){
hands = results;

}

function pathTriangle(){
    fill(255,255,0);
    rect(500,200, 50, 50);
    rect(500, windowHeight - 200, 50, 50);

    rect(windowWidth - 1000, 200, 50, 50);
    rect(windowWidth - 1000, windowHeight - 200, 50, 50);
    rect(windowWidth - 500, windowHeight/2, 50, 50);
}

function pathCircle(){
    push();
    fill(255, 255,0);
    rect(500,200, 50, 50);
    rect(500, windowHeight - 200, 50, 50);
    pop();

    noFill();
    stroke(255,255,0)
    strokeWeight(50);
    ellipse(windowWidth - 800, windowHeight - 500, 750)

}

function pathLine(){
    fill(255,255,0);

    rect(500,200, 50, 50);
    rect(500, windowHeight - 200, 50, 50);

    rect(windowWidth - 500, 200, 50, 50);
    rect(windowWidth - 500, windowHeight - 200, 50, 50);
}