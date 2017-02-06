/*
 *  The Chime gets hit by pendulum and emits sound particles.
 */

function Chime(x_pos,y_pos,width,height,pitch){

  this.w = width;
  this.h = height;

  // Constraints
  this.constraintPos = createVector(x_pos,y_pos);
  this.constraintLen = 100;

  // Center Point of Chime
  this.pos = createVector(this.constraintPos.x,
                          this.constraintPos.y + this.h/2 + this.constraintLen-10);

  this.chimeHue = floor(random(0,360)); // Color of Sound Particles

  this.sound = false; // Should we play and show sound?
  this.chimeSound = pitch; // The audio file for chime

  // Colors for Gradient
  this.b1 = color('#AF653B');
  this.b2 = color('#C5753E');

  /* FOR PHYSICS MODEL */

  // Chime
  this.chime = Bodies.rectangle(this.pos.x, this.pos.y, this.w, this.h);

  // Constraints
  this.constraintLeft = Constraint.create({
          bodyB: this.chime,
          pointA: { x: this.constraintPos.x-(this.w/2)-20, y: this.constraintPos.y },
          pointB: { x: -1*(this.w/2), y: -1*((this.h/2)-10) },
          stiffness: .2,
          lenght: this.constraintLen });

  this.constraintRight = Constraint.create({
          bodyB: this.chime,
          pointA: { x: this.constraintPos.x+(this.w/2)+20, y: this.constraintPos.y },
          pointB: { x: (this.w/2), y: -1*((this.h/2)-10) },
          stiffness: .2,
          lenght: this.constraintLen });


  // Group Constraints and Bodies together
  this.chimeModel = Composite.create();
  Composite.add(this.chimeModel,[this.chime,this.constraintLeft,this.constraintRight]);

  /* FOR PHYSICS MODEL --- END*/

  this.show = function(){
      // Reference the Physics Model and Draw the Chime and Show Sound Particles
      this.showChimeBody();
      this.showChimeStrings();
      this.soundwave();
  }

  this.showChimeStrings = function() {
    // Reference the Physics Model and Draw the Constraints

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

      //Draw Straps
      var numberofWraps = 4;
      var wrapSpacing = 5;

      //Straps on the Left
      for(var i = 0; i < numberofWraps; i++){
        line(this.constraintLeft.pointA.x - wrapSpacing*i,
             this.constraintLeft.pointA.y,
             this.constraintLeft.pointA.x - wrapSpacing*i ,
             this.constraintLeft.pointA.y - chimeHangerThickness);
      }

      //Straps on the Right
      for(var i = 0; i < numberofWraps; i++){
        line(this.constraintRight.pointA.x + wrapSpacing*i,
             this.constraintRight.pointA.y,
             this.constraintRight.pointA.x + wrapSpacing*i,
             this.constraintRight.pointA.y - chimeHangerThickness);
      }
    pop();
  }

  this.showChimeBody = function() {
    // Reference the Physics Model and Draw the Chime

    push();

      translate (this.chime.position.x,this.chime.position.y); // Move to chimes current center position
      rotate(this.chime.angle) // Rotate by chimes current angle
      translate (-this.w/2,-this.h/2); // Move to left corner of chime

      noStroke();

      //basic chime body - top
      beginShape();
        setGradient(0, 0, this.w/2, this.h, this.b1, this.b2, X_AXIS);
        setGradient(this.w/2, 0, this.w/2, this.h, this.b2, this.b1, X_AXIS);
        vertex (0, 0);
        vertex (this.w, 0);
        vertex (this.w, this.h);
        vertex (0, this.h);
      endShape(CLOSE);

      // basic chime body - bottom
      push();
        beginShape();
          fill('#AF653B');
          stroke('#AF653B');
          strokeJoin(ROUND);
          strokeWeight(3);
          strokeCap(ROUND);
          vertex (this.w, this.h);
          vertex ((this.w -(this.w/4)) , this.h + this.w/4);
          vertex (this.w/4, this.h + this.w/4);
          vertex (0, this.h);
        endShape(CLOSE);
      pop();

      //chime top lip
      beginShape();
        setGradient(-10, -30, this.w/2 +10, 30, this.b1, this.b2, X_AXIS);
        setGradient(this.w/2, -30, this.w/2 +10, 30, this.b2, this.b1, X_AXIS);
        vertex (-10, -30);
        vertex (this.w + 10, -30);
        vertex (this.w + 10, 0);
        vertex (-10, 0);
      endShape(CLOSE);

      //chime lip shadow
      beginShape();
        fill("#703910");
        vertex ( -10, 2);
        vertex (this.w + 10, 2);
        vertex (this.w , 10);
        vertex (0, 10);
      endShape(CLOSE);

      // chime opening
      beginShape();
        fill('#541E21');
        vertex (7, (this.h + 30)/2);
        bezierVertex(15,
                     (this.h + 30)/2 - this.w/2,
                     this.w -15,
                     (this.h + 30)/2 - this.w/2,
                     this.w - 7,
                     (this.h + 30)/2);
        vertex (this.w - 7, this.h);
        vertex ((this.w -(this.w/4)) - 2, this.h + this.w/5);
        vertex ((this.w/4)+2, this.h + this.w/5);
        vertex (7, this.h);
        stroke('#944C16');
        strokeWeight(5);
      endShape(CLOSE);

    pop();
  }

  var soundParticles = []; // Array of current Sound Particles

  this.soundwave = function(){

    // Add and new Sound Particles

    push();

      // Move to Chimes Current Center
      translate (this.chime.position.x,this.chime.position.y);
      rotate(this.chime.angle);

      if(this.sound && soundParticles.length<25){
        // We should add Sound and we dont have too many yet.
        var numberofParticles = floor(random(1,5));
        for(var i = 0; i<numberofParticles; i++){
          soundParticles.push(new SoundParticle(this.chimeHue));
        }
      }

      /* NOTE: See Comment on interactiveWindChime.js Line 157 similar issue. */

      for(var i = soundParticles.length-1; i >=0; i--){
        soundParticles[i].show();
        soundParticles[i].update();
        if(soundParticles[i].shouldDie()){
          // Remove from Array of Sound Particles
          soundParticles.splice(i,1);
        }
      }

    pop();
  }
}

/*
 *  The SoundParticle cool little visual effect
 */

function SoundParticle(h){

    /* A single Particle that falls down and fades in and out */

    this.pos= createVector(random(-20,20),0);
    this.diameter = random(5,10);
    this.dy = random(1,3); //Falling Speed
    this.life = 400; // Distance before Removed
    this.hue = h; // Color of Particle

    this.show = function(){
      // Reference the Position and Draw Yourself

      push();

        colorMode(HSB);

        fill(this.hue,100,75,this.parabolicopacitiy(this.pos.y/this.life));
        noStroke();

        // Move left and right in sort of a sin wave
        var x = this.pos.x+sin(this.pos.y/40)*10;
        var y = this.pos.y;

        // Draw Particle
        ellipse(x,y, this.diameter, this.diameter);

      pop();
    }

    this.parabolicopacitiy = function(x){
      //increase to half-lifetime,decrease to death
      return 4*x-4*x*x;
    }

    this.update = function(){
      // Move down
      this.pos.y += this.dy;
    }

    this.shouldDie = function(){
      // Moved long enough time to remove
      return this.pos.y > this.life;
    }
  }
