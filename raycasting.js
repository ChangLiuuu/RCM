// Part 1
function rayCast1(set, ray){
    var result = set.intersect(ray);
    if(result.geometry){
        return result.geometry.material.diffuse;
    }else
        return Color.black;
}
// Part 2
function rayCast2(set, ray, light){
    var result = set.intersect(ray);
    if(result.geometry){
        // Add shadows for extra credits
        var rayToLight = new Ray(result.position, light.location.subtract(result.position));
        var shadowResult = set.intersect(rayToLight);
        if(shadowResult.geometry && shadowOn){
            var color = result.geometry.material.ambient.modulate(light.ambient);
        } else{
            var color = result.geometry.material.blinnPhong(ray, result.position, result.normal, light);
        }
        return color;
    }else
        return Color.black;
}

function init(){

    // Get elements from HTML
    var renderSpheres = document.getElementById("renderSphere");
    var fixedLight = document.getElementById("fixedLight");
    var importLight = document.getElementById("importLight");
    var shadow = document.getElementById("shadow");

    console.log(renderSpheres.checked);
    console.log(fixedLight.checked);
    console.log(importLight.checked);
    console.log(shadow.checked);

    // Create set
    set = new GeometrySet();
    lights = [];
    shadowOn = false;

    if(renderSpheres.checked){
        // Read spheres
        var spheres = getInputSpheres();
        for (var i in spheres) {
            var temp = spheres[i];
            var sphere = new Sphere(new Vector(temp.x, temp.y, temp.z), temp.a, temp.b, temp.c);
            sphere.material = new Material(arrayToColor(temp.ambient), arrayToColor(temp.diffuse), arrayToColor(temp.specular), temp.n);
            set.add(sphere);
        }
    }


    if(fixedLight.checked){
        // Read original light
        var light1 = new Light(new Vector(-1, 3, -0.5), new Color(1, 1, 1), new Color(1, 1, 1), new Color(1, 1, 1));
        lights.push(light1);
    }

    if(importLight.checked){
        // Read extra lights
        var lightSet = getInputLights();
        for (var l in lightSet){
            var temp = lightSet[l];
            var light = new Light(new Vector(temp.x, temp.y, temp.z), arrayToColor(temp.ambient), arrayToColor(temp.diffuse), arrayToColor(temp.specular));
            lights.push(light);
        }
    }

    if(shadow.checked){
        shadowOn = true;
    }

    view = new View(new Vector(0.5, 0.5, -0.5), new Vector(0, 0, 1), new Vector(0, 1, 0));

    //console.log(lights);

}

var y;
var interval;
function render(){
    var canvas = document.getElementById("viewport");
    var ctx = canvas.getContext("2d");

    var w = canvas.attributes.width.value;
    var h = canvas.attributes.height.value;

    var sy = 1 - y / h;
    var i = 0;
    imgData = ctx.createImageData(w,1);
    var pixels = imgData.data;
    for(var x = 0; x < w; x++){
        var sx = x / w;
        var ray = view.generateRay(sx, sy);
        color = Color.black;
        // Part1 for no illumination
        if(lights.length == 0)
            color = color.add( rayCast1(set, ray) );
        else{
            // Part2 for Blinn Phong illumination
            for( var j in lights ){
                var light = lights[j];
                // Illuminate
                color = color.add( rayCast2(set, ray, light) );
            }
        }
        pixels[i++] = color.r * 255;
        pixels[i++] = color.g * 255;
        pixels[i++] = color.b * 255;
        pixels[i++] = 255;
    }
    ctx.putImageData(imgData, 0, y);
    if(y == h){
        interval = window.clearInterval(interval);
        imgData = ctx.getImageData(0, 0, w, h);
        ctx.putImageData(imgData, 0, 0);
    }
    y++;
}

function run(){
    y = 0;
    var width = 600;
    var height = 600;
    init();
    interval = self.setInterval("render()",0);
}

// get the input ellipsoids from the standard class URL
function getInputSpheres() {
    const INPUT_SPHERES_URL =
        "SpheresData.json";

    // load the ellipsoids file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_SPHERES_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log("Unable to open input ellipses file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response);
}

// get the input lights from the standard class URL
function getInputLights() {
    const INPUT_ELLIPSOIDS_URL =
        "lights.json";

    // load the lights file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_ELLIPSOIDS_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log("Unable to open input ellipses file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response);
}

