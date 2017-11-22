
class Intersection {
    // Intersection constructor
    constructor() {
        this.geometry = null;
        this.distance = 0;
        this.position = Vector.zero;
        this.normal = Vector.zero;
    }
}

// Constant representing no intersection
Intersection.none = new Intersection();

class Sphere {
    // Ellipsoid constructor
    constructor(center, a, b, c) {
        this.center = center;
        this.a = a;
        this.b = b;
        this.c = c;
    }

    // Find whether a Ellipsoid intersect with a ray
    intersect(ray){
        var pc = ray.origin.subtract(this.center);
        var p1 = new Vector(pc.x/this.a, pc.y/this.b, pc.z/this.c);
        var v1 = new Vector(ray.direction.x/this.a, ray.direction.y/this.b, ray.direction.z/this.c);

        // v1^2 * t^2 + 2 * v1·p1 + p1^2 - 1 = 0
        var a0 = v1.sqrLength();
        var b0 = 2 * p1.dot(v1);
        var c0 = p1.sqrLength()-1;

        // b^2 - 4ac
        var hasRoot = b0 * b0 - 4 * a0 * c0;
        //console.log(hasRoot);

        if(hasRoot >= 0){

            var root1 = (-b0 + Math.sqrt(hasRoot))/(2 * a0);
            var root2 = (-b0 - Math.sqrt(hasRoot))/(2 * a0); // closer one

            var result = new Intersection();
            result.geometry = this;
            result.distance = root2;
            //console.log(root2);

            if(result.distance < 0) return Intersection.none;

            result.position = ray.getPoint(result.distance);
            var dp = result.position.subtract(this.center);
            // N = ( (x-x0)/a^2, (y-y0)/b^2, (z-z0)/c^2 )
            result.normal = new Vector(dp.x/(this.a*this.a), dp.y/(this.b*this.b), dp.z/(this.c*this.c)).normalize();
            return result;
        }

        return Intersection.none;
    }

}


class Triangle {
    // Triangle constructor
    // a,b,c are vertices
    constructor(a, b, c) {
        this.a = a; // v0
        this.b = b; // v1
        this.c = c; // v2
        var ab = this.b.subtract(this.a);
        var ac = this.c.subtract(this.a);
        this.N = ab.cross(ac).normalize();
        this.D = this.N.dot(this.a);
    }

    intersect(ray){

        // check whether ray is parallel to triangle
        if(ray.direction.dot(this.N) == 0) return Intersection.none;

        var t = (this.D-(this.N.dot(ray.origin)))/this.N.dot(ray.direction);
        //console.log(t);
        if(t > 0){
            var result = new Intersection();
            result.geometry = this;
            result.distance = t;
            result.position = ray.getPoint(result.distance);

            var c;

            // ab
            var ab = this.b.subtract(this.a);
            var pa = result.position.subtract(this.a);
            c = ab.cross(pa);
            if (this.N.dot(c) < 0) return Intersection.none;

            // bc
            var bc = this.c.subtract(this.b);
            var pb = result.position.subtract(this.b);
            c = bc.cross(pb);
            if (this.N.dot(c) < 0) return Intersection.none;

            // ca
            var ca = this.a.subtract(this.c);
            var pc = result.position.subtract(this.c);
            c = ca.cross(pc);
            if (this.N.dot(c) < 0) return Intersection.none;

            result.normal = this.N;
            return result;
        }else return Intersection.none;
    }
}

class GeometrySet{
    // Triangle constructor
    constructor() {
        this.geometries = [];
    }

    add(geometry){
        this.geometries.push(geometry);
    }

    // Find the closer intersection
    intersect(ray){
        var minDistance = Infinity;
        var minResult = Intersection.none;
        for( var i in this.geometries){
            var result = this.geometries[i].intersect(ray);
            if(result.geometry && result.distance < minDistance){
                minDistance = result.distance;
                minResult = result;
            }
        }
        return minResult;
    }
}
