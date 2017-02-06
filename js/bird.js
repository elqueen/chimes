/*
 *  The Cute little Bird that can summon Rainbows.
 *  Created by @elqueen
 */

function Bird(){
  this.x = windowWidth - 100;
  this.y = 30;

  this.show = function(){
    noStroke();
    // Feet
    push();
    beginShape();
    stroke('#F2A844');
    strokeWeight(2);
    line(this.x+5, this.y+20, this.x, this.y);
    line(this.x-5, this.y+20, this.x, this.y);
    endShape();
    pop();
    // Body
    beginShape();
    fill('#8444B8');
    ellipse(this.x+3, this.y, 25, 25);
    endShape();
    // Beak
    beginShape();
    fill('#F2A844');
    triangle(this.x-30, this.y-15, this.x-20, this.y-10, this.x-20, this.y-20);
    endShape();
    // Head
    beginShape();
    fill('#8444B8');
    ellipse(this.x-8, this.y-15, 25, 25);
    endShape()
    // Eye
    beginShape();
    fill(255,255,255)
    ellipse(this.x-10, this.y-15, 15, 15);
    fill(0, 0, 0);
    ellipse(this.x-10, this.y-15, 10, 10);
    fill(255,255,255);
    ellipse(this.x-13, this.y-17, 3, 3);
    endShape();
    // Wing
    //Tail
    beginShape();
    fill('#8444B8');
    rect(this.x+10, this.y-15, 20, 20, 10, 5, 10, 5);
    endShape()
  }
}
