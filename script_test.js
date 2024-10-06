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
}

/* function modelReady() {
  console.log("Model is ready!");
} */

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  background(0);

  // Check hand positions
  for (let hand of hands) {
    let handsMiddle = hand.middle_finger_mcp;
    noStroke();
    fill(0, 255, 255);
    ellipse(handsMiddle.x, handsMiddle.y, 30);

    // Check if the hand is hovering over any of the rectangles
    checkHover(handsMiddle.x, handsMiddle.y);
  }
  pop();

  // Draw rectangles
  pathTriangle();
}

function getHandsData(results) {
  hands = results;
}

function pathTriangle() {
  fill(255, 255, 0, 50);
  noStroke();

  // Draw all rectangles
  rect(500, 200, 50, 50);
  rect(480, 180, 90, 90);

  rect(500, windowHeight - 200, 50, 50);
  rect(480, windowHeight - 220, 90, 90);

  rect(windowWidth / 2, 200, 50, 50);
  rect(windowWidth / 2 - 20, 180, 90, 90);

  rect(windowWidth / 2, windowHeight - 200, 50, 50);
  rect(windowWidth / 2 - 20, windowHeight - 220, 90, 90);

  rect(windowWidth - 500, windowHeight / 2, 50, 50);
  rect(windowWidth - 520, windowHeight / 2 - 20, 90, 90);
}

let points = 0;

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
      console.log(points);
  
    }
  }
}
