let handpose;
let video;
let hands = [];

function preload() {
  handpose = ml5.handPose();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  handpose.detectStart(video, getHandsData);

 // the beat to follow
 Tone.start().then(() => {
  const synth = new Tone.PolySynth().toDestination();

 Tone.Transport.scheduleRepeat((time) => {
    synth.triggerAttackRelease('C3', '8n', time);
 }, "2n");

Tone.Transport.start();

});
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  background(0);

  for (let hand of hands) {
    let handsMiddle = hand.middle_finger_mcp;

    noStroke();
    fill(0, 255, 255);
    ellipse(handsMiddle.x, handsMiddle.y, 30);

    // Check if the hand is hovering over any of the rectangles
    checkHover(handsMiddle.x, handsMiddle.y);
  }
  pop();

  pathTriangle();
}

function getHandsData(results) {
  hands = results;
}

function pathTriangle() {
  fill(255, 255, 0, 50);
  noStroke();
  //left hand
  rect(500, 200, 50, 50);
  rect(480, 180, 90, 90);

  rect(500, windowHeight - 200, 50, 50);
  rect(480, windowHeight - 220, 90, 90);

  //right hand
  rect(windowWidth / 2, 200, 50, 50);
  rect(windowWidth / 2 - 20, 180, 90, 90);

  rect(windowWidth / 2, windowHeight - 200, 50, 50);
  rect(windowWidth / 2 - 20, windowHeight - 220, 90, 90);

  rect(windowWidth - 500, windowHeight / 2, 50, 50);
  rect(windowWidth - 520, windowHeight / 2 - 20, 90, 90);
}

let points = 0;

//The following 30 lines of code where conducted with the help of ChatGPT
function checkHover(x, y) {
  // Define your rectangles (hardcoded values based on pathTriangle())
  let rects = [
    { x: 500, y: 200, w: 50, h: 50 },
    { x: 480, y: 180, w: 90, h: 90 },
    { x: 500, y: windowHeight - 200, w: 50, h: 50 },
    { x: 480, y: windowHeight - 220, w: 90, h: 90 },
    { x: windowWidth / 2, y: 200, w: 50, h: 50 },
    { x: windowWidth / 2 - 20, y: 180, w: 90, h: 90 },
    { x: windowWidth / 2, y: windowHeight - 200, w: 50, h: 50 },
    { x: windowWidth / 2 - 20, y: windowHeight - 220, w: 90, h: 90 },
    { x: windowWidth - 500, y: windowHeight / 2, w: 50, h: 50 },
    { x: windowWidth - 520, y: windowHeight / 2 - 20, w: 90, h: 90 },
  ];

  // Check if hand is over any rectangle
  for (let rect of rects) {
    if (
      x > rect.x &&
      x < rect.x + rect.w &&
      y > rect.y &&
      y < rect.y + rect.h
    ) {
      points += 1;
      console.log("points", points);
    }
  }
}

function randomizScore(){
  if(points > 1 && points < 10){
    let randomValue = Math.floor(Math.random());
  }
}

function pathCircle() {
  push();
  fill(255, 255, 0);
  rect(500, 200, 50, 50);
  rect(500, windowHeight - 200, 50, 50);
  pop();

  noFill();
  stroke(255, 255, 0);
  strokeWeight(50);
  ellipse(windowWidth - 800, windowHeight - 500, 750);
}

function pathLine() {
  fill(255, 255, 0);

  rect(500, 200, 50, 50);
  rect(500, windowHeight - 200, 50, 50);

  rect(windowWidth - 500, 200, 50, 50);
  rect(windowWidth - 500, windowHeight - 200, 50, 50);
}

/* let indexFinger = hand.index_finger_tip;
    let thumb = hand.thumb_tip;

    let centerX = (indexFinger.x + thumb.x) / 2;
    let centerY = (indexFinger.y + thumb.y) / 2;

    let distance = dist(indexFinger.x, indexFinger.y, thumb.x, thumb.y);

    noStroke();
    fill(255, 0 , 255);
    ellipse(centerX, centerY, distance); */
