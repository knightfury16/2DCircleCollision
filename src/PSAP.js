class SAP {
    constructor(circles) {
        this.createAxisList(circles);
        this.axisListX = [];
        this.axisListY = [];
        this.buildList(this.circlesSortedByX, 'x');
        this.buildList(this.circlesSortedByY, 'y');
        this.HPM = new HashPairManagement();
        // console.log(this.axisListX);
        // console.log(this.axisListY);
    }

    buildList(circles, axisName) {
        if (axisName === 'x') {
            for (let i = 0; i < circles.length; i++) {
                //Do something
                let minX = new EndPoint('x', true);
                let maxX = new EndPoint('x', false);
                minX.circle = maxX.circle = circles[i];
                this.axisListX.push(minX, maxX);
            }
        } else if (axisName === 'y') {
            for (let i = 0; i < circles.length; i++) {
                //Do something
                let minY = new EndPoint('y', true); //Because y-axis in p5 in inverted. So the up is actually min.
                let maxY = new EndPoint('y', false);
                minY.circle = maxY.circle = circles[i];
                this.axisListY.push(minY, maxY);
            }
        }
    }

    createAxisList(circles) {
        this.circlesSortedByX = circles.slice();
        this.circlesSortedByY = circles.slice();
    }


    handle_particle_collision() {
        this.sortAxis(this.axisListX, 'x');
        this.sortAxis(this.axisListY, 'y');
        // this.update_endpoints(this.axisListX, 'x');
        // this.update_endpoints(this.axisListY, 'y');
        // console.log(this.HPM.result().length);

        let possible_collision = this.HPM.result();

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

    update_endpoints(axis_list, axisName) {
        if (axisName == 'x') {
            for (let endpoint of axis_list) {
                if (endpoint.isMin) {
                    endpoint.value = endpoint.circle.get_left().x;
                } else {
                    endpoint.value = endpoint.circle.get_right().x;
                }
            }
        } else if (axisName == 'y') {
            for (let endpoint of axis_list) {
                if (endpoint.isMin) {
                    endpoint.value = endpoint.circle.get_up().y; //p5 y-asix is inverted.
                } else {
                    endpoint.value = endpoint.circle.get_down().y;
                }
            }
        }
    }

    //Main  loop
    sortAxis(axis, axisName) {


        // console.log("Entering sortAxis" + axisName);

        for (let i = 1; i < axis.length; i++) {
            //Do something
            let keyElement = axis[i];
            let key = keyElement.get_value();

            let j = i - 1;

            while (j >= 0 && axis[j].get_value() > key) {
                let swapper = axis[j];

                if (keyElement.isMin && !swapper.isMin) {
                    // console.log(keyElement.circle.num,swapper.circle.num);
                    let overlap = this.checkOverlap(keyElement.circle, swapper.circle);
                    if (overlap) {
                        this.HPM.addPair(keyElement.circle, swapper.circle);
                        // console.log(keyElement.circle.num + " overlapping with " + swapper.circle.num);
                    }
                }

                if (!keyElement.isMin && swapper.isMin) {
                    //remove
                    this.HPM.removePair(keyElement.circle, swapper.circle);
                    // console.log(keyElement.circle.num + " remove overlap with " + swapper.circle.num);
                }

                axis[j + 1] = swapper;
                j -= 1;

            }

            axis[j + 1] = keyElement;
        }


        // console.log("Exit");
    }

    checkOverlap(this_cir, other_circle) {
        // if (this_cir.get_right().x > other_circle.get_left().x) {
        //     console.log("this_cir right x = " + this_cir.get_right().x + " other_circle left x = " + other_circle.get_left().x);
        //     if (this_cir.get_down().y > other_circle.get_up().y) {
        //         console.log("this_cir down y = " + this_cir.get_down().y + " other_circle up y = " + other_circle.get_up().y);
        //         if (this_cir.get_up().y < other_circle.get_down().y) {
        //             console.log("this_cir up y = " + this_cir.get_up().y + " other_circle down y = " + other_circle.get_down().y);
        //             return true;
        //         }

        //     }
        // }
        // console.log("this_cir.get_right().x < other_circle.get_left().x" + this_cir.get_right().x, other_circle.get_left().x);
        return (this_cir.get_left().x < other_circle.get_right().x && this_cir.get_right().x > other_circle.get_left().x && this_cir.get_down().y > other_circle.get_up().y && this_cir.get_up().y < other_circle.get_down().y);
    }


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


class EndPoint {
    constructor(axis, isMin) {
        this.circle = null;
        // this.value = value;
        this.isMin = isMin;
        this.axis = axis;
    }

    get_value() {
        if (this.isMin) {
            if (this.axis == 'x') {
                return this.circle.get_left().x;
            } else {
                return this.circle.get_up().y;
            }
        } else {
            if (this.axis == 'x') {
                return this.circle.get_right().x;
            } else {
                return this.circle.get_down().y;
            }
        }
    }
}