let handpose;
let video;
let hands = [];
let points = 0;
let rects = [
  { x: 750, y: 100, w: 70, h: 70, isTouching: false },
  { x: 750, y: 500, w: 70, h: 70, isTouching: false },
  { x: 500, y: 300, w: 70, h: 70, isTouching: false },
  { x: 1100, y: 100, w: 70, h: 70, isTouching: false },
  { x: 1100, y: 500, w: 70, h: 70, isTouching: false }
];
let synth;
let soundStarted = false;
let result;
let timer = 0;
let stopTime = Math.floor((Math.random() * (40 - 20) + 20) * 100) / 100;
let img;
//API
let city;
let temperature;
let wind;
let humidity;
let windChill;
let pressure;
let cloud;
let heatIndex;
let localTime;

function preload() {
  handpose = ml5.handPose();
  weatherAPI();
  img = loadImage("Pilar.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  handpose.detectStart(video, getHandsData);

  field = generateField();
  generateAgents();
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  background(0);

  //The following lines about the timer were done with the help of ChatGPT
  if (timer < stopTime) {
    timer += deltaTime / 1000;
    image(img, 50, 50);

    for (let hand of hands) {
      let handsMiddle = hand.middle_finger_mcp;

      noStroke();
      fill(255, 255, 255);
      ellipse(handsMiddle.x, handsMiddle.y, 30);

      checkHover(handsMiddle.x, handsMiddle.y);
    }
    pathTriangle();
  } else {
    timer = stopTime;
    randomizeScore();
  }

  if (hands.length > 0 && !soundStarted) {
    soundStarted = true;
    startSound();
  }

  if (soundStarted && timer >= stopTime) {
    Tone.Transport.stop();
  }

  pop();
}

function getHandsData(results) {
  hands = results;
}

function startSound() {
  //The following 10 lines of code were done with the help of ChatGPT
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
  fill(255, 0, 0, 150);
  noStroke();
  //right hand
  rect(750, 100, 70, 70);
  rect(750, 500, 70, 70);
  rect(500, 300, 70, 70);

  fill(0, 0, 255, 150);
  //left hand
  rect(1100, 100, 70, 70);
  rect(1100, 500, 70, 70);
}

function checkHover(x, y) {
  for (let rect of rects) {
    //The following 6 lines of code are done with the help of ChatGPT
    let touchingRect = x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h;

    if (touchingRect && !rect.isTouching) {
      points += 1;
      rect.isTouching = true;
    } else if (!touchingRect && rect.isTouching) {
      rect.isTouching = false;
    }
  }
}

function randomizeScore() {
  //The following math equasions were done with the help of ChatGPT
  if (points >= 0 && points < 1000) {
    result = Math.floor(Math.pow(points, 2) + Math.exp(points / 100) - Math.sqrt(points + 1)) / 100;
    displayingArt(result);
  } else if (points >= 1000 && points < 2500) {
    result = Math.floor(Math.abs(Math.sin(points / 100)) + Math.pow(points, 3) / 1000 + 1) / 100;
    displayingArt(result);
  } else if (points >= 2500) {
    result = Math.floor(Math.log(points + 1) + 100 / (points + 1)) / 100;
    displayingArt(result);
  }
}

function displayingArt(result) {
  if (
    result <= 200 ||
    (result > 600 && result < 1000) ||
    (result > 2000 && result < 2500) ||
    (result > 3000 && result < 4700) ||
    (result > 5500 && result < 6000) ||
    result > 7000
  ) {
    flowfieldArtwork();
  } else {
    noiseArtwork();
  }
}

//The following 25 lines of code were conducted with this: https://www.freecodecamp.org/news/make-api-calls-in-javascript/
function weatherAPI() {
  let apiUrl = "https://api.weatherapi.com/v1/current.json?key=7b05ca88869f4278895121153241610&q=Jönköping&aqi=no";

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was ok!");
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      temperature = Math.floor(data.current.temp_c);
      wind = Math.floor(data.current.wind_kph);
      humidity = data.current.humidity;
      windChill = Math.floor(data.current.windchill_c);
      pressure = data.current.pressure_mb;
      cloud = data.current.cloud;
      heatIndex = Math.floor(data.current.heatindex_c);
      localTime = data.location.localtime_epoch;
    })
    .catch(error => {
      console.log("Error", error);
    });
}

const fieldSizeFlowfield = 10;
const maxColsFlowfield = Math.ceil(innerWidth / fieldSizeFlowfield);
const maxRowsFlowfield = Math.ceil(innerHeight / fieldSizeFlowfield);
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
    stroke(wind * 9, heatIndex * 2, temperature, humidity + 70);
    strokeWeight(heatIndex);
    line(this.lastPosition.x, this.lastPosition.y, this.position.x, this.position.y);
    pop();
  }
}

function generateField() {
  flowfield = [];
  noiseSeed(points);
  for (let x = 0; x < maxColsFlowfield; x++) {
    flowfield.push([]);
    for (let y = 0; y < maxRowsFlowfield; y++) {
      const dividerFlowfield = pressure / 10;
      const value = noise(x / dividerFlowfield, y / dividerFlowfield) * Math.PI * 2;
      flowfield[x].push(p5.Vector.fromAngle(value));
    }
  }
  return flowfield;
}

function generateAgents() {
  for (let i = 0; i < 500; i++) {
    let agent = new Agent(Math.random() * innerWidth, Math.random() * innerHeight, 2, 0.3);
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

function noiseArtwork() {
  const sizeNoise = windChill * wind;
  const dividerNoise = humidity;
  const numRowsNoise = cloud * random(10, 20);
  const numColsNoise = cloud * random(10, 20);
  // the following 5 lines of code were coded with the help with ChatGPT
  let artworkWidth = numColsNoise * sizeNoise;
  let artworkHeight = numRowsNoise * sizeNoise;

  let offsetX = (windowWidth - artworkWidth) / 2;
  let offsetY = (windowHeight - artworkHeight) / 2;

  background(Math.random(50, 255));
  noStroke();
  fill(0);
  colorMode(HSB, 100);
  noiseSeed(points);

  for (let y = 0; y < numRowsNoise; y++) {
    for (let x = 0; x < numColsNoise; x++) {
      const c = noise(x / dividerNoise, y / dividerNoise) * humidity;
      const value = noise(x / dividerNoise, y / dividerNoise) * sizeNoise;
      fill(c, wind * 15, heatIndex * 15);
      ellipse(offsetX + sizeNoise / 2 + x * sizeNoise, offsetY + sizeNoise / 2 + y * sizeNoise, value);
    }
  }

  noLoop();
}
