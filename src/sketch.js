//Declaring global variables
let debug = false;
// let debug = true;
let play = true;
let gravity;
let sm = false;
let bigBall;


let c = []; //For array of circle objects
let world;
let a;

const colors = [

  { r: 156, g: 0, b: 24 },
  { r: 252, g: 122, b: 0 },
  { r: 37, g: 7, b: 95 },
  { r: 9, g: 60, b: 64 },
  { r: 244, g: 5, b: 9 },
  { r: 254, g: 208, b: 1 },
  { r: 3, g: 0, b: 213 },
  { r: 0, g: 0, b: 0 },
  { r: 255, g: 102, b: 102 }
];


function setup() {

  let cnv = createCanvas(700, 500);

  utility.clickStop(cnv);
  utility.frameCount();
  gravity = createVector(0, 0.05)

  //Generating 10 random circle with radius 16
  generate_random_circle(500, 5);

  bigBall = new Circle(300, 100, '99', 50, colors[8], true);
  bigBall.mass = 50;
  // c[0] = new Circle(100,380,'1',50,colors[0],true);
  // c[1] = new Circle(300,380,'2',50,colors[0],true);
  // c[2] = new Circle(200,200,'3',50,colors[0],true);
  // c[3] = new Circle(100,100,'4',50,colors[0],true);
  // c[4] = new Circle(100,200,'5',50,colors[0],true);

  let playButton = createButton("Play");
  playButton.mouseClicked(() => {
    sm = true;
  });

  //Creating a CircleSimulation object and passing in the array of circle object.
  //This is where all the dynamics happen.
  world = new CircleSimulation(c);
  world.addBody(bigBall);

}


function draw() {

  background(0);



  // console.log(frameRate());

  world.handle_particle_collision(debug);
  // world.handle_particle_collision_brute(debug);

  if (!sm) {
    for (let i = 0; i < c.length; i++) {
      c[i].applyForce(gravity);
      c[i].update();
      c[i].show(debug);
    }
    bigBall.update();
    bigBall.show();
  } else if (sm) {
    gravity.set(0, -0.03);
    for (let i = 0; i < c.length; i++) {
      c[i].applyForce(gravity);
      c[i].update();
      c[i].show(debug);
    }
    bigBall.applyForce(createVector(0, 0.06));
    bigBall.update();
    bigBall.show();
  }

}

//Function to generate random circle without overlapping.
//Syntax generate_random_circle(number of circle, [Radius of all the circles]);


function generate_random_circle(number_of_circle, radius) {

  for (let i = 0; i < number_of_circle; i++) {

    let temp_r = radius;
    if (radius == 0) { temp_r = ceil(random(20, 35)); }

    //Creating a temp circle object to check if it overlaps with the existing circle object in the canvas.
    let cir = {
      x: random(32, width - 32),
      // y:random(32,height-32),
      y: random(150, height - 32),
      r: temp_r
    };

    let overlap = false;

    //Checking with the existing circles objects if it overlaps.
    for (let j = 0; j < c.length; j++) {
      let other = c[j];
      if (dist(cir.x, cir.y, other.pos.x, other.pos.y) < other.r + cir.r + 5) {
        i--;
        overlap = true;
        break;
      }
    }
    //If it does not overlap then add the temp circle to the circle objects
    if (!overlap) c.push(new Circle(cir.x, cir.y, i + 1, cir.r, colors[i % 8], true));
  }

}