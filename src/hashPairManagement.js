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


    result() {

        return this.pairs;
    }
}