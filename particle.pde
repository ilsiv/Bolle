

class Particle {
  PVector loc;
  PVector vel;
  PVector acc;
  float mass;
  int dim;
  boolean visited = false;
  color col;

  Particle(int x_, int y_, int d_) {
    loc = new PVector (x_, y_);
    vel = new PVector (random(-2, 2), random(-2, 2));
    acc = new PVector (random(-0.3, 0.3), random(-0.3, 0.3));
    dim = floor(random(20, 100));
    mass = d_;
    col = color(random(0, 255), random(0, 255), random(0, 255));
  }

  void show() {
    pushMatrix();
    fill(col, 200);

    translate(loc.x, loc.y);
    ellipse(0, 0, dim, dim);
    popMatrix();
  }

  void update() {
    // checkBorders();
    acc.limit(1);
    vel.add(acc);

    vel.limit(1);

    loc.add(vel);
    acc.mult(0);
  }

  void checkBorders() {
    if (loc.x > width - dim/2 - 5) {
      vel.x *= -0.90;
      loc.x = width - dim/2 - 5;
    }
    if ((loc.x < 0 + dim/2 + 5)) {
      vel.x *= -0.90;
      loc.x = 0 + dim/2 + 5;
    }
    if (loc.y > height - dim/2 - 5) {
      // vel.y = 0;
      vel.y *= -0.90;
      loc.y = height - dim/2 - 5;
    }
    if (loc.y < 0 + dim/2 + 5) {
      vel.y *= -0.90;
      loc.y = 0 + dim/2 + 5;
    }
  }

  void checkCollision(ArrayList<Particle> particles) {
    //da verificare
    float xDist, yDist;
    for (Particle target : particles) {

      Particle B = target;
      if (target != this) {
        xDist = loc.x - B.loc.x;
        yDist = loc.y - B.loc.y;
        float distSquared = xDist * xDist + yDist * yDist;

        //checks the squared distance for collision
        if (distSquared <= (dim / 2 + B.dim / 2) * (dim / 2 + B.dim / 2) ) {
          float xVelocity = B.vel.x - vel.y;
          float yVelocity = B.vel.y - vel.y;
          float dotProduct = xDist * xVelocity + yDist * yVelocity;

          //checks if the objects moves towards one another
          if (dotProduct > 0) {
            float collisionScale = dotProduct / distSquared;
            float xCollision = xDist * collisionScale;
            float yCollision = yDist * collisionScale;

            float combindedMass = mass + B.mass;
            float collisionWeightA = 2 * B.mass / combindedMass;
            float collisionWeightB = 2 * mass / combindedMass;

            //The Collision vector is the speed difference projected on the Dist vector
            if (!visited) {
              vel.x += collisionWeightA * xCollision * 0.95;
              vel.y += collisionWeightA * yCollision * 0.95;
              visited = true;
            }
            if (!target.visited) {
              target.vel.x -= collisionWeightB * xCollision;
              target.vel.y -= collisionWeightB * yCollision;
            }
          }
        }
      }
    }
  }

  void applyForce(PVector force) {
    PVector f = force.get();
    f.div(mass);
    acc.add(force);
  }

  void repel(ArrayList<Particle> particles) {
    float dist;

    for (Particle target : particles) {
      if (target != this) {
        dist = loc.dist( target.loc);
        if (dist <= dim / 2 + target.dim / 2) {
          PVector dir = PVector.sub( target.loc, loc);
          dir.normalize();
          dir.mult(1);
          target.acc.add(dir);
        }
      }
    }
  }

  /*
  void bounce(Mover ballA, Mover ballB) {
   PVector ab = new PVector();
   ab.set(ballA.location);
   ab.sub(ballB.location);
   ab.normalize();
   while(ballA.location.dist(ballB.location) < (ballA.mass*3/2 + ballB.mass*3/2)) {   //*spring) {
   ballA.location.add(ab);
   }
   PVector n = PVector.sub(ballA.location, ballB.location);
   n.normalize();
   PVector u = PVector.sub(ballA.speed, ballB.speed);
   PVector un = componentVector(u,n);
   u.sub(un);
   ballA.speed = PVector.add(u, ballB.speed);
   ballB.speed= PVector.add(un, ballB.speed);
   }
   
   PVector componentVector (PVector vector, PVector directionVector) {
   directionVector.normalize();
   directionVector.mult(vector.dot(directionVector));
   return directionVector;
   }
   */
}
