function Pendulum(x_pos,y_pos,width,height){
    this.pos = createVector(x_pos,y_pos+chimeHangerThickness);
    this.w = width;
    this.h = height;

    this.pendulumModel = Composite.create();

    this.pendulum = Bodies.circle(this.pos.x, this.pos.y + this.h*.35, this.w*.5);
    this.bottomDeco = Bodies.circle(this.pos.x,
                                       this.pos.y+this.h*.9,
                                       this.w, {frictionAir:.002});
    Body.setMass(this.bottomDeco, 2);

    this.constraintTop = Constraint.create({
            bodyB: this.pendulum,
            pointA: { x: this.pos.x, y: this.pos.y },
            stiffness: .1});

    this.constraintBottom = Constraint.create({
            bodyA: this.pendulum,
            bodyB: this.bottomDeco,
            stiffness: 1});
    /*this.constraintInvisibleLeft = Constraint.create({
            bodyA: this.pendulum,
            bodyB: this.bottomDeco,
            pointA: { x: 0, y: 200 },
            pointB: { x: -10, y: -1*((sqrt(2*pow(this.w*1.5,2)))/2) + 10},
            stiffness: .5});
    this.constraintInvisibleRight = Constraint.create({
            bodyA: this.pendulum,
            bodyB: this.bottomDeco,
            pointA: { x: 0, y: 200 },
            pointB: { x: 10, y: -1*((sqrt(2*pow(this.w*1.5,2)))/2) + 10},
            stiffness: .5});*/

    Composite.add(this.pendulumModel,[this.pendulum,
                                       this.bottomDeco,
                                       this.constraintTop,
                                       this.constraintBottom/*,
                                       this.constraintInvisibleLeft,
                                       this.constraintInvisibleRight*/]);

    this.show = function(){
        // NOTE: TEMPORARY
        push();
        stroke('#45191B');
        strokeWeight(3);
        // Draw Contraints
        line(this.pos.x,this.pos.y-chimeHangerThickness,this.pos.x,this.pos.y);
        line(this.pos.x,this.pos.y, this.pendulum.position.x,this.pendulum.position.y);
        line(this.pendulum.position.x,this.pendulum.position.y,
             this.bottomDeco.position.x,
             this.bottomDeco.position.y - this.w);
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
    }
}
