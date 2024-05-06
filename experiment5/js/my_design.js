/* exported getInspirations, initDesign, renderDesign, mutateDesign */
let baseSize = 5;
function getInspirations() {
  return [
    {
      name: "Wet Street", 
      assetUrl: "img/wetStreet01.jpg",
      credit: "some stock photo"
    },
    {
      name: "Overcast Neighborhood", 
      assetUrl: "img/overcastStreet.png",
      credit: "some stock photo"
    },
    {
      name: "Christmas Lane", 
      assetUrl: "img/colorfulChristmas.jpg",
      credit: "some stock photo"
    }
  ];
}

function initDesign(inspiration) {
  // Initialize design object
  let design = {
    sizeScale: 2, // Default size scale for raindrops
    opacity: 200, // Default opacity for raindrops
    numRaindrops: 1000, // Default number of raindrops
    jitter: 15,
    canvasScale: 0.5, // Set canvas size to match inspiration image
    canvasSize: { width: inspiration.image.width, height: inspiration.image.height }
  };

  resizeCanvas(inspiration.image.width/2, inspiration.image.height/2);
  return design;
}

function renderDesign(design, inspiration) {
  // Clear the canvas
  clear();
  
  randomSeed(frameCount);
  
  let averageRGB = calculateAverageRGB(inspiration.image);
  background(averageRGB.r, averageRGB.g, averageRGB.b);
  console.log(calculateAverageRGB(inspiration.image));

  // Draw raindrops based on design parameters
  let canvasSize = design.canvasSize;
  for (let i = 0; i < design.numRaindrops; i++) {
    // Randomly select position for raindrop
    let x = random(canvasSize.width);
    let y = random(canvasSize.height);

    // Get corresponding pixel color from inspiration image
    let pixelColor = inspiration.image.get(x, y);
    
    let red = pixelColor[0]; // Assuming red value is at index 0
    let green = pixelColor[1]; // Assuming green value is at index 1
    let blue = pixelColor[2]; // Assuming blue value is at index 2

    // Combine RGB values into a single integer
    let combinedColor = red + green + blue;
    
    // Calculate final size based on combined color value
    let finalSize = baseSize * Math.sqrt(combinedColor); // Adjust this equation as needed

    // Apply upper limit to final size
    let maxSize = 50; // Define maximum allowable size
    finalSize = min(finalSize, maxSize); // Ensure final size does not exceed maximum size

    // Calculate opacity based on combined color value
    let maxOpacity = 255; // Maximum opacity
    let opacity = map(combinedColor, 0, 255 * 3, maxOpacity, 0); // Inverse mapping: brighter pixels have lower opacity

    // Set fill color using pixel color and adjusted opacity
    noStroke();
    fill(red, green, blue, opacity * design.opacity);

    // Draw raindrop at selected position with calculated size
    ellipse(random(x-design.jitter, x+design.jitter) * design.canvasScale, random(y-design.jitter, y+design.jitter) * design.canvasScale, finalSize * design.sizeScale * design.canvasScale, finalSize * design.sizeScale * design.canvasScale);
  }
}




function mutateDesign(design, inspiration, rate) {
  // Map the rate value to the desired range for sizeScale and numRaindrops
  design.sizeScale = map(rate, 0, 1, 0.5, 2); // Map rate from [0, 1] to [1, 2] for sizeScale
  design.opacity = map(rate, 0, 1, 1, 0.5); // Map rate from [0, 1] to [1, 2] for sizeScale
  design.numRaindrops = map(rate, 0, 1, 4000, 1000); // Map rate from [0, 1] to [2000, 1000] for numRaindrops
  design.jitter = map(rate, 0, 1, 5, 15)
}



function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}

function calculateAverageRGB(image) {
  // Get the width and height of the image
  let w = image.width;
  let h = image.height;

  // Get the pixels of the image
  image.loadPixels();

  // Initialize variables to store sum of RGB components
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;

  // Iterate over all pixels and sum up RGB components
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Calculate pixel index in the pixel array
      let index = (x + y * w) * 4; // Each pixel requires 4 array elements (R, G, B, and A)

      // Get RGB components of the pixel
      let r = image.pixels[index];
      let g = image.pixels[index + 1];
      let b = image.pixels[index + 2];

      // Add RGB components to the sum
      sumR += r;
      sumG += g;
      sumB += b;
    }
  }

  // Calculate the total number of pixels
  let totalPixels = w * h;

  // Calculate the average RGB values
  let avgR = sumR / totalPixels;
  let avgG = sumG / totalPixels;
  let avgB = sumB / totalPixels;

  // Return the average RGB values as an object
  return {
    r: avgR,
    g: avgG,
    b: avgB
  };
}
