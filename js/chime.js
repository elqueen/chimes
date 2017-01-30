// A Chime

function Chime(x_pos,y_pos,width,height){

  this.constraintPos = createVector(x_pos,y_pos);
  this.constraintLen = 100;
  this.w = width;
  this.h = height;
  this.pos = createVector(this.constraintPos.x,
                          this.constraintPos.y + this.h/2 + this.constraintLen-10);
  this.chimeHue = floor(random(0,360));

  this.chimeModel = Composite.create();

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

    //Draw Straps
    var numberofWraps = 4;
    var wrapSpacing = 5;

    for(var i = 0; i < numberofWraps; i++){
      line(this.constraintLeft.pointA.x - wrapSpacing*i,
           this.constraintLeft.pointA.y,
           this.constraintLeft.pointA.x - wrapSpacing*i ,
           this.constraintLeft.pointA.y - chimeHangerThickness);
    }

    for(var i = 0; i < numberofWraps; i++){
      line(this.constraintRight.pointA.x + wrapSpacing*i,
           this.constraintRight.pointA.y,
           this.constraintRight.pointA.x + wrapSpacing*i,
           this.constraintRight.pointA.y - chimeHangerThickness);
    }

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

  var soundParticles = [];

  this.soundwave = function(on){
    push();
    translate (this.chime.position.x,this.chime.position.y);
    rotate(this.chime.angle);
    if(on && floor(random(100))%9 == 0 && soundParticles.length<25){
      soundParticles.push(new SoundParticle(this.chimeHue));
    }
    for(var i = 0; i < soundParticles.length; i++){
      soundParticles[i].show();
      soundParticles[i].update();
      if(soundParticles[i].shouldDie()){
        soundParticles.splice(i,1);
      }
    }
    pop();
  }

  function SoundParticle(h){

      this.pos= createVector(random(-20,20),0);
      this.diameter = random(5,10);
      this.dy = random(1,3);
      this.life = 400;
      this.hue = h;

      this.show = function(){
        push();
        colorMode(HSB);
        fill(this.hue,100,75,this.parabolicopacitiy(this.pos.y/this.life));
        noStroke();
        var x = this.pos.x+sin(this.pos.y/40)*10;
        var y = this.pos.y;
        ellipse(x,y, this.diameter, this.diameter);
        pop();
      }

      this.parabolicopacitiy = function(x){
        //increase to half-lifetime,decrease to death
        return 4*x-4*pow(x,2);
      }

      this.update = function(){
        this.pos.y += this.dy;
      }

      this.shouldDie = function(){
        return this.pos.y > this.life;
      }

  }

}
