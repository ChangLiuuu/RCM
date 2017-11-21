
class Light {
    // Light constructor
    constructor(location, ambient, diffuse, specular) {
        this.location = location;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
    }
}

class Material {
    // Material constructor
    constructor(ambient, diffuse, specular, n){
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.n = n;
    }


    blinnPhong(ray, position, normal, light){
        light.direction = light.location.subtract(position).normalize();

        var NL = normal.dot(light.direction);
        var H = light.direction.subtract(ray.direction).normalize();
        var NH = normal.dot(H);

        var KaLa = this.ambient.modulate(light.ambient);
        var KdLdNL = this.diffuse.multiply(Math.max(NL, 0)).modulate(light.diffuse);
        var KsLsNH = this.specular.multiply(Math.pow(Math.max(NH, 0), this.n)).modulate(light.specular);
        //console.log(KaLa.add(KdLdNL).add(KsLsNH));
        return KaLa.add(KdLdNL).add(KsLsNH);
    }

}
