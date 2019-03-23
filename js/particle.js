function Particle(x, y, n) {
  this.pos = createVector(x, y);
  this.posnext = createVector();
  this.vel = createVector(int(random(0, 3)), int(random(0, 3)));
  this.velnext = createVector();
  this.acc = createVector(int(random(0, 3)), int(random(0, 3)));
  this.Raggio = floor(random(MINRAGGIO, MAXRAGGIO));
  this.m = this.Raggio;
  this.num = n;
  this.COR = 1.00; //coefficient of restitution COR = Vel aftercollision/ vel before collision
  this.AIR = createVector(0.0, random(-0.015, 0));

  this.show = function() {
    // noFill();
    push();
    if (this.num % 2 == 0) {
      stroke(0, 0, 255, 100);
      fill(255, 255, 200);
    } else {
      stroke(130, 130, 255, 100);
      fill(255, 0, 255);
    }
    strokeWeight(1);
    stroke(255, 255, 255);
    ellipse(this.pos.x, this.pos.y, this.Raggio * 2, this.Raggio * 2);
    pop();
  }

  this.checkBorders = function() {

    if (this.pos.y >= (canvas.height - this.Raggio - SPAN)) {
      this.vel.y *= -this.COR;
      this.pos.y = (canvas.height - this.Raggio - SPAN);
    }

    if (this.pos.y <= (this.Raggio + SPAN)) {
      this.vel.y *= -this.COR;
      this.pos.y = (this.Raggio + SPAN);
    }

    if (this.pos.x <= (this.Raggio + SPAN)) {
      this.vel.x *= -this.COR;
      this.pos.x = (this.Raggio + SPAN);
    }
  }


  this.checkObstacles = function() {
    // let prox = createVector();
    // prox = this.pos.copy();
    //let nextvel = this.vel.copy();
    // nextvel.add(this.acc);
    // nextvel.add(this.AIR);
    // this.pos.add(this.vel);

    for (let i = 0; i < obstacles.length; i++) {
      if ((this.pos.y + this.Raggio + SPAN >= obstacles[i].y) &&
        (this.pos.y - this.Raggio - SPAN <= obstacles[i].y + obstacles[i].h) &&
        (this.pos.x + this.Raggio + SPAN >= obstacles[i].x) &&
        (this.pos.x - this.Raggio - SPAN <= obstacles[i].x + obstacles[i].w)) {
        if ((this.pos.y + this.Raggio + SPAN - obstacles[i].y <= 10)) {
          this.vel.y *= -this.COR;
          this.pos.y -= SPAN;
        } else if ((this.pos.x + this.Raggio + SPAN - obstacles[i].x <= 10)) {
          this.vel.x *= -this.COR;
          this.pos.x -= SPAN;
        } else if ((this.pos.y - this.Raggio - SPAN - (obstacles[i].y + obstacles[i].h) >= -10)) {
          this.vel.y *= -this.COR;
          this.pos.y += SPAN;
        } else if ((this.pos.x - this.Raggio - SPAN - (obstacles[i].x + obstacles[i].w) >= -10)) {
          this.pos.x += SPAN;
          this.vel.x *= -this.COR;
        }
      }
    }

  }


  this.update = function() {
    this.checkBorders();
    this.checkObstacles();
    this.posnext = this.pos.copy();
    this.velnext = this.vel.copy();
    // for (let i = 0; i < obstacles.length; i++) {
    //   obstacles[i].checkObstacles();
    // }

    // cicla per verificare che la particella non collida con le altre
    for (let i = 0; i < particles.length; i++) {
      let other = particles[i];
      if (this != particles[i]) {
        this.collision(other);
      }
    }

    this.pos = this.posnext.copy();
    this.vel = this.velnext.copy();

    this.vel.add(this.acc);
    // this.vel.add(this.AIR);
    this.vel.limit(SPAN);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.offScreen = function() {
    // let prox = createVector();
    // prox = this.pos.copy();
    //this.pos.add(this.vel);
    if (((this.pos.x - this.Raggio) <= 0) || ((this.pos.x - this.Raggio) >= canvas.width)) {
      return true;
    }
    for (let i = 0; i < obstacles.length; i++) {
      if ((this.pos.y >= obstacles[i].y) &&
        (this.pos.y <= obstacles[i].y + obstacles[i].h) &&
        (this.pos.x >= obstacles[i].x) &&
        (this.pos.x <= obstacles[i].x + obstacles[i].w)) {
        return true;
      }
    }
    return false;
  }

  this.applyforce = function(force) {
    let f = force.copy();
    this.acc.add(f);
  }

  this.applyforcemap = function() {
    if (this.pos.x >= 0 && this.pos.y >= 0 && this.pos.x <= canvas.width && this.pos.y <= canvas.height) {
      let x = floor(this.pos.x / WINDDIMENSION);
      let y = floor(this.pos.y / WINDDIMENSION);
      this.applyforce(windmap[x][y]);
    }
  }

  this.rotateVelocities = function(velocity, theta) {
    const rotatedVelocity = {
      x: velocity.x * Math.cos(theta) - velocity.y * Math.sin(theta),
      y: velocity.x * Math.sin(theta) + velocity.y * Math.cos(theta)
    };
    return rotatedVelocity;
  }

  this.collision = function(target) {

    if (this.posnext.dist(target.pos) - (this.Raggio + target.Raggio) <= SPAN) {

      // preso da codepen.io
      //https://codepen.io/silvio_news/pen/LXwdKr
      let res = createVector();
      res.x = this.velnext.x - target.vel.x;
      res.y = this.velnext.y - target.vel.y;

      if (res.x * ((target.pos.x + 2 * target.vel.x) - (this.posnext.x + 2 * this.velnext.x))
      + res.y * ((target.pos.y + 2 * target.vel.y) - (this.posnext.y + 2 * this.velnext.y)) > SPAN) {
        const m1 = this.m;
        const m2 = target.m;
        const theta = -Math.atan2(target.pos.y - this.posnext.y, target.pos.x - this.posnext.x);

        const rotatedVelocity1 = this.rotateVelocities(this.velnext, theta);
        const rotatedVelocity2 = this.rotateVelocities(target.vel, theta);

        const swapVelocity1 = {
          x: rotatedVelocity1.x * (m1 - m2) / (m1 + m2) + rotatedVelocity2.x * 2 * m2 / (m1 + m2),
          y: rotatedVelocity1.y
        };
        const swapVelocity2 = {
          x: rotatedVelocity2.x * (m1 - m2) / (m1 + m2) + rotatedVelocity1.x * 2 * m1 / (m1 + m2),
          y: rotatedVelocity2.y
        };

        const u1 = this.rotateVelocities(swapVelocity1, -theta);
        const u2 = this.rotateVelocities(swapVelocity2, -theta);

        this.velnext.x = u1.x * this.COR;
        this.velnext.y = u1.y * this.COR;
        target.vel.x = u2.x * this.COR;
        target.vel.y = u2.y * this.COR;

        this.acc.x = 0;
        this.acc.y = 0;

      }
      return true;
    }
  }
  return false;
}
