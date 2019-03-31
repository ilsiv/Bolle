class ParticleSystem {
  int MAXBALL = (width/100)*(height/100);
  float c = 0.010;

  ArrayList<Particle> particles;


  ParticleSystem() {
    particles = new ArrayList<Particle>();

    for (int i = 0; i < MAXBALL; i++) {
      addParticle();
    }
  }

  void addParticle() {
    particles.add(new Particle(floor(random(0, width)), floor(random(0, height)), floor(random(10, 100))));
  }

  void update() {
    for (Particle p : particles) {
      p.visited = false;
    }
    for (Particle p : particles) {
      p.checkBorders();
    }
    for (Particle p : particles) {
      p.checkCollision(particles);
    }
    for (Particle p : particles) {
      p.repel(particles);
    }

    for (Particle p : particles) {
      p.update();
    }
  }

  void show() {
    for (Particle p : particles) {
      p.show();
    }
  }

  void applyForce(PVector force) {
    for (Particle p : particles) {

      float speed = p.vel.mag();
      float dragMagnitude = c * speed * speed;
      PVector drag = p.vel.get();
      drag.mult(-1);
      drag.normalize();
      drag.mult(dragMagnitude);
      p.applyForce(drag);

      // PVector friction = p.vel.get();
      // friction.mult(-1);
      // friction.normalize();
      // friction.mult(c);
      // p.applyForce(friction);

      p.applyForce(force);
    }
  }
}
