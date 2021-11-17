class PSAP {

    constructor(circles) {
        this.axisListX = [];
        this.axisListY = [];
        this.buildList(circles.slice(), 'x');
        this.buildList(circles.slice(), 'y');
        this.HPM = new HashPairManagement();
    }

    addBody(circle) {

        //Inserting the point of x-axis
        let minX = new EndPoint('x', true);
        let maxX = new EndPoint('x', false);
        minX.circle = maxX.circle = circle;
        this.axisListX.push(minX, maxX);

        //Inserting the point of y-axis
        let minY = new EndPoint('y', true);
        let maxY = new EndPoint('y', false);
        minY.circle = maxY.circle = circle;
        this.axisListY.push(minY, maxY);

    }

    buildList(circles, axisName) {
        if (axisName == 'x') {
            for (let i = 0; i < circles.length; i++) {
                let minX = new EndPoint('x', true);
                let maxX = new EndPoint('x', false);
                minX.circle = maxX.circle = circles[i];
                this.axisListX.push(minX, maxX);
            }

        } else if (axisName == 'y') {
            for (let i = 0; i < circles.length; i++) {
                let minY = new EndPoint('y', true);
                let maxY = new EndPoint('y', false);
                minY.circle = maxY.circle = circles[i];
                this.axisListY.push(minY, maxY);
            }
        }
    }


    handle_particle_collision(debug = false) {

        this.sortAxis(this.axisListX);
        this.sortAxis(this.axisListY);

        let possible_collision = this.HPM.result();

        for (key in possible_collision) {

            //destructuring the pair
            let this_circle = possible_collision[key].obj1;
            let other_circle = possible_collision[key].obj2;

            if (debug) {
                console.log(this_circle.num + " might collide with " + other_circle.num);
            }

            //Variable to check how many call it's made. call is global variable.
            call++;

            //Distance between the reported pairs.
            let circle_dist = dist(this_circle.pos.x, this_circle.pos.y, other_circle.pos.x, other_circle.pos.y)

            if (circle_dist < this_circle.r + other_circle.r) {


                //Separate the circles first
                this.handle_static_collision(this_circle, other_circle, circle_dist);

                //Apply the response velocity after collision.
                this.get_response_velocity(this_circle, other_circle);
            }
        }

    }


    //Making the pair while sorting(insertion sort),thats why its called persistent SAP
    sortAxis(axisList) {

        for (let i = 1; i < axisList.length; i++) {

            let keyElement = axisList[i];
            let key = keyElement.get_value();

            let j = i - 1;

            while (j >= 0 && axisList[j].get_value() > key) {

                let swapper = axisList[j];

                if (keyElement.isMin && !swapper.isMin) {

                    //Instead of raising a flag that in this axis they overlaped just check if they overlap in all axis.
                    //Otherwise the space complexity becomes O(n^2).If they overlap insert the pair.
                    if (this.checkOverlap(keyElement.circle, swapper.circle)) {
                        this.HPM.addPair(keyElement.circle, swapper.circle);
                    }
                }
                //If in one axis they are not overlaping there is no way they will collide. So just remove pair.
                //In fact just for removing we are sorting the both axis list. Because we are checking if they overlap in all
                //axis if they overlap in just one axis, so there is no need for sorting through other axis.So just
                // for removing pairs we are sorting all the axis list.
                if (!keyElement.isMin && swapper.isMin) {
                    this.HPM.removePair(keyElement.circle, swapper.circle);
                }

                axisList[j + 1] = swapper;
                j -= 1;

            }


            axisList[j + 1] = keyElement;
        }

    }


    checkOverlap(this_circle, other_circle) {
        return (
            this_circle.get_left().x <= other_circle.get_right().x &&
            this_circle.get_right().x >= other_circle.get_left().x &&
            this_circle.get_down().y >= other_circle.get_up().y &&
            this_circle.get_up().y <= other_circle.get_down().y
        )
    }


    //By the time program report the collision few frames have passed and by that time circles overlapped a bit.
    //This function physically push the two circle away to its contact point then the appropiate velocity is applied by the get_response_vel() function.
    handle_static_collision(this_circle, other_circle, circle_dist) {

        let overlap_dist = ((this_circle.r + other_circle.r) - circle_dist);
        let normal = p5.Vector.sub(this_circle.pos, other_circle.pos).normalize();

        //Multiplying with 0.5 cause will move the both circle half the overlapping distance.
        normal.setMag(0.5 * overlap_dist);
        this_circle.pos.add(normal);
        other_circle.pos.add(normal.mult(-1));
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
        this.isMin = isMin;
        this.axis = axis;
    }

    get_value() {
        if (this.isMin) {
            if (this.axis == 'x') {
                return this.circle.get_left().x;
            } else {
                return this.circle.get_up().y; //Because y-axis in p5 in inverted. So the up is actually min.
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