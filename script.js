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

    Tone.Transport.scheduleRepeat(time => {
      synth.triggerAttackRelease("C3", "8n", time);
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
  fill(255, 255, 0, 150);
  noStroke();
  //left hand
  rect(500, 200, 50, 50);

  rect(500, windowHeight - 200, 50, 50);

  //right hand
  rect(windowWidth / 2, 200, 50, 50);

  rect(windowWidth / 2, windowHeight - 200, 50, 50);

  rect(windowWidth - 500, windowHeight / 2, 50, 50);
}

let points = 0;

// The following 30 lines of code where conducted with the help of ChatGPT
function checkHover(x, y) {
  // Define your rectangles (hardcoded values based on pathTriangle())
  let rects = [
    { x: 500, y: 200, w: 50, h: 50, isTouching: false },
    { x: 500, y: windowHeight - 200, w: 50, h: 50, isTouching: false },
    { x: windowWidth / 2, y: 200, w: 50, h: 50, isTouching: false },
    { x: windowWidth / 2, y: windowHeight - 200, w: 50, h: 50, isTouching: false },
    { x: windowWidth - 500, y: windowHeight / 2, w: 50, h: 50, isTouching: false }
  ];

  //Check if hand is over the rectangle
  for (let rect of rects) {
    let touchingRect = x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h;

    // If the hand just touched this specific rectangle, add a point
    if (touchingRect && !rect.isTouching) {
      points += 1;
      console.log("points", points);
      rect.isTouching = true; // Mark that this rectangle has been touched
    } else if (!touchingRect && rect.isTouching) {
      // If the hand is no longer touching this rectangle, reset the flag
      rect.isTouching = false;
    }
  }
}

function randomizScore() {
  if (points > 1 && points < 10) {
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
