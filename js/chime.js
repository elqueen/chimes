// A Chime

function Chime(x_pos,y_pos,width,height){

  this.constraintPos = createVector(x_pos,y_pos);
  this.constraintLen = 100;
  this.w = width;
  this.h = height;
  this.pos = createVector(this.constraintPos.x,
                          this.constraintPos.y + this.h/2 + this.constraintLen-10);

  this.constraintLeft;
  this.constraintRight;
  this.chime;
  this.chimeModel;

  this.chime = Bodies.rectangle(this.pos.x, this.pos.y, this.w, this.h);

  this.constraintLeft = Constraint.create({
          bodyB: this.chime,
          pointA: { x: this.constraintPos.x-(this.w/2)-20, y: this.constraintPos.y },
          pointB: { x: -1*(this.w/2), y: -1*((this.h/2)-10) },
          stiffness: .8,
          lenght: this.constraintLen });

  this.constraintRight = Constraint.create({
          bodyB: this.chime,
          pointA: { x: this.constraintPos.x+(this.w/2)+20, y: this.constraintPos.y },
          pointB: { x: (this.w/2), y: -1*((this.h/2)-10) },
          stiffness: .8,
          lenght: this.constraintLen });

  this.chimeModel = Composite.create();
  Composite.add(this.chimeModel,[this.chime,this.constraintLeft,this.constraintRight]);

  this.show = function(){
      this.showChimeBody();
      this.showChimeStrings();
  }

  this.showChimeStrings = function() {
    push();
    stroke('#45191B');
    strokeWeight(3);
    //Left Constraint
    line(this.constraintLeft.pointA.x,
         this.constraintLeft.pointA.y,
         this.constraintLeft.bodyB.position.x + this.constraintLeft.pointB.x,
         this.constraintLeft.bodyB.position.y + this.constraintLeft.pointB.y);
    //Right Constraint
    line(this.constraintRight.pointA.x,
         this.constraintRight.pointA.y,
         this.constraintRight.bodyB.position.x + this.constraintRight.pointB.x,
         this.constraintRight.bodyB.position.y + this.constraintRight.pointB.y);
    //String Around
    line(this.constraintLeft.bodyB.position.x + this.constraintLeft.pointB.x,
         this.constraintLeft.bodyB.position.y + this.constraintLeft.pointB.y,
         this.constraintRight.bodyB.position.x + this.constraintRight.pointB.x,
         this.constraintRight.bodyB.position.y + this.constraintRight.pointB.y);
    pop();
  }

  this.showChimeBody = function() {
    push();

    translate (this.chime.position.x,this.chime.position.y);
    rotate(this.chime.angle)
    translate (-this.w/2,-this.h/2); //LeftCorner of Chime

    noStroke();
    //basic chime body
    fill("#CB6D23");
    beginShape();
    vertex (-10, -30);
    vertex (this.w + 10, -30);
    vertex (this.w + 10, 0);
    vertex (this.w, 10);
    vertex (this.w, this.h);
    vertex ((this.w - this.w/2)+5, this.h + 30);
    vertex ((this.w/2)-5, this.h + 30);
    vertex (0, this.h);
    vertex (0, 20);
    vertex (0, 10);
    vertex (-10, 0);
    endShape(CLOSE);

    //chime top
    beginShape();
    fill("#E8A774");
    vertex (-10, -30);
    vertex (this.w + 10, -30);
    vertex (this.w + 10, 0);
    vertex (-10, 0);
    endShape(CLOSE);

    //chime top shadow
    beginShape();
    fill("#854E2E");
    vertex ( -10, 0);
    vertex (this.w + 10, 0);
    vertex (this.w , 10);
    vertex (0, 10);
    endShape(CLOSE);

    // chime opening
    beginShape();
    fill('#541E21');
    vertex (5, (this.h + 30)/2);
    bezierVertex(15,
                 (this.h + 30)/2 - this.w/2,
                 this.w -15,
                 (this.h + 30)/2 - this.w/2,
                 this.w - 5,
                 (this.h + 30)/2);
    vertex (this.w - 5, this.h);
    vertex ((this.w - this.w/2) + 2, this.h + 30);
    vertex ((this.w/2) - 2, this.h + 30);
    vertex (5, this.h);
    stroke('#AA5719');
    strokeWeight(5);
    endShape(CLOSE);

    pop();
  }


}
