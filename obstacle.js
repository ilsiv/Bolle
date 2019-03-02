
function Obstacle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;

  this.show = function() {
    if (DEBUG) {
      push();
      fill(0, 240, 0, 140);
      stroke(0, 255, 0);
      strokeWeight(3);
      rect(this.x, this.y, this.w, this.h);
      pop();
    }
  }
}
