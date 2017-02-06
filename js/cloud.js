/*
 *  The Beautiful Clouds that run in the background.
 *  Created and Animated by @olivialives
 */


function Cloud(h){

    // Cloud Position
    this.x = 0;
    this.y = h; // Height In the Sky for the top of Window

    //Speed and Scale of Cloud
    this.speed = random(.25, 1);
    this.scale = random(.1,1);

    //Colors for Parts of Cloud
    this.colorWhite = 'rgb(254, 255, 249)'; // Main Body of Cloud
    this.colorLtGrey = 'rgb(240, 240, 230)'; // Internal Shadows of Cloud
    this.colorDkGrey = 'rgb(230, 230, 220)'; // Shadow of Cloud

    // Add variety to clouds. A set of random offests
    this.xOffsets = [random(0, 30), random(0, 30), random(0, 30), random(0, 10)];
    this.yOffsets = [random(0, 30), random(0, 30), random(0, 30)];

    this.show = function(){
        // Get Current Position Draw Cloud

        push();

          translate(this.x - 500 * this.scale, this.y);
          scale(this.scale);

          beginShape();
            // Draw Shadow
            fill(this.colorDkGrey);
            noStroke();
            arc(25, 82, 50, 50, PI/2, 0, PIE); //left
            arc(150, 82, 50, 50, PI, PI/2, PIE); //right
            rect(20, 62, 130, 45);

            // Draw Main Cloud
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
        // Increment horizontal position by speed
        this.x = this.x + this.speed;
    }

    this.shouldDie = function(){
      // Are you really off the screen?
      return this.x > windowWidth + 500*this.scale
    }
}
