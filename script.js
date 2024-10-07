let handpose;
let video;
let hands = [];
let points = 0;
let rects = [];
let synth;
let soundStarted = false;

function preload() {
  handpose = ml5.handPose();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  handpose.detectStart(video, getHandsData);
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

  if (hands.lenght > 0 && !soundStarted) {
    soundStarted = true;
    startSound();
  }
}

function startSound() {
  Tone.start().then(() => {
    synth = new Tone.PolySynth().toDestination();

    Tone.Transport.scheduleRepeat((time) => {
      synth.triggerAttackRelease("C3", "8n", time);
    }, "2n");

    Tone.Transport.start();
  }).catch((error) => {
    console.error("Failed to start Tone.js", error);
  });
}

function pathTriangle() {
  fill(255, 255, 0, 150);
  noStroke();
  //left hand
  rect(500, 200, 70, 70);
  rect(500, windowHeight - 200, 70, 70);

  //right hand
  rect(windowWidth / 2, 200, 70, 70);
  rect(windowWidth / 2, windowHeight - 200,70, 70);
  rect(windowWidth - 500, windowHeight / 2, 70, 70);
}


// The following 30 lines of code where conducted with the help of ChatGPT
function checkHover(x, y) {
  rects = [
    { x: 500, y: 200, w: 70, h: 70, isTouching: false },
    { x: 500, y: windowHeight - 200, w: 70, h: 70, isTouching: false },
    { x: windowWidth / 2, y: 200, w: 70, h: 70, isTouching: false },
    { x: windowWidth / 2, y: windowHeight - 200, w: 70, h: 70, isTouching: false },
    { x: windowWidth - 500, y: windowHeight / 2, w: 70, h: 70, isTouching: false }
  ];

  //Check if hand is over the rectangle
  for (let rect of rects) {
    let touchingRect = x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h;

    if (x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h && !rect.isTouching) {
    
      points += 1;
      console.log("points", points);
      rect.isTouching = true; 
    } else if (!touchingRect && rect.isTouching) {
      rect.isTouching = false;
    }
  }
}

function randomizeScore() {
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

