function Cloud(h){
    this.x = 0;
    this.y = h;
    this.speed = random(.25, 1);
    this.scale = random(.1,1);
    this.colorWhite = 'rgb(254, 255, 249)';
    this.colorLtGrey = 'rgb(240, 240, 230)';
    this.colorDkGrey = 'rgb(230, 230, 220)';
    this.xOffsets = [random(0, 30), random(0, 30), random(0, 30), random(0, 10)];
    this.yOffsets = [random(0, 30), random(0, 30), random(0, 30)];
    this.show = function(){
        push();
        translate(this.x - 500 * this.scale, this.y);
        scale(this.scale);
        beginShape();
        fill(this.colorDkGrey);
        noStroke();
        arc(25, 82, 50, 50, PI/2, 0, PIE); //left
        arc(150, 82, 50, 50, PI, PI/2, PIE); //right 
        rect(20, 62, 130, 45);
        fill(this.colorWhite);
        noStroke();
        ellipse(60,52, 65 + this.xOffsets[0],50 + this.yOffsets[0]); //left
        ellipse(90,30,67 + this.xOffsets[1],45 + this.yOffsets[1]); //center
        ellipse(120,49,63 + this.xOffsets[2],48 + this.yOffsets[2]); //right
        arc(25, 77, 50, 50, PI/2, 0, PIE); //left arc
        arc(150, 77, 50, 50, PI, PI/2, PIE); //right arc
        rect(20, 57, 130, 45);
    
    //grey internal shadow ellipses
        fill(this.colorLtGrey); 
        ellipse(70 + this.xOffsets[3], 62, 65, 50);
        ellipse(117 + this.xOffsets[3], 77, 55, 50);
    
    //white overlays for internal shadows
        fill(this.colorWhite);
        ellipse(70 + this.xOffsets[3], 70, 70, 50);
        ellipse(117 + this.xOffsets[3], 80, 55, 45); 

        endShape();
        pop();
    }

    this.move = function(){
        this.x = this.x + this.speed;
    }

    this.shouldDie = function(){
      return this.x > windowWidth + 500*this.scale
    }
}
