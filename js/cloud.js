function Cloud(h){
    this.x = 0;
    this.y = h;
    this.speed = random(.25, 1);
    this.scale = random(.25,1);
    this.color = 'rgba(254, 255, 249,'+ random(.1,.8)+')'

    this.show = function(){
        push();
        translate(this.x - 500*this.scale, this.y);
        scale(this.scale);
        beginShape();
        fill(this.color);
        noStroke();
        vertex(200, 80);
        var number = random (200);
        bezierVertex(80, 90, 130, 150, 230, 150);
        bezierVertex(420, 150, 420, 120, 390, 100);
        bezierVertex(430, 40, 370, 30, 340 , 50 );
        bezierVertex(320 , 5, 250, 20, 250, 50);
        bezierVertex(200, 5, 150, 20, 200, 80);
        endShape();
        pop();
    }

    this.move = function(){
        this.x = this.x + this.speed;
    }

    this.shouldDie = function(){
      return this.x > windowWidth + 500*this.scale
    }
}
