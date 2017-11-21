// Color class
class Color {
    // Color constructor
    constructor(r,g,b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    // Color change method
    change(r,g,b) { this.r = r; this.g = g; this.b = b;}
    // Color math methods
    add(c) { return new Color(this.r + c.r, this.g + c.g, this.b + c.b); }
    multiply(s) {return new Color(this.r * s, this.g * s, this.b * s); }
    modulate(c) {return new Color(this.r * c.r, this.g * c.g, this.b * c.b); }
}

// Color constant
Color.black = new Color(0, 0, 0);
Color.white = new Color(1, 1, 1);
Color.red = new Color(1, 0, 0);
Color.green = new Color(0, 1, 0);
Color.blue = new Color(0, 0, 1);

// Used to parse Json
function arrayToColor(array){
    return new Color(array[0],array[1],array[2]);
}