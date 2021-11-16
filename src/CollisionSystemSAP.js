class CircleSimulation {

  constructor(circles) {
    this.particles = circles.slice();
  }

  addBody(circle) {
    this.particles.push(circle);
    // console.log(this.particles.length);
  }



  handle_particle_collision_brute() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        call++;
        let this_par = this.particles[i];
        let other_par = this.particles[j];
        let circle_dist = dist(this_par.pos.x, this_par.pos.y, other_par.pos.x, other_par.pos.y)
        if (circle_dist < this_par.r + other_par.r) {

          this.handle_static_collision(this_par, other_par, circle_dist);

          this.get_response_velocity(this_par, other_par);
        }

      }
    }
  }



  handle_particle_collision(debug = false) {
    //Calling the find_possible_collision function to get the pair of possible collisons.
    let possible_collision = this.find_possible_collision();

    if (debug) {
      console.log("New frame");
    }

    for (let i = 0; i < possible_collision.length; i++) {
      //destructuring the pair
      let this_circle = possible_collision[i][0];
      let other_circle = possible_collision[i][1];

      if (debug) {
        console.log(this_circle.num + " might collide with " + other_circle.num);
      }
      call++;

      //Distance between the reported pairs.
      let circle_dist = dist(this_circle.pos.x, this_circle.pos.y, other_circle.pos.x, other_circle.pos.y)

      if (circle_dist < this_circle.r + other_circle.r) {
        let temp = this.handle_static_collision(this_circle, other_circle, circle_dist);
        if (debug) console.log(temp);
        this.get_response_velocity(this_circle, other_circle);
      }
    }
  }



  //One-Axis Sweep and prune algorithm implementation.
  find_possible_collision() {

    let axis_list = this.particles;
    let active_list = [];
    let possible_collision = [];

    //Sorting by the x cordinate of the circle
    axis_list.sort((a, b) => a.get_left().x - b.get_left().x);


    for (let i = 0; i < axis_list.length; i++) {
      for (let j = 0; j < active_list.length; j++) {
        if (axis_list[i].get_left().x > active_list[j].get_right().x) {
          active_list.splice(j, 1);
          j--;
        } else {
          possible_collision.push([active_list[j], axis_list[i]]);
        }
      }
      active_list.push(axis_list[i]);
    }
    return possible_collision;
  }


  //By the time program report the collision few frames have passed and by that time circles overlapped a bit.
  //This function physically push the two circle away to its contact point then the appropiate velocity is applied by the get_response_vel() function.
  handle_static_collision(this_circle, other_circle, circle_dist) {
    let overlap_dist = ((this_circle.r + other_circle.r) - circle_dist);
    let normal = p5.Vector.sub(this_circle.pos, other_circle.pos).normalize();

    // normal.setMag(overlap_dist);
    // console.log(normal);

    // if(this_circle.get_left().x <= 0)
    // {
    //   // console.log(this_circle.num + normal);
    //   other_circle.pos.add(normal.mult(-1));
    //   return 1;
    // }
    // else if(other_circle.get_right().x >= width)
    // {
    //   this_circle.pos.add(normal)
    //   return 2;
    // }
    // else if(this_circle.pos.y + this_circle.r >= height )
    // {
    //   other_circle.pos.add(normal.mult(-1));
    //   // console.log(-normal);
    //   return 3;
    // }

    // else{
    // // else if(other_circle.get_right().x < width || other_circle.pos.y + other_circle.r < height){
    normal.setMag(0.5 * overlap_dist);
    this_circle.pos.add(normal);
    other_circle.pos.add(normal.mult(-1));
    return 4;
    // }
  }


  //Function to calculate velocity after collision.

  get_response_velocity(this_circle, other_circle) {

    let normal = p5.Vector.sub(this_circle.pos, other_circle.pos).normalize();

    let tangent = createVector(-normal.y, normal.x);

    //step2 have the velocity represent by vector

    //step3 project the velocity onto normal and tangent vector

    let v1n = p5.Vector.dot(normal, this_circle.vel);
    let v1t = p5.Vector.dot(tangent, this_circle.vel);

    let v2n = p5.Vector.dot(normal, other_circle.vel);
    let v2t = p5.Vector.dot(tangent, other_circle.vel);

    //step 4 find tangential velocity after collision

    let v1t_a_ = v1t;

    let v2t_a_ = v2t;

    //step 5 find new normal velocity

    let v1n_a_ =
      (v1n * (this_circle.mass - other_circle.mass) + 2 * other_circle.mass * v2n) /
      (this_circle.mass + other_circle.mass);

    let v2n_a_ =
      (v2n * (other_circle.mass - this_circle.mass) + 2 * this_circle.mass * v1n) /
      (this_circle.mass + other_circle.mass);

    //step 6 convert normal and tangential vel into vector

    let v1n_a = p5.Vector.mult(normal, v1n_a_);
    let v1t_a = p5.Vector.mult(tangent, v1t_a_);

    let v2n_a = p5.Vector.mult(normal, v2n_a_);
    let v2t_a = p5.Vector.mult(tangent, v2t_a_);

    //step 7 Find final velocity by adding normal and tangential vel

    // Adding the velocity directly to the circle object.
    this_circle.vel = p5.Vector.add(v1n_a, v1t_a);
    other_circle.vel = p5.Vector.add(v2n_a, v2t_a);

  }



}