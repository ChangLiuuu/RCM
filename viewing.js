
class Ray {
    // Ray constructor
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction.normalize();
    }

    // Get corresponding point by t
    getPoint(t) { return this.origin.add(this.direction.multiply(t)); }
}


class View{
    // View constructor
    constructor(eye, front, up) {
        this.eye = eye;
        this.front = front.normalize();
        this.back = this.front.negate();
        this.refUp = up;
        this.right = this.back.cross(this.refUp).normalize();
        this.up = this.right.cross(this.back);
    }

    generateRay(x, y){
        //var r = this.right.multiply(x-this.eye.x);
        //var u = this.up.multiply(y-this.eye.y);
        //return new Ray(this.eye, this.front.add(r).add(u));
        return new Ray(this.eye, new Vector(x,y,0).subtract(this.eye));
    }

}
