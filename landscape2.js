let handpose;
let video;
let bodyPose;
let poses = [];
let connections;
let hands = [];
const cellSize = 50;
let row, col;
let evolution = [
  ["grass", "water", "mountain"],
  ["village", "battlefield", "church"],
  ["city", "spacestation", "harbor"],
];
let emotions = [];
let grid = [];
let nextGrid = [];

function preload() {
  handpose = ml5.handPose();
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(12);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();
  handpose.detectStart(video, getHandsData);

  row = Math.floor(height / cellSize);
  col = Math.floor(width / cellSize);

  for (let i = 0; i < row; i++) {
    grid[i] = [];
    nextGrid[i] = [];
    for (let j = 0; j < col; j++) {
      let r = random();
      if (r < 0.6) {
        grid[i][j] = 0;
      } else if (r < 0.85) {
        grid[i][j] = 1;
      } else {
        grid[i][j] = 2;
      }
      nextGrid[i][j] = grid[i][j];
    }
  }
}

function draw() {
  background(255);
  applyRules();
  background(255);
  push();
  textAlign(LEFT, TOP);
  text(`People detected: ${poses.length}`, 10, 10);
  pop();

  drawPoses();
  drawHands();
}

function applyRules() {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      nextGrid[i][j] = grid[i][j];
    }
  }

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      let left = grid[i][(j - 1 + col) % col];
      let me = grid[i][j];
      let right = grid[i][(j + 1) % col];

      let above = grid[(i - 1 + row) % row][j];
      let under = grid[(i + 1) % row][j];
    }
  }
}

function getHandsData(results) {
  hands = results;
}

function gotPoses(results) {
  poses = results;
}
function drawHands() {
  for (let hand of hands) {
    const keypoints = hand.keypoints;
    for (let keypoint of keypoints) {
      push();
      noStroke();
      fill(0, 255, 0);
      ellipse(keypoint.x, keypoint.y, 10);
      pop();
    }
  }
}
function drawPoses() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];

    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];

      if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
        push();
        stroke(255, 0, 0);
        strokeWeight(2);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
        text(j, pointA.x, pointA.y - 15);
        pop();
      }
    }

    let leftShoulder = pose.keypoints[9];
    let rightShoulder = pose.keypoints[10];

    if (leftShoulder.confidence > 0.1 && rightShoulder.confidence > 0.1) {
      let rectWidth = dist(
        leftShoulder.x,
        leftShoulder.y,
        rightShoulder.x,
        rightShoulder.y
      );
      let rectHeight = 50;

      let centerX = (leftShoulder.x + rightShoulder.x) / 2;
      let centerY = (leftShoulder.y + rightShoulder.y) / 2;

      push();
      noFill();
      stroke(0, 0, 255);
      strokeWeight(2);
      rectMode(CENTER);
      rect(centerX, centerY, rectWidth, rectHeight);
      pop();
    }

    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.confidence > 0.1) {
        push();
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
        pop();
      }
    }
    if (pose.keypoints[9].x < pose.keypoints[10].x) {
      console.log("angry");
    }
  }
}
