// Globals
let canvasContainer;
let cameraRotation = 0;
let rotateCamera;

let rows = 50; // Number of rows in the grid
let cols = 50; // Number of columns in the grid
let terrain = []; // 2D array to store vertices

let mountainScale = 4;
let sunSize = 400

// Calculate position of the fog circle
let fogX = 0;
let fogY;
let fogRadius = 1000; // Radius of the fog circle
let fogOpacity = 50; // Opacity of the fog color

function resizeScreen() {
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL); // Create a 3D canvas
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  // Define camera parameters
  let fov = PI / 3; // Field of view
  let cameraZ = (height / 2.0) / tan(fov / 2.0); // Camera distance
  perspective(fov, width / height, cameraZ / 10.0, cameraZ * 10.0); // Set perspective

  // Optional: Add some ambient light
  ambientLight(100);

  // Call function to generate terrain
  generateTerrain();
  rotateCamera = HALF_PI;
  fogY = -height - 50;
}

function draw() {
  background(0); // Set background color to black

  // Update camera rotation
  cameraRotation += 0.01; // Adjust the rotation speed as needed

  // Landscape view camera settings with slight rotation and 90 degrees clockwise rotation
  let camX = sin(cameraRotation) * 200; // Camera x position (with sway)
  let camY = height; // Camera y position (above the grid floor)
  let camZ = (height / 2.0) / tan(PI / 2); // Camera distance
  let lookX = 0; // Point the camera at the origin
  let lookY = 0;
  let lookZ = 0;
  camera(camX, camY, camZ, lookX, lookY, lookZ, 0, 1, 0); // Set camera position and orientation
  rotateY(rotateCamera); // Rotate the camera 90 degrees clockwise around the y-axis

  // Your drawing code here
  // Your drawing code here

  // Draw sun
  translate(0, -1000, -200); // Position the sun
  fill(255, 0, 255); // Bright magenta fill color
  noStroke(); // No stroke
  sphere(sunSize, 40, 40);

  // Draw terrain
  translate(0, 950, 0); // Center the terrain
  fill(0); // Black fill color
  stroke(0, 139, 139); // Blue stroke color

  for (let x = 0; x < cols - 1; x++) {
    beginShape(TRIANGLE_STRIP); // Begin drawing a strip of triangles

    for (let y = 0; y < rows; y++) {
      let v1 = terrain[x][y];
      let v2 = terrain[x + 1][y];
      vertex(v1.x, v1.y, v1.z);
      vertex(v2.x, v2.y, v2.z);
    }

    endShape(); // End the strip
  }

  // Draw gradient on the horizon
  drawHorizonGradient();

  // Add white fog near the horizon
  fogX += 50; // Adjust the speed as needed
  fogY -= 1;

  // Ensure fog wraps around when it reaches the right edge of the canvas
  if (fogX > width + fogRadius) {
    fogX = -fogRadius;
    fogY = -height - 50
  }

  drawHorizonFog();
  
}

function drawHorizonFog() {
  
  // Set fill color with opacity for fog
  fill(255, fogOpacity);
  noStroke();
  
  // Draw fog circle
  ellipse(fogX, fogY, fogRadius * 10, fogRadius * 2);

}

function drawHorizonGradient() {
  let horizonTop = -height * 2; // Top of the horizon rectangle
  let horizonBottom = -height; // Bottom of the horizon rectangle
  let gradientColorTop = color(255, 0, 255); // Bright magenta color
  let gradientColorBottom = color(0); // Black color

  // Draw gradient rectangle
  for (let y = horizonTop; y <= horizonBottom; y++) {
    let lerpingColor = lerpColor(gradientColorTop, gradientColorBottom, map(y, horizonTop, horizonBottom, 0, 1));
    stroke(lerpingColor);
    line(-width * 2, y, width * 2, y);
  }
}

function generateTerrain() {
  // Generate terrain vertices
  for (let x = 0; x < cols; x++) {
    terrain[x] = []; // Initialize inner array
    for (let y = 0; y < rows; y++) {
      // Calculate x, y coordinates based on grid spacing
      let xpos = map(x, 0, cols - 1, -width, width);
      let ypos = map(y, 0, rows - 1, -height, height);
      // Set z coordinate based on distance from center
      let xDistance = abs(x - cols / 2);
      zpos = random(-xDistance, xDistance) * mountainScale;
      // Store vertex in terrain array
      terrain[x][y] = createVector(xpos, ypos, zpos);
    }
  }
}