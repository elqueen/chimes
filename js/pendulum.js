function Pendulum(x_pos,y_pos,width,height){
    this.pos = createVector(x_pos,y_pos+chimeHangerThickness);
    this.w = width;
    this.h = height;

    this.pendulumModel = Composite.create();

    this.pendulum = Bodies.circle(this.pos.x, this.pos.y + this.h*.3, this.w*.5,{restitution:.5});
    this.bottomDeco = Bodies.circle(this.pos.x,
                                       this.pos.y+this.h*.9,
                                       this.w, {frictionAir:.002});
    Body.setMass(this.bottomDeco, 2);

    this.constraintTop = Constraint.create({
            bodyB: this.pendulum,
            pointA: { x: this.pos.x, y: this.pos.y },
            pointB: { x: 0, y: -this.w*.5 },
            stiffness:.8});

    this.constraintBottom = Constraint.create({
            bodyA: this.pendulum,
            bodyB: this.bottomDeco,
            pointA: { x: 0, y: this.w*.5},
            pointB: { x: 0, y: -this.w},
            stiffness: .8});

    Composite.add(this.pendulumModel,[this.pendulum,
                                       this.bottomDeco,
                                       this.constraintTop,
                                       this.constraintBottom]);

    this.show = function(){
        push();
        stroke('#45191B');
        strokeWeight(3);
        // Draw Contraints
        line(this.pos.x-7,this.pos.y-chimeHangerThickness,
             this.pos.x-5,this.pos.y);
        line(this.pos.x,this.pos.y-chimeHangerThickness,
             this.pos.x,this.pos.y);
        line(this.pos.x+7,this.pos.y-chimeHangerThickness,
             this.pos.x+5,this.pos.y);

        line(this.constraintTop.pointA.x,
             this.constraintTop.pointA.y,
             this.constraintTop.bodyB.position.x + this.constraintTop.pointB.x,
             this.constraintTop.bodyB.position.y + this.constraintTop.pointB.y);

        line(this.constraintBottom.bodyA.position.x + this.constraintBottom.pointA.x,
             this.constraintBottom.bodyA.position.y + this.constraintBottom.pointA.y,
             this.constraintBottom.bodyB.position.x + this.constraintBottom.pointB.x,
             this.constraintBottom.bodyB.position.y + this.constraintBottom.pointB.y);

        pop();

        push();
          noStroke();
          //Draw pendulumn
          fill('#541E21');
          ellipseMode(CENTER);
          ellipse(this.pendulum.position.x,this.pendulum.position.y,this.w,this.w);

          //Draw Deco
          fill("#854E2E");
          // rectMode(CENTER);
          imageMode(CENTER);
            push();
            translate(this.bottomDeco.position.x,this.bottomDeco.position.y);
            rotate(this.bottomDeco.angle);
            image(imgDeco, 0, 0, this.w*2, this.w*2);
            pop();
        pop();

        push();
          // Draw Little String Wrap around Deco
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
