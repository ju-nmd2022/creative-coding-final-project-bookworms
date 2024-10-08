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

  weatherAPI();

  if(points > 20){
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
  pop();

  // if statement for what kind of artwork gets displayed
  if(points > 20){
    flowfield();
  } else if (points > 20){
    noise();
  }

  pathTriangle();
}

function getHandsData(results) {
  hands = results;

  if (hands.length > 0 && !soundStarted) {
    soundStarted = true; // Set the flag to true to prevent restarting
    startSound();
  }
}

function startSound() {
  // the beat to follow
  Tone.start()
    .then(() => {
      synth = new Tone.PolySynth().toDestination();

      Tone.Transport.scheduleRepeat(time => {
        synth.triggerAttackRelease("C3", "8n", time);
      }, "2n");

      Tone.Transport.start();
    })
    .catch(error => {
      console.error("Failed to start Tone.js:", error);
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
  rect(windowWidth / 2, windowHeight - 200, 70, 70);
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

//The following 16 lines of code were conducted with this: https://www.freecodecamp.org/news/make-api-calls-in-javascript/
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

//artworks
// flowfield artwork
class Agent {
  constructor(x, y, maxSpeed, maxForce){
      this.position = createVector(x, y);
      this.lastPosition = createVector(x, y);
      this.acceleration = createVector(0, 0);
      this.velocity = createVector(0, 0);
      this.maxSpeed = maxSpeed;
      this.maxForce = maxForce;
  }

  follow(desiredDirection){
      desiredDirection = desiredDirection.copy();
      desiredDirection.mult(this.maxSpeed);
      let steer = p5.Vector.sub(desiredDirection, this.velocity);
      steer.limit(this.maxForce);
      this.applyForce(steer);
  }

  applyForce(force){
      this.acceleration.add(force);
  }

  update(){
      this.lastPosition = this.position.copy();
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
  }

  checkBorders(){
      if(this.position.x < 0){
          this.position.x = innerWidth;
          this.lastPosition.x = innerWidth;
      } else if(this.position.x >innerWidth){
          this.position.x = 0;
          this.lastPosition.x = 0;
      }

      if(this.position.y < 0){
          this.position.y = innerHeight;
          this.lastPosition.y = innerHeight;
      } else if(this.position.y >innerHeight){
          this.position.y = 0;
          this.lastPosition.y = 0;
      }
  }

  draw(){
      push();
      stroke(0, 0, 0, 40);
      strokeWeight(1.5);
      line(this.lastPosition.x, this.lastPosition.y, this.position.x, this.position.y);
      pop();
  }
}

function generateField(){
  let field = [];
  noiseSeed(Math.random() * 100);
  for(let x = 0; x < maxCols; x++){
      field.push([]);
      for(let y = 0; y < maxRows; y++){
          const  value = noise(x / divider, y / divider) * Math.PI * 2;
          field[x].push(p5.Vector.fromAngle(value));
      }
  }

  return field;
}

function generateAgents(){
  for(let i = 0; i < 500; i++){
      let agent = new Agent(
          Math.random() * innerWidth,
          Math.random() * innerHeight,
          2,
          0.3
      );
      agents.push(agent);
  }
}

const fieldSize = 10;
const maxCols = Math.ceil(innerWidth / fieldSize);
const maxRows = Math.ceil(innerHeight / fieldSize);
const divider = 4;
let field;
let agents = [];

function flowfield(){
  for(let agent of agents){
    const x = Math.floor(agent.position.x / fieldSize);
    const y = Math.floor(agent.position.y / fieldSize);

    if (x >= 0 && x < maxCols && y >= 0 && y < maxRows) {
        const desiredDirection = field[x][y];
        agent.follow(desiredDirection);
    }
    
    agent.update();
    agent.checkBorders();
    agent.draw();
  }
}

// noise artwork
function noise() {
  const size = 10;
  const divider = 25;
  const numRows = 60;
  const numCols = 60;

  background(255);
  noStroke();
  fill(0);
  colorMode(HSB, 100);

  for(let y = 0; y < numRows; y++){
    for(let x = 0; x < numCols; x++){
        const c = noise(x / divider, y / divider) * 100;
        const value = noise(x / divider, y / divider) * size;
        fill(c, 100, 80);
        ellipse(size / 2 + x * size, size / 2 + y * size, value);
    }
  }


  //will only draw it once
  noLoop();
}

function pixels() {}
