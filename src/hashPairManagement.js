class HashPairManagement {
    constructor() {
        this.pairs = {};
    }

    getHash(id1, id2) {
        return (id1 * 1640531513 + id2 * 2654435789);
    }

    addPair(this_circle, other_circle) {
        this.pairs[this.getHash(this_circle.num, other_circle.num)] = {
            obj1: this_circle,
            obj2: other_circle
        }
    }

    removePair(this_circle, other_circle) {
        delete this.pairs[this.getHash(this_circle.num, other_circle.num)];
        delete this.pairs[this.getHash(other_circle.num, this_circle.num)];
    }


    // let b = {
    //     1: {
    //         obj1: "Suhaib",
    //         obj2: "ahmed"
    //     },

    //     1493: {
    //         obj1: "Tahiya",
    //         obj2: "Khatum"
    //     }
    // }


    result() {
        let possible_collision = [];

        for (key in this.pairs) {
            possible_collision.push([this.pairs[key].obj1, this.pairs[key].obj2]);
        }

        return possible_collision;
    }
}