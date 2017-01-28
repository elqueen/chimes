// Define any global variables here
// (BUT don't call any p5 methods here;
//  call them in the functions below!)

function setup() {
  createCanvas(windowWidth, windowHeight); // Use the full browser window
  // Additional setup goes here
}

function draw() {
  // Put your drawing code here

  // create do-while loop for drawing 6 chimes
  var x = 0;
  var y1 = 385;
  var y2 = 400;
  var y3 = 200;
  var y4 = 180; 

  drawChimeHanger();
  for (var i = 0; i < 8; ++i) {
    y1 = y1 - 10;
    y2 = y2 - 10;
    y3 = y3 - 10;
    y4 = y4 - 10;
    x = x + 80;
    drawChimeBody (x, 50, y1, y2, y3, y4);
    drawChimeStrings (x, 50);
  }
}

// Define any additional helper functions here
function drawPendulum () {
  push();
  
  pop();
}

function drawChimeHanger() {
 push ();
 noStroke();
 fill("#854E2E");
 rect(0, 10, windowWidth, 30);
 pop();
}

function drawChimeStrings(x, y) {
  push();
  translate (x, y);
  stroke('#45191B');
  strokeWeight(3);
  line(10, 30, 0, -40);
  line(10, 30, 60, 30);
  line(60, 30, 65, -40);
  pop();
}
function drawChimeBody (x, y, y1, y2, y3, y4) {
  push();

  translate (x, y);
  noStroke();
  //basic chime body
  beginShape();
  fill("#CB6D23");
  vertex ( 5, 0);
  vertex (65, 0);
  vertex (65, 20);
  vertex (57, 25);
  vertex (60, 30);
  vertex (60, y1);
  vertex (50, y2);
  vertex (20, y2);
  vertex (10, y1);
  vertex (10, 30);
  vertex (13, 25);
  vertex ( 5, 20);
  endShape();
    //chime top 
  beginShape();
  fill("#E8A774");
  vertex ( 5, 0);
  vertex (65, 0);
  vertex (65, 20);
  vertex ( 5, 20);
  endShape();

  beginShape();
  fill("#854E2E");
  vertex ( 5, 20);
  vertex (65, 20);
  vertex (60, 30);
  vertex (10, 30);
  endShape();

  beginShape();
  fill("#854E2E");
  vertex (57, 25);
  vertex (60, 30);
  vertex (10, 30);
  vertex (13, 25);
  endShape();

  // chime opening
  beginShape();
  fill('#541E21');
  vertex (15, y3);
  bezierVertex(25, y4, 45, y4, 55, y3);
  vertex (55, y1);
  vertex (47, y2);
  vertex (23, y2);
  vertex (15, y1);
  stroke('#AA5719');
  strokeWeight(5);
  endShape(CLOSE);

  pop();
  
}
