let handpose;
let video;
let hands = [];

function preload(){
handpose = ml5.handPose();

}

function setup(){
createCanvas(640, 480);
video = createCapture(VIDEO);
video.size(640, 480);
video.hide();

handpose.detectStart(video, getHandsData);
}

function draw(){
image(video, 0, 0);

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

/* if(hands.length > 0){
    let indexFinger = hands[0].index_finger_tip;
    let thumb = hands[0].thumb_tip;

    fill(0,0,255);
    ellipse(indexFinger.x, indexFinger.y, 10);
    ellipse(thumb.x, thumb.y, 10);

} */

}

function getHandsData(results){
hands = results;

}