let c = [];
// let debug = true;
let debug = false;
let world;
let gravity;
let start_time;
let call = 0;


const colors = [{
    r: 156,
    g: 0,
    b: 24
}, {
    r: 252,
    g: 122,
    b: 0
}, {
    r: 37,
    g: 7,
    b: 95
}, {
    r: 9,
    g: 60,
    b: 64
}, {
    r: 244,
    g: 5,
    b: 9
}, {
    r: 254,
    g: 208,
    b: 1
}, {
    r: 3,
    g: 0,
    b: 213
}, {
    r: 0,
    g: 0,
    b: 0
}, {
    r: 255,
    g: 102,
    b: 102
}];


function setup() {

    start_time = millis();
    let cnv = createCanvas(1000, 600);
    utility.clickStop(cnv);
    utility.frameCount();
    gravity = createVector(0, 0.05)

    // frameRate(10);

    generate_random_circle(50, 20);

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

    // world = new CircleSimulation(c);
    world = new SAP(c);

    // world.handle_particle_collision();
}


function draw() {

    if (millis() - start_time > 30000) {
        console.log(millis() - start_time);
        console.log("called = " + call);
        play = false;
        noLoop();

    }
    background(0);

    world.handle_particle_collision();
    // world.handle_particle_collision_brute();

    for (let i = 0; i < c.length; i++) {
        //Do something
        c[i].applyForce(gravity);
        c[i].update();
        c[i].show(debug);
    }
}


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
            y: random(32, height - 32),
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