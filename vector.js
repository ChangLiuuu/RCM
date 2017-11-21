
class Vector{
    // Vector constructor
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Vector length
    length() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
    sqrLength() { return this.x * this.x + this.y * this.y + this.z * this.z; }

    // Vector normalization method
    normalize() { var inv = 1 / this.length(); return new Vector(this.x * inv, this.y * inv, this.z * inv); }
    negate() { return new Vector(-this.x, -this.y, -this.z); }

    // Vector basic math methods
    add(v) { return new Vector(this.x + v.x, this.y + v.y, this.z + v.z); }
    subtract(v) {return new Vector(this.x - v.x, this.y - v.y, this.z - v.z); }
    multiply(f) { return new Vector(this.x * f, this.y * f, this.z * f); }
    divide(f) {var invf = 1/f; return new Vector(this.x * f, this.y * f, this.z	* f); }

    // Vector dot and cross methods
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
    cross(v) {return new Vector(-this.z * v.y + this.y * v.z, this.z * v.x - this.x * v.z, -this.y * v.x + this.x * v.y); }
};

// Vector constants
Vector.zero = new Vector(0, 0, 0);

// Used to parse Json
function arrayToVector(array){
    return new Vector(array[0],array[1],array[2]);
}