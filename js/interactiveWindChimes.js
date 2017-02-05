// Define any global variables here
// (BUT don't call any p5 methods here;
//  call them in the functions below!)

// For Physics
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;

var engine;
var chimes = {};
var pendulums = [];
var clouds = [];
var chimeModels = [];
var pendulumModels = [];
var windSlider;
var worldBodies = [];

// Chime Characteristics
var imgDeco;
var Y_AXIS = 1;
var X_AXIS = 2;
var numberofChimes = 9; // Best if Odd number
var chimeWidth = 80;
var spaceAroundChime = chimeWidth + 25;
var largestChimeHeight;
var reduceChimeHeight = 25;
var chimeHangerY = 50;
var chimeHangerThickness= 30;

// Chime Sounds
var chimeSound = [];

//For kicks
/*var showSlider = true; NOTE: For Testing*/
var mic;
var startWind = true;
var wind_indicator;
var showModel = false;
var model_indicator;
var showVisuals = true;
var showSound = true;
var sound_indicator;
var mouse;
var mouseConstraint;

var settingsPane;
var settingsPaneToggle;

function preload() {
  imgDeco = loadImage('assets/RoundChimePendant-04.png');

  // Load the Chime Sounds
  chimeSound = [
    loadSound('assets/chimeSound0.mp3'),
    loadSound('assets/chimeSound1.mp3'),
    loadSound('assets/chimeSound2.mp3'),
    loadSound('assets/chimeSound3.mp3'),
    loadSound('assets/chimeSound4.mp3')
  ]
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Use the full browser window

  // Create Physics Enginer
  engine = Engine.create();
  Events.on(engine, "collisionStart", startSound);
  Events.on(engine, "collisionEnd", endSound);

  // Add Mouse Controls
  mouse = Mouse.create();
  mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
              stiffness: 0.2,
              render: {
                    visible: false
                }
          }
      });

  Events.on(mouseConstraint, 'startdrag', mouseDown);
  Events.on(mouseConstraint, 'enddrag', mouseUp);

  var nextSound = 0;
  var startingX = (windowWidth - (numberofChimes * spaceAroundChime))/2 - spaceAroundChime/2;

  // Create Chimes
  largestChimeHeight = floor(windowHeight*.66);
  for (i = 0; i< numberofChimes ;i++){
      if(i%2 != 0){
        startingX += ((spaceAroundChime))
        var pendulum = new Pendulum(startingX,
                              chimeHangerY,
                              chimeWidth,
                              largestChimeHeight*1.65 - (reduceChimeHeight*i));
        pendulums.push(pendulum);
        pendulumModels.push(pendulum.pendulumModel);
      }else{
        startingX += ((spaceAroundChime))
        var chime = new Chime(startingX,
                              chimeHangerY+chimeHangerThickness,
                              chimeWidth,
                              largestChimeHeight - (reduceChimeHeight*i),
                              chimeSound[nextSound]);
        nextSound++;
        chimes[chime.chime.id] = chime;
        chimeModels.push(chime.chimeModel);
      }
  }

  var chimeHanger = Bodies.rectangle(windowWidth/2,
                                     chimeHangerY + chimeHangerThickness/2,
                                     windowWidth,
                                     chimeHangerThickness,
                                     {isStatic: true});

  worldBodies = worldBodies.concat(chimeModels);
  worldBodies = worldBodies.concat(pendulumModels);
  worldBodies.push(chimeHanger);
  // Add all of the Chimes to the world
  World.add(engine.world, worldBodies);
  World.add(engine.world, MouseConstraint);

  // Add Clouds
  var startNumClouds = 10;
  for(var i = 0; i< startNumClouds; i++){
    c = new Cloud(random (0, windowHeight));
    c.x = random(0, windowWidth);
    clouds.push(c);
  }

  mic = new p5.AudioIn();
  mic.start();

  createSettingsPane();

  settingsPaneToggle = createButton('');
  settingsPaneToggle.style("background","none");
  settingsPaneToggle.style("border","none");
  settingsPaneToggle.style("background-image", 'url("assets/settings.png")');
  settingsPaneToggle.style("background-size", "cover");
  settingsPaneToggle.style("background-repeat", "no-repeat");
  settingsPaneToggle.size(20, 20);
  settingsPaneToggle.position(0+10, windowHeight - settingsPaneToggle.height-10)
  settingsPaneToggle.mousePressed(function(){
    settingsPaneToggle.hide();
    settingsPane.position(0,0);
  });

}

function draw() {
  clear();

  // Blow Wind
  if(startWind){
    windy();
  }

  Engine.update(engine, 1000 / 60);

  if(showVisuals){
    // Draw Clouds

    /* NOTE: We learned something! There was an issue where clouds were flickering.
       Since we are splicing elements and looping, once we have removed the element
       we would skip an element in the array and that element wouldn't be drawn.
       After really thinking about what splice() does and doing some research
       (https://vimeo.com/141919523), I followed the recommendation of iterating
       through the loop backwards. When an element is removed, its okay, we just
       move on towards the start of the array we are headed that way already.

       Iterating Forward:

                              splice(1,1)    Ooops! [C] Not Drawn!
               [A][B][C][D]   [A][B][C][D]       [A][C][D]
           i =  0                 1                     2

        Iterating Backwards (start at length - 1):

                              splice(2,1)    No Skip! No Flicker!
              [A][B][C][D]   [A][B][C][D]       [A][B][D]
          i =           3           2               1

    */

    for(var i = clouds.length-1; i >=0; i--){
      clouds[i].show();
      clouds[i].move();
      if(clouds[i].shouldDie()){
        clouds.splice(i,1);
      }
    }

    // Add a Cloud?
    if(floor(frameCount%100) == 0 && clouds.length < 15){
      c = new Cloud(random (0, windowHeight));
      clouds.push(c);
    }

    // Draw Hanger
    drawChimeHanger(0, chimeHangerY, windowWidth, chimeHangerThickness);

    // Draw Pretty Chimes by @elqueen
    Object.keys(chimes).forEach(function(key){
      chimes[key].show();
    });


    for (i = 0; i< pendulums.length ;i++){
      pendulums[i].show();
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

  var windForce = mic.getLevel()/map(windSlider.value(),100,400,400,100);

  Object.keys(chimes).forEach(function(key){
    Body.applyForce(chimes[key].chime,
                    {x:0,y:windowHeight-300},
                    {x:windForce,y:0});
  });

  for (i = 0; i< pendulums.length ;i++){
    var decoration = pendulums[i].bottomDeco;

    Body.applyForce(decoration,
                    {x:decoration.position.x,y:decoration.position.y},
                    {x:windForce*.6,y:0});
  }
}

// For kicks!

function keyPressed() {
  if (keyCode == 87) {
    startWind = !startWind;
    if(startWind){
      wind_indicator.style("background", "#009150");
    }else{
      wind_indicator.style("background", "#e60026");
    }
  }else if (keyCode == 77){
    showModel = !showModel;
    showVisuals = !showModel;
    if(showModel){
      model_indicator.style("background", "#009150");
    }else{
      model_indicator.style("background", "#e60026");
    }
  }else if (keyCode == 83){
    showSound = !showSound;
    if(showSound){
      sound_indicator.style("background", "#009150");
    }else{
      sound_indicator.style("background", "#e60026");
    }
  }
}

function drawModel() {
  //Draw Physics Model
  var bodies = Composite.allBodies(engine.world);
  var constraints = Composite.allConstraints(engine.world);

  for (var i = 0; i < constraints.length; i++) {
      var constraint = constraints[i];

      var x1 = 0;
      var y1 = 0;
      constraint.bodyA ? x1 += constraint.bodyA.position.x : x1 += 0;
      constraint.bodyA ? y1 += constraint.bodyA.position.y : y1 += 0;
      constraint.pointA ? x1 += constraint.pointA.x : x1 += 0 ;
      constraint.pointA ? y1 += constraint.pointA.y : y1 += 0;

      var x2 = 0;
      var y2 = 0;
      constraint.bodyB ? x2 += constraint.bodyB.position.x : x2 += 0;
      constraint.bodyB ? y2 += constraint.bodyB.position.y : y2 += 0;
      constraint.pointB ? x2 += constraint.pointB.x : x2 += 0;
      constraint.pointB ? y2 += constraint.pointB.y : y2 += 0;

      push();
      line(x1, y1,x2, y2);
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

function startSound(event){
  if(showSound){
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];

      var bodyAVelocity = createVector(pair.bodyA.velocity.x,pair.bodyA.velocity.y);
      var bodyBVelocity = createVector(pair.bodyB.velocity.x,pair.bodyB.velocity.y);
      var bodyAMomentum = bodyAVelocity.mult(pair.bodyA.mass);
      var bodyBMomentum = bodyBVelocity.mult(pair.bodyB.mass);
      var relativeMomentum = p5.Vector.sub(bodyAMomentum,bodyBMomentum);

      var threshold = max(pair.bodyA.mass,pair.bodyB.mass)/10;

      if(relativeMomentum.mag() > threshold){
        if(chimes[pair.bodyA.id]){
          chimes[pair.bodyA.id].sound = true;
          chimes[pair.bodyA.id].chimeSound.play();
        }else if(chimes[pair.bodyB.id]){
          chimes[pair.bodyB.id].sound = true;
          chimes[pair.bodyB.id].chimeSound.play();
        }
     }
    }
  }
}

function endSound(event){
  var pairs = event.pairs;
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    if(chimes[pair.bodyA.id]){
      chimes[pair.bodyA.id].sound = false;
    }else if(chimes[pair.bodyB.id]){
      chimes[pair.bodyB.id].sound = false;
    }
  }
}

function mouseDown(event) {
  var id = event.body.id;
  var body = chimes[id];
  if(body){
    body.sound = true;
    body.chimeSound.play();
  }
}

function mouseUp(event) {
  var id = event.body.id;
  var body = chimes[id];
  if(body){
    body.sound = false;
  }
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  push();

  if (axis == Y_AXIS) {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }else if (axis == X_AXIS) {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      if(inter == 1 || inter == 0 ){
        strokeWeight(2);
      }else{
        strokeWeight(3);
      }
      line(i, y, i, y+h);
    }
  }
  pop();
}


function createSettingsPane(){

  settingsPane = createDiv('');
  settingsPane.position(-settingsPane.width,0);
  settingsPane.style("background", "rgba(33,33,33,.5)");
  settingsPane.style("padding", "10px");
  settingsPane.style("font-family", "Helvetica, Arial, sans-serif");
  settingsPane.style("color", "#FFFFFF");
  settingsPane.size(windowWidth*.27,windowHeight);
  settingsPane.style("transition", "all 1s ease");


  var closePane = createButton('');
  closePane.style("background","none");
  closePane.style("border","none");
  closePane.style("background-image", 'url("assets/close.png")');
  closePane.style("background-size", "cover");
  closePane.style("background-repeat", "no-repeat");
  closePane.style("float", "right");
  closePane.size(20,20)
  closePane.mousePressed(function(){
    settingsPane.position(-settingsPane.width,0);
    settingsPaneToggle.show();
  });

  // Control Wind for now using Slider
  var wind_p = createP('Wind')
  wind_p.style("font-weight", "bold");

  /* NOTE: Why am I doing this you might ask? Well p5 Checkboxes have lables
  that are a seperate element, they are place out side the div and instead of
  using selectors and moving the lable I'm going to make my own indicators.
  */

  wind_indicator = createDiv('');
  wind_indicator.style("background", "#009150");
  wind_indicator.style("border-radius", "5px");
  wind_indicator.style("margin-right", "5px");
  wind_indicator.style("display", "inline-block");
  wind_indicator.size(10,10);

  wind_button = createButton('Toggle Wind');

  wind_button.mousePressed(function(){
    startWind = !startWind;
    if(startWind){
      wind_indicator.style("background", "#009150");
    }else{
      wind_indicator.style("background", "#e60026");
    }
  });

  var windStrength_p = createP('Wind Strength')
  windStrength_p.style("font-weight", "bold");
  windSlider = createSlider(100, 400, 300);
  windSlider.style('width', '100%');

  var visual_p = createP('Visuals')
  visual_p.style("font-weight", "bold");

  model_indicator = createDiv('');
  model_indicator.style("background", "#e60026");
  model_indicator.style("border-radius", "5px");
  model_indicator.style("margin-right", "5px");
  model_indicator.style("display", "inline-block");
  model_indicator.size(10,10);

  visual_button = createButton('Show Model');
  visual_button.mousePressed(function(){
    showModel = !showModel;
    showVisuals =!showModel;

    if(showModel){
      model_indicator.style("background", "#009150");
    }else{
      model_indicator.style("background", "#e60026");
    }
  });

  var sound_p = createP('Sound');
  sound_p.style("font-weight", "bold");

  sound_indicator = createDiv('');
  sound_indicator.style("background", "#009150");
  sound_indicator.style("border-radius", "5px");
  sound_indicator.style("margin-right", "5px");
  sound_indicator.style("display", "inline-block");
  sound_indicator.size(10,10);

  sound_button = createButton('Toggle Sound');
  sound_button.mousePressed(function(){
    showSound = !showSound;
    if(showSound){
      sound_indicator.style("background", "#009150");
    }else{
      sound_indicator.style("background", "#e60026");
    }
  });


  settingsPane.child(closePane);

  settingsPane.child(wind_p);
  settingsPane.child(wind_indicator);
  settingsPane.child(wind_button);

  settingsPane.child(windStrength_p);
  settingsPane.child(windSlider);

  settingsPane.child(visual_p);
  settingsPane.child(model_indicator);
  settingsPane.child(visual_button);

  settingsPane.child(sound_p);
  settingsPane.child(sound_indicator);
  settingsPane.child(sound_button);

}
