class Circle
  {
    
    constructor(x,y,num ='',r=16)
    {
      this.pos = createVector(x,y);
      this.vel = p5.Vector.random2D().mult(2);
      this.r = r;
      this.num = num;
      this.mass = 1;
    }
    
    update()
    {
        this.pos.add(this.vel);
      
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
    
    get_left()
    {
      return createVector (this.pos.x - this.r,this.pos.y);
    }
    
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
      
      stroke(255);
      strokeWeight(2);
      fill(255,100);
      ellipse(this.pos.x,this.pos.y,this.r*2);
      
      
    }
    
    
    
    
  }