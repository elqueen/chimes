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
          lenght: this.constraintLen
  })

  this.constraintRight = Constraint.create({
          bodyB: this.chime,
          pointA: { x: this.constraintPos.x+(this.w/2)+10, y: this.constraintPos.y },
          pointB: { x: (this.w/2)-10, y: -1*((this.h/2)-10) },
          stiffness: .8,
          lenght: this.constraintLen
  })

  this.chimeModel = Composite.create();
  Composite.add(this.chimeModel,[this.chime,this.constraintLeft,this.constraintRight])
}
