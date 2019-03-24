
ParticleSystem ps;
PVector wind;
PVector gravity;
PVector friction;


void setup() {
  size(600, 600);
  gravity = new PVector(0.0, 0.1);
  wind = new PVector();
  ps =  new ParticleSystem();
}

void draw() {
  background(255, 255, 255);
  ps.applyForce(gravity);
  ps.applyForce(wind);
  ps.update();
  ps.show();
}

void mousePressed() {
  float w = map(mouseX, 0, 600, -0.3, 0.3);
  float h = map(mouseY, 0, 600, -0.3, 0.3);

  wind = new PVector (w, h);
  ps.applyForce(wind);
}
