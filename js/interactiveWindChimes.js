// Define any global variables here
// (BUT don't call any p5 methods here;
//  call them in the functions below!)

// For Physics
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite;

var engine;
var chimes = [];
var chimeModels = [];
var windSlider;
var worldBodies = [];

// Chime Characteristics
var numberofChimes = 8;
var chimeWidth = 80;
var spaceAroundChime = chimeWidth + 70;
var largestChimeHeight = 500;
var reduceChimeHeight = 25;
var chimeHangerY = 50;
var chimeHangerThickness= 30;

//For kicks
var showSlider = true;
var showModel = false;
var showVisuals = true;
var showSound = true;

function setup() {
  createCanvas(windowWidth, windowHeight); // Use the full browser window

  // Create Physics Enginer
  engine = Engine.create();

  var startingX = (windowWidth - (numberofChimes - 1) * spaceAroundChime)/2;

  // Create Chimes
  for (i = 0; i< numberofChimes ;i++){
      var chime = new Chime(startingX + (spaceAroundChime*i),
                            chimeHangerY+chimeHangerThickness,
                            chimeWidth,
                            largestChimeHeight - (reduceChimeHeight*i));
      chimes.push(chime);
      chimeModels.push(chime.chimeModel);
  }

  var chimeHanger = Bodies.rectangle(windowWidth/2,
                                     chimeHangerY + chimeHangerThickness/2,
                                     windowWidth,
                                     chimeHangerThickness,
                                     {isStatic: true});

  worldBodies = worldBodies.concat(chimeModels);
  worldBodies.push(chimeHanger);
  // Add all of the Chimes to the world
  World.add(engine.world, worldBodies);

  // Control Wind for now using Slider
  windSlider = createSlider(0, 200, 0);
  windSlider.position(windowWidth - 100, windowHeight-30);
  windSlider.style('width', '80px');
}

function draw() {
  clear();

  // Blow Wind
  windy();
  Engine.update(engine, 1000 / 60);

  if(showVisuals){
    // Draw Hanger
    drawChimeHanger(0, chimeHangerY, windowWidth, chimeHangerThickness);

    // Draw Pretty Chimes by @elqueen
    for (i = 0; i< chimes.length ;i++){
      chimes[i].show();
      chimes[i].soundwave(showSound);
    }
  }

  if(showModel){
    drawModel()
  }
}

function drawChimeHanger(x,y,w,h) {
  push ();
  noStroke();
  fill("#854E2E");
  rect(x, y, w, h);
  pop();
}

function windy(){
  // Add wind force to every chime decreasing strength
  for (i = 0; i< chimes.length ;i++){
    Body.applyForce(chimes[i].chime,
                    {x:0,y:windowHeight-300},
                    {x:((windSlider.value())/1000)/(i+1),y:0});
  }
}

// For kicks!

function keyPressed() {
  if (keyCode == 87) {
    showSlider = !showSlider;
    showSlider ? windSlider.show() : windSlider.hide();
  }else if (keyCode == 77){
    showModel = !showModel;
  }else if (keyCode == 86){
    showModel = showVisuals;
    showVisuals = !showVisuals;
  }else if (keyCode == 32){
    if(showVisuals){
      showSound = !showSound;
    }
  }
}

function drawModel() {
  //Draw Physics Model
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
