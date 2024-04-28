"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  gameOver = false;
  score = 0;
  clicks = {};
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  
  let n = clicks[[i, j]] | 0;

  if (n % 2 == 0) { score++; }
  
  let key = [i, j];
  clicks[key] = 1;
  
  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    
      gameOver = true;
      return true;
    
  }
  
  //// ==== RECURSION ====
  let count = 0;
  if (XXH.h32("tile:" + [i-1, j], worldSeed) % 4 == 0) {
    count ++;
  }
  if (XXH.h32("tile:" + [i+1, j], worldSeed) % 4 == 0) {
    count ++;
  }
  if (XXH.h32("tile:" + [i, j+1], worldSeed) % 4 == 0) {
    count ++;
  }
  if (XXH.h32("tile:" + [i, j-1], worldSeed) % 4 == 0) {
    count ++;
    }
  
  if (count == 0) {
    // Recursive clearing of adjacent tiles
    clearAdjacentTiles(i, j);
  }
  
  return false;
}

function clearAdjacentTiles(i, j) {
  
  console.log("howdy");
    // Array of adjacent offsets
  const offsets = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];

  // Check adjacent tiles
  for (let [dx, dy] of offsets) {
    let ni = i + dx;
    let nj = j + dy;
    // Check if the adjacent tile is within bounds and hasn't been clicked yet
    if (!(clicks[[ni, nj]] && XXH.h32("tile:" + [i, j], worldSeed) % 4 != 0)) {
      // Click the adjacent tile recursively
      p3_tileClicked(ni, nj);
  
    }
    
  }
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  
  noStroke();
  let n = clicks[[i, j]] | 0;

  if (n % 2 == 1 || gameOver) {
    
    if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
      gameOver = true;
      fill(255, 0, 0);
    } else {
      
      let count = 0;
      if (XXH.h32("tile:" + [i-1, j], worldSeed) % 4 == 0) {
        count ++;
      }
      if (XXH.h32("tile:" + [i+1, j], worldSeed) % 4 == 0) {
        count ++;
      }
      if (XXH.h32("tile:" + [i, j+1], worldSeed) % 4 == 0) {
        count ++;
      }
      if (XXH.h32("tile:" + [i, j-1], worldSeed) % 4 == 0) {
        count ++;
      }

      if (count >= 0) {fill (255, 255 - (count * 60), 0);}
      else { fill(255, 200); }
    }
  } else {
    fill(255, 255, 255);
  }
  
  if (gameOver && XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    
      fill(255, 0, 0);
    
  }

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  
  endShape(CLOSE);

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  //text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
