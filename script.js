let handpose;
let video;
let hands = [];
let points = 0;
let rects = [
  { x: 750, y: 200, w: 70, h: 70, isTouching: false },
  { x: 750, y: 600, w: 70, h: 70, isTouching: false },
  { x: 500, y: 400, w: 70, h: 70, isTouching: false },
  { x: 1100, y: 200, w: 70, h: 70, isTouching: false },
  { x: 1100, y: 600, w: 70, h: 70, isTouching: false },
];
let synth;
let soundStarted = false;
let result;
let timer = 0;
let stopTime = Math.floor((Math.random() * (60 - 30) + 30) * 100) / 100;

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

  if (points > 20) {
    background(255, 255, 255);
    field = generateField();
    generateAgents();
  }
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

  //after the time is over the art is drawn
  if (timer < stopTime) {
    timer += deltaTime / 1000;
    pathTriangle();
  } else {
    timer = stopTime;
    randomizeScore();
    console.log("random score!");
  }
  pop();
  console.log("timer", timer, "stopTime", stopTime);
}

function getHandsData(results) {
  hands = results;

  if (hands.length > 0 && !soundStarted) {
    soundStarted = true;
    startSound();
  }
}

function startSound() {
  // the beat to follow
  Tone.start()
    .then(() => {
      synth = new Tone.PolySynth().toDestination();

      Tone.Transport.scheduleRepeat((time) => {
        synth.triggerAttackRelease("C3", "8n", time);
      }, "2n");

      Tone.Transport.start();
    })
    .catch((error) => {
      console.error("Failed to start Tone.js:", error);
    });
}

function pathTriangle() {
  fill(255, 255, 0, 150);
  noStroke();
  //right hand
  rect(750, 200, 70, 70);
  rect(750, 600, 70, 70);
  rect(500, 400, 70, 70);

  //left hand
  rect(1100, 200, 70, 70);
  rect(1100, 600, 70, 70);
}

// Log window dimensions
console.log("Window dimensions:", window.innerWidth, window.innerHeight);

// Log the rectangle positions and sizes
rects.forEach((rect, index) => {
  console.log(`Rectangle ${index + 1}:`, rect);
});

function checkHover(x, y) {
  for (let rect of rects) {
    let touchingRect =
      x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h;

    if (touchingRect && !rect.isTouching) {
      points += 1;
      console.log("points", points);
      rect.isTouching = true;
    } else if (!touchingRect && rect.isTouching) {
      rect.isTouching = false;
    }
  }
}

function randomizeScore() { //! result is not working correctly
  if (points >= 500 && points < 1000) {
    result = Math.sqrt(
      7 / (points * points) +
        Math.sin(points) * Math.log(points * points * points + 2)
    );
    console.log("Result:", result);
    displayingArt(result);
  } else if (points >= 1000 && points < 2500) {
    result =
      Math.acos((Math.exp(points - 1) + 5 * points * points) / Math.PI) +
      2 / (points * points + 1);
    console.log("Result:", result);
    displayingArt(result);
  } else if (points >= 2500) {
    result =
      Math.pow(points, 4) -
      Math.log(points * points * points + 1) / points +
      Math.tan(points) -
      (1 / (points + 1)) * (points * points + 1 / points);
    console.log("Result:", result);
    displayingArt(result);
  }
}

//TODO: After depending on the amount of points you get from the game --> number is generated --> artwork is chosen (either this or that)
function displayingArt(result) {
  console.log("display with", result);
  if (result > 2000) {
    console.log("flow");
    flowfieldArtwork();
  } else if (result < 2000) {
    console.log("noise");
    noise();
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

//The following 25 lines of code were conducted with this: https://www.freecodecamp.org/news/make-api-calls-in-javascript/
function weatherAPI() {
  const apiUrl =
    "http://api.weatherapi.com/v1/current.json?key=e8f06a30dfc14caeb4d112444240710&q=Jönköping&aqi=no";

  //GET request
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was ok!");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      //TODO: testing if the variables make it out
      const temperature = Math.floor(data.current.temp_c);
      const wind = Math.floor(data.current.wind_kph);
      const humidity = data.current.humidity;
      const latJKPG = Math.floor(data.location.lat);
      const lonJKPG = Math.floor(data.location.lon);
      console.log(temperature, wind, humidity, latJKPG, lonJKPG);
    })
    .catch((error) => {
      console.log("Error", error);
    });
}

//artworks
// flowfield artwork
const fieldSizeFlowfield = 10; //! Here variable instead of math.random; 10
const maxColsFlowfield = Math.ceil(innerWidth / fieldSizeFlowfield);
const maxRowsFlowfield = Math.ceil(innerHeight / fieldSizeFlowfield);
const dividerFlowfield = 4; //! Here variable instead of math.random
let flowfield;
let agents = [];

class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.lastPosition = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
  }

  follow(desiredDirection) {
    desiredDirection = desiredDirection.copy();
    desiredDirection.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desiredDirection, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.lastPosition = this.position.copy();
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  checkBorders() {
    if (this.position.x < 0) {
      this.position.x = innerWidth;
      this.lastPosition.x = innerWidth;
    } else if (this.position.x > innerWidth) {
      this.position.x = 0;
      this.lastPosition.x = 0;
    }

    if (this.position.y < 0) {
      this.position.y = innerHeight;
      this.lastPosition.y = innerHeight;
    } else if (this.position.y > innerHeight) {
      this.position.y = 0;
      this.lastPosition.y = 0;
    }
  }

  draw() {
    push();
    stroke(0, 0, 0, 40);
    strokeWeight(1.5);
    line(
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.y
    );
    pop();
  }
}

function generateField() {
  let flowfield = [];
  noiseSeed(Math.random() * 100); //! Here variable instead of math.random
  for (let x = 0; x < maxColsFlowfield; x++) {
    flowfield.push([]);
    for (let y = 0; y < maxRowsFlowfield; y++) {
      const value =
        noise(x / dividerFlowfield, y / dividerFlowfield) * Math.PI * 2;
      flowfield[x].push(p5.Vector.fromAngle(value));
    }
  }

  return flowfield;
}

function generateAgents() {
  for (let i = 0; i < 500; i++) {
    let agent = new Agent( //! Here variable instead of math.random
      Math.random() * innerWidth,
      Math.random() * innerHeight,
      2,
      0.3
    );
    agents.push(agent);
  }
}

function flowfieldArtwork() {
  for (let agent of agents) {
    const x = Math.floor(agent.position.x / fieldSizeFlowfield);
    const y = Math.floor(agent.position.y / fieldSizeFlowfield);

    if (x >= 0 && x < maxColsFlowfield && y >= 0 && y < maxRowsFlowfield) {
      const desiredDirection = flowfield[x][y];
      agent.follow(desiredDirection);
    }

    agent.update();
    agent.checkBorders();
    agent.draw();
  }
}

// noise artwork
const sizeNoise = 10; //! Here variable instead of math.random
const dividerNoise = 25; //! Here variable instead of math.random
const numRowsNoise = 60;
const numColsNoise = 60;

function noise() {
  background(255);
  noStroke();
  fill(0);
  colorMode(HSB, 100);

  for (let y = 0; y < numRowsNoise; y++) {
    for (let x = 0; x < numColsNoise; x++) {
      const c = noise(x / dividerNoise, y / dividerNoise) * 100;
      const value = noise(x / dividerNoise, y / dividerNoise) * sizeNoise;
      fill(c, 100, 80);
      ellipse(
        sizeNoise / 2 + x * sizeNoise,
        sizeNoise / 2 + y * sizeNoise,
        value
      );
    }
  }

  noLoop();
}

function pixels() {}
