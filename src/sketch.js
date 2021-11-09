
let debug = false;
let play = false;
let len = 10;

let c = [];
let world;

function setup() {
  createCanvas(600, 400);
  
  
  for(let i = 0; i < len; i++)
    {
      let cir ={
        x:random(32,width-32),
        y:random(32,height-32),
        r:16
      };
      
      let overlap = false;
      
      for(let j = 0; j < c.length; j++)
        {
          let other = c[j];
          if(dist(cir.x,cir.y,other.pos.x,other.pos.y) < other.r + cir.r + 5)
            {
              i--;
              overlap = true;
              break;
            }
        }
      if(!overlap)c.push(new Circle(cir.x,cir.y,i+1))
    }
  
  // c[0] = new Circle(350,100,'1');
  // c[1] = new Circle(50,200,'2');
  // c[2] = new Circle(200,200,'3');
  // c[3] = new Circle(65,300,'4',60);
  // c[4] = new Circle(310,200,'5');
  // c = new Circle(100,200);
  
  world = new CircleSimulation(c);
  
  // world.handle_particle_collision();
  
  
//   c.sort((a,b) => a.get_left().x - b.get_left().x);
  // console.log("From setup");
  // for(let i = 0; i < 5; i++)
  //   {
  //     console.log("x = " + c[i].pos.x);
  //   }
}

function mousePressed(){
  if(play){noLoop();play = false;}
  else{
    loop();
    play = true;
  }
}


function draw() {
  
  // translate(0,height);
  
  background(0);
  
  world.handle_particle_collision(debug);
  
  // c.show(debug);
  for(let i = 0; i < len; i++)
    {
      c[i].update();
      c[i].edges();
      c[i].show(debug);
    }
  
  
}
