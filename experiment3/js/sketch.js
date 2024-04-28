/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

let rippleX, rippleY; // Coordinates of the center of the ripple
let rippleSize; // Size of the ripple
let rippleTimer; // Timer to control the duration of the ripple
let rippleDuration = 60; // Duration of the ripple in frames (adjust as needed)
let rippleAlpha = 255; // Initial alpha value of the ripple
let rippleSpeed = 4; // Speed at which the ripple expands

// Define variables to store camera position and sway offsets
let cameraX = 0;
let cameraY = 0;
let swayOffsetX = 0;
let swayOffsetY = 0;

// Function to update camera position with sway
function updateCamera() {
  // Add random offsets to camera position within a certain range
  let maxSway = 5; // Maximum sway amount
  swayOffsetX = random(-maxSway, maxSway);
  swayOffsetY = random(-maxSway, maxSway);
  
  // Update camera position with sway offsets
  cameraX += swayOffsetX;
  cameraY += swayOffsetY;
}

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}


function draw() {
  
  randomSeed(seed);
  drawGrid(currentGrid);
  
  
  
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

