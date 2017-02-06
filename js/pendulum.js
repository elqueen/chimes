/*
 *  The Pendulum swings between chimes and hits the chime to make sound.
 *  Wind really effects the Bottom Decoration of the Pendulum
 */

function Pendulum(x_pos,y_pos,width,height){
    this.pos = createVector(x_pos,y_pos+chimeHangerThickness);
    this.w = width;
    this.h = height;

    // The Circle that Hits The Chime
    this.pendulum = Bodies.circle(this.pos.x, this.pos.y + this.h*.3, this.w*.5,{restitution:.5});

    // The Decoration at the Bottom
    this.bottomDeco = Bodies.circle(this.pos.x,
                                       this.pos.y+this.h*.9,
                                       this.w, {frictionAir:.002});

    // Add mass to the Decoration
    Body.setMass(this.bottomDeco, 2);

    // Constraint Between Chime Hanger and this.pendulum
    this.constraintTop = Constraint.create({
            bodyB: this.pendulum,
            pointA: { x: this.pos.x, y: this.pos.y }, // Not associated with a Body just static point
            pointB: { x: 0, y: -this.w*.5 }, // Offest from center of bodyB
            stiffness:.8});

    // Constraint Between this.pendulum and the Decoration
    this.constraintBottom = Constraint.create({
            bodyA: this.pendulum,
            bodyB: this.bottomDeco,
            pointA: { x: 0, y: this.w*.5}, // Offest from center of bodyA
            pointB: { x: 0, y: -this.w}, // Offest from center of bodyB
            stiffness: .8});

    // Group all bodies and constraints into a Composite
    this.pendulumModel = Composite.create();
    Composite.add(this.pendulumModel,[this.pendulum,
                                       this.bottomDeco,
                                       this.constraintTop,
                                       this.constraintBottom]);

    this.show = function(){

        // Reference the Physics Model and Draw the Pendulum

        push();
          stroke('#45191B');
          strokeWeight(3);

          // Draw String Wrapped Around Hanger
          line(this.pos.x-7,this.pos.y-chimeHangerThickness,
               this.pos.x-5,this.pos.y);
          line(this.pos.x,this.pos.y-chimeHangerThickness,
               this.pos.x,this.pos.y);
          line(this.pos.x+7,this.pos.y-chimeHangerThickness,
               this.pos.x+5,this.pos.y);

          // Draw Contraints
          line(this.constraintTop.pointA.x,
               this.constraintTop.pointA.y,
               this.constraintTop.bodyB.position.x + this.constraintTop.pointB.x,
               this.constraintTop.bodyB.position.y + this.constraintTop.pointB.y);

          line(this.constraintBottom.bodyA.position.x + this.constraintBottom.pointA.x,
               this.constraintBottom.bodyA.position.y + this.constraintBottom.pointA.y,
               this.constraintBottom.bodyB.position.x + this.constraintBottom.pointB.x,
               this.constraintBottom.bodyB.position.y + this.constraintBottom.pointB.y);
        pop();

        // Draw Main Part of Pendulum

        push();
          noStroke();
          //Draw pendulumn
          fill('#541E21');
          ellipseMode(CENTER);
          ellipse(this.pendulum.position.x,this.pendulum.position.y,this.w,this.w);

          //Draw Deco
          imageMode(CENTER); //Draw from CENTER
          push();
            translate(this.bottomDeco.position.x,this.bottomDeco.position.y);
            rotate(this.bottomDeco.angle);
            image(imgDeco, 0, 0, this.w*2, this.w*2);
          pop();
        pop();

        push();
          // Draw Little String Wrapping around Deco
          stroke('#45191B');
          strokeWeight(5);
          translate(this.bottomDeco.position.x,this.bottomDeco.position.y);
          line(this.constraintBottom.pointB.x,
               this.constraintBottom.pointB.y,
               this.constraintBottom.pointB.x,
               this.constraintBottom.pointB.y + 7);
        pop();
    }
}
