/*
 *  This Controls Everything
 */


// For Physics Model
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;

// Global for the Physics Engine
var engine;

// Collections of Objects
var chimes = {}, // Chime Dictionary key: chime-id (from physics model) value: chime object
    pendulums = [],
    clouds = [];

// Collections of Physics Models
var chimeModels = [],
    pendulumModels = [],
    worldBodies = [];

// Chime Characteristics
var numberofChimes = 9; // Best if Odd number
var chimeWidth = 80;
var spaceAroundChime = chimeWidth + 25;
var largestChimeHeight; // Based on windowHeight
var reduceChimeHeight = 25;

// Chime Hanger Characteristics
var chimeHangerY = 50;
var chimeHangerThickness= 30;

// Chime Sounds
var chimeSound = [];

// Enumerations for setGradient
var Y_AXIS = 1;
var X_AXIS = 2;

// Images for Pendulum bottomDeco and Current Select Image
var imgDecos = [];
var imgDeco;

// Settings Panel
var settingsPane;

// Settings Panel Elements
var wind_indicator,
    model_indicator,
    sound_indicator,
    windSlider,
    settingsPaneToggle;

// Introduction Popup
var introPopup;

// Mouse Interaction with Physics Model
var mouse,
    mouseConstraint,
    mouseToPhysics = false; //Should Model Responed to Mouse?

// Hold Reference to Audio Input
var mic;

// Control Interaction
var startWind = true, // Apply Force
    showModel = false, // Show Physics Model
    showVisuals = true, // Show Skin
    showSound = true; // Play Sound and Show SoundParticles

// Bird and Rainbow easter egg
  var birdy;
  var prettyRainbow;
  var showRainbow = false;
  var a; 

function preload() {
  // Load Different Images for Pendulum bottomDeco
  imgDecos = [ loadImage('assets/RoundChimePendant-01.png'),
               loadImage('assets/RoundChimePendant-02.png'),
               loadImage('assets/RoundChimePendant-03.png'),
               loadImage('assets/RoundChimePendant-04.png')];

  // Load the Chime Sounds
  chimeSound = [loadSound('assets/chimeSound0.mp3'),
                loadSound('assets/chimeSound1.mp3'),
                loadSound('assets/chimeSound2.mp3'),
                loadSound('assets/chimeSound3.mp3'),
                loadSound('assets/chimeSound4.mp3')];
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Use the full browser window

  // Create Physics Engine
  engine = Engine.create();

  // Add event handler for collision detection
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

  // Add event handler for mouse events
  /* NOTE: Using startdrag and enddrag so we can have a reference to the body
     in the physics model that is being click by the mouse.*/
  Events.on(mouseConstraint, 'startdrag', mouseDown);
  Events.on(mouseConstraint, 'enddrag', mouseUp);

  var nextSound = 0; // What pitch in the array is next?

  // Location for the first chime
  var startingX = (windowWidth - (numberofChimes * spaceAroundChime))/2 - spaceAroundChime/2;

  // Set Default to the Last Image
  imgDeco = imgDecos[imgDecos.length - 1];

  // Create Chimes and Pendulums
  largestChimeHeight = floor(windowHeight*.66);

  for (i = 0; i< numberofChimes ;i++){
      // If even make a Chime if odd make a pendulum
      if(i%2 != 0){
        // It's A Pendulum
        startingX += ((spaceAroundChime))

        var pendulum = new Pendulum(startingX,
                              chimeHangerY,
                              chimeWidth,
                              largestChimeHeight*1.65 - (reduceChimeHeight*i));

        pendulums.push(pendulum); // Add entire object to collection
        pendulumModels.push(pendulum.pendulumModel); // Add just the physics model to collection

      }else{
        // Congratulations! It's A Chime
        startingX += ((spaceAroundChime))

        var chime = new Chime(startingX,
                              chimeHangerY+chimeHangerThickness,
                              chimeWidth,
                              largestChimeHeight - (reduceChimeHeight*i),
                              chimeSound[nextSound]);

        nextSound++; // Next time use the next sound

        chimes[chime.chime.id] = chime; /* Get chime id in Physics Model and
                                           associate that with the chime object,
                                           NECESSARY FOR EVENT HANDLING*/

        chimeModels.push(chime.chimeModel); // Add just the physics model to collection
      }
  }

  // Create a static body for the Chime Hanger at the Top of the World
  var chimeHanger = Bodies.rectangle(windowWidth/2,
                                     chimeHangerY + chimeHangerThickness/2,
                                     windowWidth,
                                     chimeHangerThickness,
                                     {isStatic: true});

  //Add all the Chime Composites to collection of bodies
  worldBodies = worldBodies.concat(chimeModels);

  //Add all the Pendulum Composites to collection of bodies
  worldBodies = worldBodies.concat(pendulumModels);

  //Add the Chime Hanger to the collection of bodies
  worldBodies.push(chimeHanger);

  // Add all of Bodies to the Physics World
  World.add(engine.world, worldBodies);

  // Add the MouseConstraints to the Physics World
  World.add(engine.world, MouseConstraint);

  // Add Clouds
  var startNumClouds = 10;
  for(var i = 0; i< startNumClouds; i++){
    c = new Cloud(random (0, windowHeight));
    c.x = random(0, windowWidth);
    clouds.push(c);
  }

  // Add DOM Elements to Make Popup and Settings Panel
  createIntroPoppup();
  createSettingsPane();

  //Create Button to Toggle Settings Panel
  createSettingsPaneToggle();

  //Create bird
  birdy = new Bird();

  //Create rainbow
  prettyRainbow = new Rainbow();

  // Start Mic Input
  mic = new p5.AudioIn();
  mic.start();

}

function draw() {
  clear();

  // Blow Wind
  if(startWind){
    windy();
  }

  // Advance Physics Model
  Engine.update(engine, 1000 / 60);

  if(showVisuals){

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

    // Draw Clouds
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

    // Draw Rainbow 
    if(showRainbow){
      prettyRainbow.show();
    } 

    // Draw Hanger
    drawChimeHanger(0, chimeHangerY, windowWidth, chimeHangerThickness);

    // Draw Bird shape
    birdy.show();

    // Draw Pretty Chimes by @elqueen
    Object.keys(chimes).forEach(function(key){
      chimes[key].show();
    });

    // Draw Pendulums
    for (i = 0; i< pendulums.length ;i++){
      pendulums[i].show();
    }
  }

  if(showModel){
    // We should draw the Physics Model
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
    // Apply force at distance to the chimes
    Body.applyForce(chimes[key].chime,
                    {x:0,y:windowHeight-300},
                    {x:windForce,y:0});
  });

  for (i = 0; i< pendulums.length ;i++){
    // Apply force scaled back to center of bottom Deco of each pendulum
    var decoration = pendulums[i].bottomDeco;
    Body.applyForce(decoration,
                    {x:decoration.position.x,y:decoration.position.y},
                    {x:windForce*.6,y:0});
  }
}

/*
 *  Event Handlers
 */

function keyPressed() {

  // Some Keyboard Input -- All this Functionality can be done in Setting Panel

  if (keyCode == 87) {
    /* HIT W */
    startWind = !startWind;

    //Update Settings Indicators
    if(startWind){
      wind_indicator.style("background", "green");
    }else{
      wind_indicator.style("background", "red");
    }
  }else if (keyCode == 77){
    /* HIT M */
    showModel = !showModel;
    showVisuals = !showModel;

    //Update Settings Indicators
    if(showModel){
      model_indicator.style("background", "green");
    }else{
      model_indicator.style("background", "red");
    }
  }else if (keyCode == 83){
    /* HIT S */
    showSound = !showSound;

    //Update Settings Indicators
    if(showSound){
      sound_indicator.style("background", "green");
    }else{
      sound_indicator.style("background", "red");
    }
  }
}

function startSound(event){
  // Collision! Make sound?
  if(showSound){
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];

      /* No Every Collision Should Make a Sound
      * Calculate Momentum to see if a Sound should be triggered
      */
      var bodyAVelocity = createVector(pair.bodyA.velocity.x,pair.bodyA.velocity.y);
      var bodyBVelocity = createVector(pair.bodyB.velocity.x,pair.bodyB.velocity.y);
      var bodyAMomentum = bodyAVelocity.mult(pair.bodyA.mass);
      var bodyBMomentum = bodyBVelocity.mult(pair.bodyB.mass);
      var relativeMomentum = p5.Vector.sub(bodyAMomentum,bodyBMomentum);

      var threshold = max(pair.bodyA.mass,pair.bodyB.mass)/10; // is this the best way?

      if(relativeMomentum.mag() > threshold){
        // Which body is a chime?
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
  // Stop making noise - Collision is Done
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
  // Click chime to make sound
  if(mouseToPhysics){
    var id = event.body.id;
    var body = chimes[id];
    if(body){
      body.sound = true;
      body.chimeSound.play();
    }
  }
}

function mouseUp(event) {
  // Stop making noise - Click is over
  if(mouseToPhysics){
    var id = event.body.id;
    var body = chimes[id];
    if(body){
      body.sound = false;
    }
  }
}

/* 
 * Rainbow
 */
  function mouseClicked() {
    var d = dist(mouseX, mouseY, windowWidth - 100, 50);
    if (d < 100) {
      showRainbow = true;
    }
  }

/*
 *  Functions used to Create Introduction Popup, Settings Panel, and Settings Panel Toggle
 */

function createIntroPoppup(){
  /* Create DOM Elements for the Introduction Popup */
   introPopup = createDiv('');
   introPopup.id("introPopup");
   introPopup.size(windowWidth/2,windowHeight/2);
   introPopup.position(windowWidth/2-windowWidth/4,windowHeight/2-windowHeight/4)

   // Add Header
   introPopup.child(createElement('h1','Oto 音'));

   // Add Tagline
   introPopup.child(createElement('h3', 'Bringing sound and joy to your browser'));

   // Add Instruction Text
   introPopup.child(createP('Help the wind make music! Blow into your microphone or click on the chimes.'));

   // Add Begin Button
   var button = createButton('Begin');
   button.mousePressed(function(event){
     introPopup.hide();
     event.stopPropagation(); //So it doesn't hit the chimes behind the popup
     mouseToPhysics = true; //OK, Now all clicks are for the physics model
   });

   introPopup.child(button);
}

function createSettingsPane(){
  /* Create DOM Elements for the Settings Panel */
  settingsPane = createDiv('');
  settingsPane.size(windowWidth*.27,windowHeight);
  settingsPane.style("background:rgba(33,33,33,.5);\
                      color: #FFFFFF; \
                      padding: 10px; \
                      transition: all 1s ease; \
                      font-family: Helvetica, Arial, sans-serif;");
  settingsPane.position(-settingsPane.width-20,0);

  // Add button that Closes Pane
  var closePane = createButton('');
  closePane.style("background:none; \
                   border:none; \
                   background-image : url('assets/close.png'); \
                   background-size:cover; \
                   background-repeat:no-repeat; \
                   float:right; \
                   cursor:pointer;");
  closePane.size(20,20)
  closePane.mousePressed(function(){
    settingsPane.position(-settingsPane.width-20,0);
    mouseToPhysics = true;//OK, Now all clicks are for the physics model
    settingsPaneToggle.show();
  });

  settingsPane.child(closePane); // Add as child

  /* NOTE: Why am I doing this you might ask? Well p5 Checkboxes have lables
  that are a seperate element. I'm going to make my own indicators.
  */

  // Toggle Wind
  var wind_p = createP('Wind')

  wind_indicator = createDiv('');
  wind_indicator.class("indicator");
  wind_indicator.style("background", "green");

  wind_button = createButton('Toggle Wind');
  wind_button.class("toggleButton");

  wind_button.mousePressed(function(){
    startWind = !startWind;
    if(startWind){
      wind_indicator.style("background", "green");
    }else{
      wind_indicator.style("background", "red");
    }
  });


  // Adjust Wind Strength
  var windStrength_p = createP('Wind Strength')

  windSlider = createSlider(100, 400, 300);
  windSlider.style('width', '100%');
  windSlider.style("cursor","pointer");

  // Add elements as children
  settingsPane.child(wind_p);
  settingsPane.child(wind_indicator);
  settingsPane.child(wind_button);
  settingsPane.child(windStrength_p);
  settingsPane.child(windSlider);

  // Toggle Physics Model Visuals
  var visual_p = createP('Visuals')

  model_indicator = createDiv('');
  model_indicator.class("indicator");
  model_indicator.style("background", "red");

  visual_button = createButton('Show Model');
  visual_button.class("toggleButton");

  visual_button.mousePressed(function(){
    showModel = !showModel;
    showVisuals =!showModel;

    if(showModel){
      model_indicator.style("background", "green");
    }else{
      model_indicator.style("background", "red");
    }
  });

  // Add elements as children
  settingsPane.child(visual_p);
  settingsPane.child(model_indicator);
  settingsPane.child(visual_button);

  // Toggle Sound Visuals and Audio
  var sound_p = createP('Sound');

  sound_indicator = createDiv('');
  sound_indicator.class("indicator");
  sound_indicator.style("background", "green");

  sound_button = createButton('Toggle Sound');
  sound_button.class("toggleButton");
  sound_button.mousePressed(function(){
    showSound = !showSound;
    if(showSound){
      sound_indicator.style("background", "green");
    }else{
      sound_indicator.style("background", "red");
    }
  });

  // Add elements as children
  settingsPane.child(sound_p);
  settingsPane.child(sound_indicator);
  settingsPane.child(sound_button);

  // Change imgDeco
  var deco_p = createP('Change Decoration');

  // Deco Change
  var decoButtonsDiv = createDiv('');
  decoButtonsDiv.id("decoButtonsDiv")

  for(var i = 0; i<imgDecos.length; i++){
    var button = createButton('');
    button.imageIndex = i;
    button.class("decoButton");

    index = i+1;//Image Number for File Name

    button.style("background-image", 'url("assets/RoundChimePendant-0'+ index +'.png")');
    button.mousePressed(function(){
      imgDeco = imgDecos[this.imageIndex];
    });

    decoButtonsDiv.child(button); //Add button as Child
  }

  // Add elements as children
  settingsPane.child(deco_p);
  settingsPane.child(decoButtonsDiv);

}

function createSettingsPaneToggle(){
  //Create Button to Toggle Settings Panel
  settingsPaneToggle = createButton('');

  settingsPaneToggle.style("background:none;\
                            border:none;\
                            background-image: url('assets/settings.png');\
                            background-size:cover;\
                            background-repeat:no-repeat;\
                            cursor:pointer");

  settingsPaneToggle.size(20, 20);
  settingsPaneToggle.position(0+10, windowHeight - settingsPaneToggle.height-10)

  settingsPaneToggle.mousePressed(function(){
    settingsPaneToggle.hide();
    mouseToPhysics = false;
    settingsPane.position(0,0);
  });
}

/* ------ Support Functions  -------*/

/*
 *  Used to Draw Physics Model
 *  Referenced Matter.js Documentation: https://github.com/liabru/matter-js/wiki/Rendering
 */

function drawModel() {
  //Draw Physics Model
  var bodies = Composite.allBodies(engine.world);
  var constraints = Composite.allConstraints(engine.world);

  for (var i = 0; i < constraints.length; i++) {
      var constraint = constraints[i];
      // Not all Constraints have a bodyA or a point A
      var x1 = 0;
      var y1 = 0;
      constraint.bodyA ? x1 += constraint.bodyA.position.x : x1 += 0;
      constraint.bodyA ? y1 += constraint.bodyA.position.y : y1 += 0;
      constraint.pointA ? x1 += constraint.pointA.x : x1 += 0 ;
      constraint.pointA ? y1 += constraint.pointA.y : y1 += 0;

      // Not all Constraints have a bodyB or a point B
      var x2 = 0;
      var y2 = 0;
      constraint.bodyB ? x2 += constraint.bodyB.position.x : x2 += 0;
      constraint.bodyB ? y2 += constraint.bodyB.position.y : y2 += 0;
      constraint.pointB ? x2 += constraint.pointB.x : x2 += 0;
      constraint.pointB ? y2 += constraint.pointB.y : y2 += 0;

      push();
        // Finally, Draw the Line!
        line(x1, y1,x2, y2);
      pop();
  }

  for (var i = 0; i < bodies.length; i++) {
      // Get a Bodies vertices and Draw!
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


/*
 *  Used to Draw Gradients -- Used in chimes.js. Placed here if others want to use it.
 *  Direct from P5.js Examples : http://p5js.org/examples/color-linear-gradient.html
 */

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
        //Edges should be thinner
        strokeWeight(2);
      }else{
        strokeWeight(3);
      }
      line(i, y, i, y+h);
    }
  }
  pop();
}
