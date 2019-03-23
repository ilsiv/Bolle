let particles = [];
let obstacles = [];
let windmap = [];
let WINDDIMENSION;
let MAXRAGGIO = 20;
let MINRAGGIO = 10;
let SPAN = 3;
let CELLS = 10;
let DEBUG = true;

let gravity;
let numparticles = 600;


function setup() {
  // var canvas = createCanvas(400, 600);
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.id('sketch-container');
pixelDensity(displayDensity());
  //noLoop();
  fullscreen();
  //frameRate(10);

  let xoff = 0;
  let yoff = 0;
  let zoff = 0;

  let inc = 0.1;

  WINDDIMENSION = canvas.width / CELLS;
  gravity = createVector(0.00, 0.1);

  for (let i = 0; i <= floor(canvas.width / WINDDIMENSION); i++) {
    windmap[i] = [];
    for (let j = 0; j <= floor(canvas.height / WINDDIMENSION); j++) {
      windmap[i][j] = createVector(map(noise(xoff, zoff), 0, 1, -0.01, 0.05), map(noise(yoff, zoff), 0, 1, 0, 0.05));
      // windmap[i][j]=createVector(0,0);
      // windmap[i][j] = createVector(random(-1, 1) / 10, random(-1, 1) / 10);
      // windmap[i][j] = createVector(0.01 * j, 0.02);
      yoff += inc;
    }
    xoff += inc;
    zoff += inc;
  }
  let p = new Particle(30, 50, ++num, null, null);
  particles.push(p);
}

let iwind, jwind;

function mousePressed() {
  let x = mouseX;
  let y = mouseY;
  iwind = x;
  jwind = y;
}

function mouseReleased() {
  let o = new Obstacle(iwind, jwind, mouseX - iwind, mouseY - jwind);
  obstacles.push(o);
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}

var num = 0;

function draw() {
  background(40);
  // background(180, 40, 45);
  if (DEBUG) {
    push();
    fill(0, 240, 0, 140);
    stroke(0, 255, 0);
    strokeWeight(3);
    textSize(32);
    text(particles.length, 100, 100);
    text(num, 200, 100);
    pop();
    for (let i = 0; i <= floor(canvas.width / WINDDIMENSION); i++) {
      for (let j = 0; j <= floor(canvas.height / WINDDIMENSION); j++) {
        push();
        stroke(0, 0, 255, 100);
        strokeWeight(3);
        translate(i * WINDDIMENSION + WINDDIMENSION / 2, j * WINDDIMENSION + WINDDIMENSION / 2);
        line(0, 0, (1000 * windmap[i][j].x), (1000 * windmap[i][j].y));
        stroke(0, 255, 0, 100);
        strokeWeight(10);
        point(0, 0);
        pop();

      }
    }
  }

  let x, y;
  x = random(40, 50);
  y = random(40, 50);
  let v = createVector(x, y)
  let crea = true;
  if (crea % 1 == 0) {
    for (let i = 0; i < particles.length; i++) {
      if (v.dist(particles[i].pos) < (particles[i].Raggio * 2) || particles.length >= numparticles) {
        crea = false;
      }
    }
    if (crea) {
      let p = new Particle(x, y, ++num);
      particles.push(p);
    }
  }
  if (particles.length > numparticles) {
    particles.splice(0, 1);
  }
  for (let i = 0; i < particles.length; i++) {
    if (particles[i].offScreen()) {
      particles.splice(i, 1);
    }
  }
  for (let i = 0; i < particles.length; i++) {
    particles[i].applyforce(gravity);
    particles[i].applyforcemap();
    particles[i].update();
    particles[i].show();
  }
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].show();
  }
}
