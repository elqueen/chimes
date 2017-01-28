// Define any global variables here
// (BUT don't call any p5 methods here;
//  call them in the functions below!)

var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Body = Matter.Body;
    Constraint = Matter.Constraint;
    Composite = Matter.Composite;

var engine;
var chimes = [];
var chimeModels = [];
var wind;

function setup() {
  createCanvas(windowWidth, windowHeight); // Use the full browser window

  // create an engine
  engine = Engine.create();

  // create two boxes and a ground
  var ground = Bodies.rectangle(windowWidth/2, windowHeight-30, windowWidth, 60, { isStatic: true });
  for (i = 0; i<8 ;i++){
      var chime = new Chime(150 + (150*i), 50, 80, 500 - (25*i));
      chimes.push(chime);
      chimeModels.push(chime.chimeModel);
  }

  // add all of the bodies to the world
  var bodies = chimeModels.concat(ground);
  World.add(engine.world, bodies);

  // Additional setup goes here
  background('blue');

  wind = createSlider(0, 200, 0);
  wind.position(windowWidth - 100, windowHeight-30);
  wind.style('width', '80px');
}

function draw() {
  clear();
  windy();
  Engine.update(engine, 1000 / 60);
  background('lightblue');
  var bodies = Composite.allBodies(engine.world);
  var constraints = Composite.allConstraints(engine.world);

  for (var i = 0; i < constraints.length; i++) {
      var constraint = constraints[i];
      push();
      beginShape();
      vertex(constraint.pointA.x, constraint.pointA.y);
      vertex(constraint.bodyB.position.x + constraint.pointB.x, constraint.bodyB.position.y +constraint.pointB.y);
      endShape(CLOSE);
      pop();
  }

  for (var i = 0; i < bodies.length; i++) {
      var vertices = bodies[i].vertices;
      push();
      fill('rgba(255,255,255,.5)')
      beginShape();
      for (var j = 0; j < vertices.length; j++) {
          vertex(vertices[j].x, vertices[j].y);
      }
      endShape(CLOSE);
      pop();
  }
}

// Define any additional helper functions here

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

/*function keyPressed(){
  for (i = 0; i<chimes.length ;i++){
    Body.applyForce(chimes[i].chime,{x:100,y:500},{x:wind.value()/(i+1),y:0});
  }

}*/

function windy(){
  for (i = 0; i<chimes.length ;i++){
    Body.applyForce(chimes[i].chime,{x:100,y:500},{x:(wind.value()/1000)/(i+1),y:0});
  }
}
