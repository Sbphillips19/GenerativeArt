let camAngle = 0.0;
let xspacing = 28;
let maxwaves = 8;
let theta = 0.0;
let thetaIncrement = 0.01;
let amplitude = [];
let dx = [];
let yvalues = [];
let chains = [];
let w, maxHexagons, numHexagons, camX, camY, camZ, ethereumColor, optimismColor, baseColor, version, minSize, maxSize, maxHexSize, boxType, shapeType, ethSize, splitSize, numberHexagonsSplit, ethereumLogoColor;
let ethereumColors = [];

class Hexagon {
  constructor(x, y, s, hexC) {
    this.center = createVector(x, y);
    this.size = s;
    this.hexColor = hexC;
    this.velocity = p5.Vector.random2D().mult(hl.randomInt(3, 7));
    this.maxHexSize = maxHexSize;
  }

  update() {
    this.center.add(this.velocity);
    if (this.center.x < 0 || this.center.x > width) this.velocity.x *= -1;
    if (this.center.y < 0 || this.center.y > height) this.velocity.y *= -1;
    if (frameCount % 30 == 0) this.size += 4;
    this.size = constrain(this.size, 0, this.maxHexSize);
  }

  display() {
    push();
    translate(this.center.x, this.center.y);
    let currentAlpha = lerp(128, 255, this.size / this.maxHexSize);
    fill(red(this.hexColor), green(this.hexColor), blue(this.hexColor), currentAlpha);
    noStroke();
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      vertex(cos(angle) * this.size, sin(angle) * this.size);
    }
    endShape(CLOSE);
    pop();
  }

  shouldSplit() {
    return this.size >= this.maxHexSize;
  }

  split() {
    let newHexagons = [];
    let newSize = this.maxHexSize / splitSize;
    newHexagons.push(new Hexagon(this.center.x + hl.randomInt(-10, 10), this.center.y + hl.randomInt(-10, 10), newSize, this.hexColor));
    newHexagons.push(new Hexagon(this.center.x + hl.randomInt(-10, 10), this.center.y + hl.randomInt(-10, 10), newSize, this.hexColor));
    return newHexagons;
  }
}

class Chain {
  constructor(c) {
    this.hexagons = [];
    this.chainColor = c;
  }

  addHexagon(hex) {
    this.hexagons.push(hex);
  }

  updateAndDisplay() {
    for (let i = this.hexagons.length - 1; i >= 0; i--) {
      let hex = this.hexagons[i];
      hex.update();
      hex.display();
      if (hex.shouldSplit()) {
        this.hexagons.push(...hex.split());
        this.hexagons.splice(i, 1);
      }
    }
  }

  drawNetworkConnections() {
    stroke(this.chainColor);
    for (let i = 0; i < this.hexagons.length; i++) {
      let hex1 = this.hexagons[i];
      for (let j = i + 1; j < this.hexagons.length; j++) {
        let hex2 = this.hexagons[j];
        line(hex1.center.x, hex1.center.y, hex2.center.x, hex2.center.y);
      }
    }
  }
}


// function getParameterByName(name, url = window.location.href) {
//   name = name.replace(/[\[\]]/g, '\\$&');
//   const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
//     results = regex.exec(url);
//   if (!results) return null;
//   if (!results[2]) return '';
//   return decodeURIComponent(results[2].replace(/\+/g, ' '));
// }

function setup() {
  version = hl.tx.tokenId;
  // version = parseInt(getParameterByName('version')) || 0;
  // randomSeed(version);
  // random();
  setupHexagonsByVersion(version);
  shapeType = hl.random();
  ethSize = hl.random();
  ethereumLogoColor = hl.random();
  maxHexagons = int(hl.random(150, 250));
  numHexagons = int(hl.random(7, 10));
  splitSize = int(hl.random(3, 5));
  numberHexagonsSplit = int(hl.random(20, 25))

  let versionMod = version % 20;
  thetaIncrement = versionMod * 0.01 + 0.01;


  createCanvas(800, 800, WEBGL);
  // createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);
  w = width + 26;
  ethereumColors = [
    color(113, 107, 148),
    color(33, 92, 175),
    color(0, 120, 148),
    color(98, 115, 19),
    color(142, 103, 19),
    color(183, 53, 45),
    color(167, 17, 122),
    color(55, 54, 123),
    color(111, 111, 111),
    color(198, 197, 212),
    color(72, 203, 217),
    color(121, 231, 231),
    color(0, 255, 0),
    color(255, 255, 0),
    color(255, 165, 0),
    color(128, 0, 128),
    color(255, 192, 203),
    color(64, 224, 208),
    color(0, 128, 128),
    color(255, 0, 255),
    color(0, 255, 255),
    color(0, 255, 127),
    color(255, 20, 147),
    color(173, 255, 47),
    color(135, 206, 250),
    color(255, 105, 180),
    color(255, 215, 0),
    color(0, 191, 255),
    color(72, 61, 139),
    color(123, 104, 238),
    color(0, 206, 209),
    color(32, 178, 170),
    color(50, 205, 50),
    color(255, 69, 0),
    color(218, 112, 214),
    color(219, 112, 147),
    color(255, 127, 80),
    color(240, 128, 128),
    color(255, 99, 71),
    color(255, 228, 181),
    color(255, 218, 185),
    color(255, 222, 173),
    color(255, 250, 205),
    color(255, 239, 213),
    color(255, 228, 225),
    color(255, 240, 245),
    color(250, 235, 215),
    color(245, 245, 220)
  ]
  ethereumColor = ethereumColors[version % ethereumColors.length]
  optimismColor = color(255, 4, 32);
  baseColor = color(0, 82, 255);

  let initialChain = new Chain(optimismColor);
  for (let i = 0; i < numHexagons; i++) {
    let hexSize = hl.random(minSize, maxSize);
    initialChain.addHexagon(new Hexagon(hl.random(width), hl.random(height), hexSize, optimismColor));
  }
  chains.push(initialChain);

  for (let i = 0; i < maxwaves; i++) {
    amplitude[i] = hl.random(10, 30);
    let period = hl.random(100, 600);
    dx[i] = (TWO_PI / period) * xspacing;
  }

  yvalues = new Array(floor(w / xspacing));

  camX = width / 2.0;
  camY = height / 2.0;
  camZ = (height / 2.0) / tan(PI / 6);



  const typeofShape= shapeType < 0.45 ? "box":shapeType < 0.60?
  "plane"? shapeType < 0.75 : "torusCircle"? shapeType < 0.9: "torus donut": "sphere";

  const typeofETHSize= ethSize < 0.3 ? "small" : ethSize < 0.7 ?
  "medium": "large";

  // Create an object defining the traits of our token
  let traits = {
      "Ethereum Color/ 3rd Chain Color": ethereumColor.toString(),
      "Max Hexagons": maxHexagons.toString(),
      "Number of Hexagons Starting": numHexagons.toString(),
      "Split Size": splitSize.toString(),
      "Shape Type": typeofShape.toString(),
      "Eth Size": typeofETHSize.toString(),
  };

  // Set these traits so Highlight can read them
  hl.token.setTraits(traits);
  // Also set a name and description for this token
  hl.token.setName(`Bedrock to Superchain #${hl.tx.tokenId}`);
  hl.token.setDescription(
    `This series implements the dynamic evolution of the OP stack and my perception of the blockchain.  This token starts with ${numHexagons} and splits every ${splitSize}.  Once its at 3 chains it will run until ${maxHexagons} and then reset in a loop`
  );
}



function totalHexagons() {
  return chains.reduce((total, chain) => total + chain.hexagons.length, 0);
}

function resetSketch() {
  chains = [new Chain(optimismColor)];
  setupHexagonsByVersion(version);
  for (let i = 0; i < numHexagons; i++) {
    let hexSize = hl.random(minSize, maxSize);
    chains[0].addHexagon(new Hexagon(hl.random(width), hl.random(height), hexSize, optimismColor));
  }
}

function draw() {
  if (totalHexagons() >= maxHexagons) {
    resetSketch();
    return;
  }

  camAngle += 0.005;
  camX = width / 2 + sin(camAngle) * 300;
  camY = height / 2 + cos(camAngle) * 300;
  camZ = (height / 2.0) / tan(PI / 6.0) * 1.1;
  camera(camX, camY, camZ, width / 2, height / 2, 0, 0, 1, 0);

  background(0);
  if (version % 5 === 1) {
    orbitControl();
  }
  draw3DBoxes();
  calcWave();
  renderWave();

  for (let chain of chains) {
    chain.updateAndDisplay();
    chain.drawNetworkConnections();

    if (chain.hexagons.length >= numberHexagonsSplit) {
      let newChain;
      let newColor;

      if (chain.chainColor === optimismColor) {
        newColor = baseColor;
      } else if (chain.chainColor === baseColor) {
        newColor = ethereumColor;
      } else {
        continue;
      }

      newChain = new Chain(newColor);
      for (let j = 0; j < Math.floor(numberHexagonsSplit / 2); j++) {
        let hexSize = hl.random(minSize, maxSize);
        let hex = chain.hexagons.shift();
        newChain.addHexagon(new Hexagon(hex.center.x, hex.center.y, hexSize, newColor));
      }
      chains.push(newChain);
    }
  }
}


function draw3DBoxes() {
  let spacing = 50 + (version % 10) * 5;
  let boxSize = 30 + (version % 5) * 5;


  if (version % 20 === 18) {
    boxSize += 20;
  }
  for (let x = -50; x <= width + 50; x += spacing) {
    for (let y = -50; y <= height + 50; y += spacing) {
      push();
      translate(x, y, -90);
      rotateY(map(mouseX, 0, width, 0, PI));
      rotateX(map(mouseY, 0, height, 0, PI));
      fill(255);
      stroke(0);
      if (shapeType < 0.45) {
        box(boxSize);
      } else if (shapeType < 0.60) {
        plane(boxSize);
      } else if (shapeType < 0.75) {
        torus(boxSize);
      } else if (shapeType < 0.9) {
        torus(boxSize / 2);
      } else {
        sphere(boxSize);
      }
      pop();
    }
  }
}

function calcWave() {
  theta += thetaIncrement;

  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = 0;
  }

  for (let j = 0; j < maxwaves; j++) {
    let x = theta;
    for (let i = 0; i < yvalues.length; i++) {
      yvalues[i] += (j % 2 === 0 ? sin(x) : cos(x)) * amplitude[j];
      x += dx[j];
    }
  }
}

function drawEthereumLogo(centerX, centerY, scale, zDepth) {
  let originalWidth = 784;
  let originalHeight = 1278;
  let processingScale = scale / originalHeight;

  let coordinates = [
    [392, 0, 384, 30, 384, 874, 392, 884, 784, 650],
    [392, 0, 0, 650, 392, 882, 392, 472],
    [392, 956, 388, 962, 388, 1264, 392, 1278, 784, 724],
    [392, 1278, 392, 956, 0, 724],
    [392, 882, 784, 650, 392, 472],
    [0, 650, 392, 882, 392, 472]
  ];

  ethereumLogoColor = ethereumLogoColor < 0.3 ? '#343434' : ethereumLogoColor < 0.4 ? '#8C8C8C' : ethereumLogoColor < 0.6 ? '#3C3C3B' : ethereumLogoColor < 0.8 ? '#8C8C8C' : ethereumLogoColor < 0.9 ? '#141414' : '#393939';

  for (let i = 0; i < coordinates.length; i++) {
    push();
    fill(ethereumLogoColor);
    noStroke();
    translate(0, 0, zDepth);
    beginShape();
    for (let j = 0; j < coordinates[i].length; j += 2) {
      let x = centerX + (coordinates[i][j] - originalWidth / 2) * processingScale;
      let y = centerY + (coordinates[i][j + 1] - originalHeight / 2) * processingScale;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

function renderWave() {
  for (let x = 0; x < yvalues.length; x++) {
    push();
    if (ethSize < 0.3) {
      drawEthereumLogo(x * xspacing, 600 + yvalues[x], 30, 150);
    }
    else if (ethSize < 0.7) {
      drawEthereumLogo(x * xspacing, 550 + yvalues[x], 40, 150);
    } else {
      drawEthereumLogo(x * xspacing, 500 + yvalues[x], 50, 250);
    }
    pop();
  }
}

function setupHexagonsByVersion(version) {
  switch (version % 10) {
    case 0:
      minSize = 20; maxSize = 55; maxHexSize = 60;
      break;
    case 1:
      minSize = 10; maxSize = 30; maxHexSize = 40;
      break;
    case 2:
      minSize = 3; maxSize = 8; maxHexSize = 15;
      break;
    case 3:
      minSize = 25; maxSize = 35; maxHexSize = 60;
      break;
    case 4:
      minSize = 1; maxSize = 5; maxHexSize = 35;
      break;
    case 5:
      minSize = 5; maxSize = 30; maxHexSize = 50;
      break;
    case 6:
      minSize = 30; maxSize = 50; maxHexSize = 75;
      break;
    case 7:
      minSize = 20; maxSize = 40; maxHexSize = 65;
      break;
    case 8:
      minSize = 10; maxSize = 80; maxHexSize = 90;
      break;
    case 9:
      minSize = 5; maxSize = 20; maxHexSize = 25;
      break;
    default:
      minSize = 8; maxSize = 30; maxHexSize = 60;
      break;
  }
}

/*
 * Window resize
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


/*
 * Keyboard shortcuts for saving, redrawing, etc.
 */
function keyTyped() {
  switch (key) {
    case "s":
      saveCanvas();
      break;
    case "r":
      redraw();
      break;
  }
}
