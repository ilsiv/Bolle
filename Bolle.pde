
ParticleSystem ps;
PVector wind;
PVector gravity;
PVector friction;


void setup() {
  size(340, 600);
  //fullScreen();
  gravity = new PVector(0.0, 0.0);
  wind = new PVector(0.0,0.0);
  ps =  new ParticleSystem();
}

void draw() {
  background(40, 40, 40);
  ps.applyForce(gravity);
  ps.applyForce(wind);
  ps.update();
  ps.show();
}

void mousePressed() {
  float w = map(mouseX, 0, 600, -0.2, 0.2);
  float h = map(mouseY, 0, 600, -0.2, 0.2);

  wind = new PVector (w, h);
  ps.applyForce(wind);
}
