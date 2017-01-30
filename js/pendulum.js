function Pendulum(x_pos,y_pos,width,height){
    this.pos = createVector(x_pos,y_pos+chimeHangerThickness);
    this.w = width;
    this.h = height;

    this.pendulumModel = Composite.create();

    this.pendulum = Bodies.circle(this.pos.x, this.pos.y + this.h*.35, this.w*.37);
    this.bottomDeco = Bodies.rectangle(this.pos.x, this.pos.y+this.h*.8, this.w*.75, this.w*.75);

    this.constraintTop = Constraint.create({
            bodyB: this.pendulum,
            pointA: { x: this.pos.x, y: this.pos.y },
            stiffness: .8});

    this.constraintBottom = Constraint.create({
            bodyA: this.pendulum,
            bodyB: this.bottomDeco,
            pointB: { x: -1*((this.w/2)*.75), y: -1*((this.w/2)*.75)},
            stiffness: .8});

    Composite.add(this.pendulumModel,[this.pendulum,
                                       this.bottomDeco,
                                       this.constraintTop,
                                       this.constraintBottom]);

    this.show = function(){
        // NOTE: TEMPORARY
        push();
        stroke('#45191B');
        strokeWeight(3);
        // Draw Contraints
        line(this.pos.x,this.pos.y-chimeHangerThickness,this.pos.x,this.pos.y);
        line(this.pos.x,this.pos.y, this.pendulum.position.x,this.pendulum.position.y);
        line(this.pendulum.position.x,this.pendulum.position.y,this.bottomDeco.position.x,this.bottomDeco.position.y);
        noStroke();
        //Draw pendulumn
        fill('#541E21');
        ellipseMode(CENTER);
        ellipse(this.pendulum.position.x,this.pendulum.position.y,this.w*.75,this.w*.75);

        //Draw Deco
        push();
        fill("#854E2E");
        rectMode(CENTER);
        push()
        translate(this.bottomDeco.position.x,this.bottomDeco.position.y);
        rotate(PI/4);
        rect(0,0,this.w*.75, this.w*.75)
        pop();
        pop();
    }
}
