let handpose;
let video;
let hands = [];

function preload(){
handpose = ml5.handPose();

}

function setup(){
createCanvas(innerWidth, innerHeight);
video = createCapture(VIDEO);
video.size(640, 480);
video.hide();

handpose.detectStart(video, getHandsData);
}

function draw(){
image(video, 0, 0);

if(hands.length > 0){
    let indexFinger = hands[0].index_finger_tip;
    let thumb = hands[0].thumb_tip;

    fill(0,0,255);
    ellipse(indexFinger.x, indexFinger.y, 10);
    ellipse(thumb.x, thumb.y, 10);

}

}

function getHandsData(){
hands = results;

}