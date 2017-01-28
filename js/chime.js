// A Chime

function Chime(x_pos,y_pos,width,height){

  this.constraintPos = createVector(x_pos,y_pos);
  this.constraintLen = 100;
  this.w = width;
  this.h = height;
  this.pos = createVector(this.constraintPos.x,this.constraintPos.y + this.h/2 + this.constraintLen-10);

  this.constraintLeft;
  this.constraintRight;
  this.chime;
  this.chimeModel;

  this.chime = Bodies.rectangle(this.pos.x, this.pos.y, this.w, this.h);

  this.constraintLeft = Constraint.create({
          bodyB: this.chime,
          pointA: { x: this.constraintPos.x-(this.w/2)-10, y: this.constraintPos.y },
          pointB: { x: -1*(this.w/2)+10, y: -1*((this.h/2)-10) },
          stiffness: .8,
          lenght: this.constraintLen });

  this.constraintRight = Constraint.create({
          bodyB: this.chime,
          pointA: { x: this.constraintPos.x+(this.w/2)+10, y: this.constraintPos.y },
          pointB: { x: (this.w/2)-10, y: -1*((this.h/2)-10) },
          stiffness: .8,
          lenght: this.constraintLen });

  this.chimeModel = Composite.create();
  Composite.add(this.chimeModel,[this.chime,this.constraintLeft,this.constraintRight]);

  this.show = function(){
      this.showChimeStrings();
  }

  this.showChimeStrings = function() {
    push();
    stroke('#45191B');
    strokeWeight(3);
    //Left Constraint
    line(this.constraintLeft.pointA.x,
         this.constraintLeft.pointA.y,
         this.constraintLeft.bodyB.position.x +  this.constraintLeft.pointB.x,
         this.constraintLeft.bodyB.position.y +  this.constraintLeft.pointB.y);
    //Right Constraint
    line(this.constraintRight.pointA.x,
         this.constraintRight.pointA.y,
         this.constraintRight.bodyB.position.x +  this.constraintRight.pointB.x,
         this.constraintRight.bodyB.position.y +  this.constraintRight.pointB.y);
    //String Around
    line(this.constraintLeft.bodyB.position.x +  this.constraintLeft.pointB.x,
         this.constraintLeft.bodyB.position.y +  this.constraintLeft.pointB.y,
         this.constraintRight.bodyB.position.x +  this.constraintRight.pointB.x,
         this.constraintRight.bodyB.position.y +  this.constraintRight.pointB.y);
    pop();
  }


}
