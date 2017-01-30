function Pendulum(x_pos,y_pos,width,height){
    this.pos = createVector(x_pos,y_pos);
    this.w = width;
    this.h = height;

    this.pendulumModel = Composite.create();

    this.pendulum = Bodies.circle(this.pos.x, this.pos.y + this.h*.4, this.w/2);
    this.bottomDeco = Bodies.rectangle(this.pos.x, this.pos.y+this.h*.9, this.w*.75, this.w*.75);

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

    }
}
