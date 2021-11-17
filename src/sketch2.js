let c = [];
// let debug = true;
let debug = false;
let world;
let gravity;
let start_time;
let call = 0;

let bigBall;

const colors = [
    { r: 156, g: 0, b: 24 },
    { r: 252, g: 122, b: 0 },
    { r: 37, g: 7, b: 95 },
    { r: 9, g: 60, b: 64 },
    { r: 244, g: 5, b: 9 },
    { r: 254, g: 208, b: 1 },
    { r: 3, g: 0, b: 213 },
    { r: 0, g: 0, b: 0 },
];


function setup() {

    start_time = millis();
    let cnv = createCanvas(700, 500);
    utility.clickStop(cnv);
    utility.frameCount();
    gravity = createVector(0, 0.06)

    generate_random_circle(300, 5);

    bigBall = new Circle(300, 100, '505', 50, colors[0], true);
    bigBall.mass = 50;

    //Chosse your algo
    world = new SAP(c);
    // world = new PSAP(c);

    world.addBody(bigBall);

}


function draw() {
    background(0);

    world.handle_particle_collision();


    if (millis() - start_time > 7000) {

        gravity.set(0, -0.05);
        for (let i = 0; i < c.length; i++) {
            c[i].applyForce(gravity);
            c[i].update();
            c[i].show(debug);
        }
        bigBall.applyForce(createVector(0, 0.15));
        bigBall.update();
        bigBall.show();

    } else {

        for (let i = 0; i < c.length; i++) {
            c[i].applyForce(gravity);
            c[i].update();
            c[i].show(debug);
        }
        bigBall.update();
        bigBall.show();
    }

    if (millis() - start_time > 35000) {
        console.log("Simulation stop.");
        noLoop();
    }
}


//Generate random Circles without overlapping.
function generate_random_circle(number_of_circle, radius) {

    for (let i = 0; i < number_of_circle; i++) {

        let temp_r = radius;
        if (radius == 0) {
            temp_r = ceil(random(20, 35));
        }

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


//For testing, ignore it.
// // For 600x600 grid
//     c[0] = new Circle(50, 50, '1', createVector(1, 1), 20, colors[0], false);
//     c[1] = new Circle(550, 50, '2', createVector(-1, 1), 20, colors[0], false);
//     c[2] = new Circle(50, 550, '3', createVector(1, -1), 20, colors[0], false);
//     c[3] = new Circle(550, 550, '4', createVector(-1, -1), 20, colors[0], false);
//     c[4] = new Circle(50, 300, '5', createVector(1, 0), 20, colors[0], false);
//     c[5] = new Circle(550, 300, '1', createVector(-1, 0), 20, colors[0], false);
//     c[6] = new Circle(300, 300, '2', createVector(-1, -1), 20, colors[0], false);
//     c[7] = new Circle(50, 200, '3', createVector(1, -1), 20, colors[0], false);
//     c[8] = new Circle(550, 200, '4', createVector(1, 1), 20, colors[0], false);