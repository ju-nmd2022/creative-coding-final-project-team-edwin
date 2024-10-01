function setup() {
  createCanvas(innerWidth, innerHeight);
}

function draw() {
  stroke(0);
  rect(width / 2 + 10, height / 2 + 10, 20);
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;

      let r = pixels[index + 0];
      let g = pixels[index + 1];
      let b = pixels[index + 2];
      let a = pixels[index + 3];

      if (r === 0 && g === 0 && b === 0) {
        for (let dy = -5; dy <= 5; dy++) {
          for (let dx = -5; dx <= 5; dx++) {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              let nIndex = (nx + ny * width) * 4;
              let noiseValue = noise(x * 0.01, y * 0.01) * 255;

              pixels[nIndex + 0] = noiseValue;
              pixels[nIndex + 1] = noiseValue;
              pixels[nIndex + 2] = noiseValue;
            }
          }
        }
      }
    }
  }

  updatePixels();
}
