class Circle
  {
    
    constructor(x,y,num ='', r=16, color , f = false)
    {
      this.pos = createVector(x,y);
      this.multiplier = 2;
      if(f)this.multiplier = 10;
      this.vel = p5.Vector.random2D().mult(this.multiplier);
      this.acc = createVector(0,0);
      this.r = r;
      this.num = num;
      this.mass = 1;
      this.friction = f;
      this.color = color;
    }
    
    update()
    {
        if(this.friction){this.vel.mult(0.991);}
        this.pos.add(this.vel);
        this.edges();
      
    }
    
    edges() {
    if (this.pos.y >= height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
    } else if (this.pos.y <= this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }

    if (this.pos.x >= width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
    } else if (this.pos.x <= this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    }
  }
    
    //For getting the left most point of the circle.
    get_left()
    {
      return createVector (this.pos.x - this.r,this.pos.y);
    }
    
    //For getting the right most point of the circle.
    get_right()
    {
      return createVector (this.pos.x + this.r,this.pos.y);
    }


    show(debug=false)
    {
      
      
      if(debug)
        {
          stroke(255);
          strokeWeight(1);
          textSize(22);
          text(this.num,this.pos.x - 8 ,this.pos.y + 10);
          let left = this.get_left();
          let right = this.get_right();
          line(left.x,left.y,left.x,0);
          line(right.x,right.y,right.x,0);
        }
      
      stroke(this.color.r,this.color.g,this.color.b);
      strokeWeight(1);
      fill(this.color.r,this.color.g,this.color.b,200);
      ellipse(this.pos.x,this.pos.y,this.r*2);
      
      
    }
    
    
    
  }