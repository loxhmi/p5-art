var img1;
var img2;
var img3;
var img4;
var img5;
var img6; 

var xspeed = 4;
var xpos = -500;

let font,
  fontsize = 40;

function preload() { 
  img1 = loadImage("galactic.jpg");
  img2 = loadImage("earth.png");
  img3 = loadImage("eyeball.png");
  img4 = loadImage("static.gif");
  img5 = loadImage("brain.png");
  img6 = loadImage("braintexture.jpg");
  font = loadFont("CCRobo.ttf");
}

// All the paths
let paths = [];
// Are we painting?
let painting = false;
// How long until the next circle
let next = 0;
// Where are we now and where were we?
let current;
let previous;

function setup() {
  createCanvas(1500,844, WEBGL);
  current = createVector(0,0);
  previous = createVector(0,0);
  
  textFont(font);
  textSize(fontsize);
  textAlign(CENTER, CENTER);
};

function draw() {
  background(200);
  image(img1,-750,-422);
  image(img2,xpos,200);
  image(img3,mouseX-725,mouseY-422);
  
  translate(-500, 0, 0);
  strokeWeight(0);
  texture(img4);
  push();
  rotateZ(frameCount * 0.1);
  rotateX(frameCount * 0.1);
  rotateY(frameCount * 0.1);
  sphere(60);
  pop();
  
  translate(700,-100,0);
  strokeWeight(1);
  texture(img6);
  push();
  rotateZ(frameCount * 0.01);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  sphere(150);
  pop();

  
  if (xpos > width-750) {
    xspeed = -4;
  }
  if (xpos < 0) {
    xspeed = 4;
  }
  xpos += xspeed;
  
   textAlign(CENTER);
  drawWords(width * 0.5);
  
  // If it's time for a new point
  if (millis() > next && painting) {

    // Grab mouse position      
    current.x = mouseX-930;
    current.y = mouseY-300;

    // New particle's force is based on mouse movement
    let force = p5.Vector.sub(current, previous);
    force.mult(0.05);

    // Add new particle
    paths[paths.length - 1].add(current, force);
    
    // Schedule next circle
    next = millis() + random(100);

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;
  }

  // Draw all paths
  for( let i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

// Start it up
function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX-930;
  previous.y = mouseY-300;
  paths.push(new Path());
}

// Stop
function mouseReleased() {
  painting = false;
}

// A Path is a list of particles
class Path {
  constructor() {
    this.particles = [];
    this.hue = random(100);
  }

  add(position, force) {
    // Add a new particle with a position, force, and hue
    this.particles.push(new Particle(position, force, this.hue));
  }
  
  // Display plath
  update() {  
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }  
  
  // Display plath
  display() {    
    // Loop through backwards
    for (let i = this.particles.length - 1; i >= 0; i--) {
      // If we shold remove it
      if (this.particles[i].lifespan <= 0) {
        this.particles.splice(i, 1);
      // Otherwise, display it
      } else {
        this.particles[i].display(this.particles[i+1]);
      }
    }
  
  }  
}

// Particles along the path
class Particle {
  constructor(position, force, hue) {
    this.position = createVector(position.x, position.y);
    this.velocity = createVector(force.x, force.y);
    this.drag = 0.95;
    this.lifespan = 255;
  }

  update() {
    // Move it
    this.position.add(this.velocity);
    // Slow it down
    this.velocity.mult(this.drag);
    // Fade it out
    this.lifespan--;
  }

  // Draw particle and connect it with a line
  // Draw a line to another
  display(other) {
    strokeWeight(2);
    stroke(235,255,147, this.lifespan);
    fill(235,255,147, this.lifespan/2);    
    ellipse(this.position.x,this.position.y, 8, 8);    
    // If we need to draw a line
    if (other) {
      line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
  }
}

function drawWords(x) {
  // The text() function needs three parameters:
  // the text to draw, the horizontal position,
  // and the vertical position
  fill(0);
  text('we are', x, 80);

  fill(65);
  text('all', x, 150);

  fill(190);
  text('made of', x, 220);

  fill(255);
  text('stars', x, 290);
}