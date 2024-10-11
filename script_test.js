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

  weatherAPI();
}

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

// Initialize points and rectangles outside the function so they persist
// Initialize points and rectangles outside the function so they persist
let points = 0;

// Log window dimensions
console.log("Window dimensions:", window.innerWidth, window.innerHeight);

let rects = [
  { x: 500, y: 200, w: 70, h: 70, isTouching: false },
  { x: 500, y: window.innerHeight - 200, w: 70, h: 70, isTouching: false },
  { x: window.innerWidth / 2, y: 200, w: 70, h: 70, isTouching: false },
  { x: window.innerWidth / 2, y: window.innerHeight - 200, w: 70, h: 70, isTouching: false },
  { x: window.innerWidth - 500, y: window.innerHeight / 2, w: 70, h: 70, isTouching: false }
];

// Log the rectangle positions and sizes
rects.forEach((rect, index) => {
  console.log(`Rectangle ${index + 1}:`, rect);
});

function checkHover(x, y) {
  for (let rect of rects) {
    let touchingRect = x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h;

    if (touchingRect && !rect.isTouching) {
      points += 1;
      console.log("points", points);
      rect.isTouching = true;
    } else if (!touchingRect && rect.isTouching) {
      rect.isTouching = false;
    }
  }
}



function weatherAPI() {
  const apiUrl = "http://api.weatherapi.com/v1/current.json?key=e8f06a30dfc14caeb4d112444240710&q=Jönköping&aqi=no";

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was ok!");
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log("Error", error);
    });
}
