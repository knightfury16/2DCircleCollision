class CircleSimulation
{
  
  constructor(circles)
  {
    this.particles = circles;
  }
  
  
  handle_particle_collision(debug=false)
  {
    let possible_collision = this.find_possible_collision();
    
    if(debug)console.log("New Frame");

    for(let i = 0; i < possible_collision.length; i++)
      {
        let this_par = possible_collision[i][0];
        let other_par = possible_collision[i][1];
        if(debug)
        {

          console.log(this_par.num + " might collide with " + other_par.num);
        }

        let circle_dist = dist(this_par.pos.x,this_par.pos.y, 
                               other_par.pos.x,other_par.pos.y)
        if( circle_dist < this_par.r + other_par.r)
          {
            this.handle_static_collision(this_par,other_par,
                                         circle_dist);
            // console.log(this_par.num, other_par.num);
            this.get_response_velocity (this_par,other_par);
          
          }
      }
    
  }
  
  //one-Axis Sweep and prune algorithm implementation.
  find_possible_collision()
  {
    let axis_list = this.particles;
    let active_list = [];
    let possible_collision = [];
    
    axis_list.sort( (a,b) => a.get_left().x - b.get_left().x);
    if(false)
    {
      console.log("From axis_list");
      for(let i = 0; i < axis_list.length; i++)
        {
          console.log("x = " + axis_list[i].pos.x);
        }
    }

    for(let i = 0; i < axis_list.length; i++)
      {
        for(let j = 0; j < active_list.length; j++)
          {
            if(axis_list[i].get_left().x >        
               active_list[j].get_right().x)
              {
                active_list.splice(j,1);
                j --;
                // if(j < 0) j = 0;
              }
            else {
            possible_collision.push([active_list[j],axis_list[i]]);
            }
          }
        active_list.push(axis_list[i]);
      }
    // console.log(possible_collision);
    return possible_collision;
  
  }

  handle_static_collision(this_par,other_par,circle_dist)
  {
      let overlap_dist = 0.5 * ( (this_par.r + other_par.r) - circle_dist);
      let normal = p5.Vector.sub(this_par.pos,other_par.pos).normalize();

      normal.setMag(overlap_dist);

      this_par.pos.add(normal);
      other_par.pos.add(-normal);
  }
  
  get_response_velocity(this_par,other_par)
  {
    let normal = p5.Vector.sub(this_par.pos, other_par.pos).normalize();

    let tangent = createVector(-normal.y, normal.x);

    //step2 have the velocity represent by vector

    //step3 project the velocity onto normal and tangent vector

    let v1n = p5.Vector.dot(normal, this_par.vel);
    let v1t = p5.Vector.dot(tangent, this_par.vel);

    let v2n = p5.Vector.dot(normal, other_par.vel);
    let v2t = p5.Vector.dot(tangent, other_par.vel);

    //step 4 find tangential velocity after collision

    let v1t_a_ = v1t;

    let v2t_a_ = v2t;

    //step 5 find new normal velocity

    let v1n_a_ =
      (v1n * (this_par.mass - other_par.mass) + 2 * other_par.mass * v2n) /
      (this_par.mass + other_par.mass);
    
    let v2n_a_ =
      (v2n * (other_par.mass - this_par.mass) + 2 * this_par.mass * v1n) /
      (this_par.mass + other_par.mass);
    
    //step 6 convert normal and tangential vel into vector
    
    let v1n_a = p5.Vector.mult(normal,v1n_a_);
    let v1t_a = p5.Vector.mult(tangent,v1t_a_);
    
    let v2n_a = p5.Vector.mult(normal,v2n_a_);
    let v2t_a = p5.Vector.mult(tangent,v2t_a_);
    
    //step 7 Find final velocity by adding normal and tangential vel
    
    this_par.vel = p5.Vector.add(v1n_a,v1t_a);
    other_par.vel =p5.Vector.add(v2n_a,v2t_a);
    
  }
  
    

  
}