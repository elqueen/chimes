function Rainbow() {
    this.startAngle = PI;
    this.endAngle = 0;
    this.x = windowWidth/2;
    this.y = windowHeight;
    this.w = windowWidth*1.25;
    this.h = windowHeight;
    this.opacity = 0;

    // this.rainbowFadeIn = function() {
    //   for (i = 0; i < 50; i++){
    //     opacity = i/100;
    //   }
    // };
    // this.fade = setInterval(this.rainbowFadeIn, 4000);

    // function rainbowFadeOut(a) {
    //   for (a = 99; a--){
    //     a/100;
    //   }
    // }

    this.show = function(fade){
        // Should we show the rainbow?
        if(fade){
          // Okay lets start Fading it in.
          if(this.opacity < .5)
            this.opacity += .01
        }else{
          // Nevermind lets start Fading it Out.
          if(this.opacity > 0)
            this.opacity -= .01
        }

        //Only Draw, when you can see it.
        if(this.opacity > 0){
          push();
            beginShape();
              colorMode(RGB, 255, 255, 255, 1);
              noFill();
              strokeWeight(100);
              stroke(255, 0, 0, this.opacity);
              arc(this.x, this.y, this.w, this.h, this.startAngle, this.endAngle);
              stroke(250, 200, 0, this.opacity);
              arc(this.x, this.y, this.w + 50, this.h + 50, this.startAngle, this.endAngle);
              stroke(240, 255, 102, this.opacity);
              arc(this.x, this.y, this.w + 100, this.h + 100, this.startAngle, this.endAngle);
              stroke(29, 255, 13, this.opacity);
              arc(this.x, this.y, this.w + 150, this.h + 150, this.startAngle, this.endAngle);
              stroke(122, 155, 255, this.opacity);
              arc(this.x, this.y, this.w + 200, this.h + 200, this.startAngle, this.endAngle);
            endShape();
          pop();
        }
    }
}
