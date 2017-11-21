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
    var renderEllipsoid = document.getElementById("renderEllipsoid");
    var renderTriangle = document.getElementById("renderTriangle");
    var fixedLight = document.getElementById("fixedLight");
    var importLight = document.getElementById("importLight");
    var shadow = document.getElementById("shadow");

    console.log(renderEllipsoid.checked);
    console.log(renderTriangle.checked);
    console.log(fixedLight.checked);
    console.log(importLight.checked);
    console.log(shadow.checked);

    // Create set
    set = new GeometrySet();
    lights = [];
    shadowOn = false;

    if(renderEllipsoid.checked){
        // Read ellipsoids
        var ellipsoids = getInputEllipsoids();
        for (var i in ellipsoids){
            var temp = ellipsoids[i];
            var ellipsoid = new Ellipsoid(new Vector(temp.x, temp.y, temp.z), temp.a, temp.b, temp.c);
            ellipsoid.material = new Material(arrayToColor(temp.ambient), arrayToColor(temp.diffuse), arrayToColor(temp.specular), temp.n);
            set.add(ellipsoid);
        }
    }

    if(renderTriangle.checked){
        // Read triangles
        var vertices = [];
        var triangles = getInputTriangles();

        for( var v in triangles[1].vertices ){
            vertices.push(arrayToVector(triangles[1].vertices[v]));
        }

        var m = triangles[0].material;
        var triangleMaterial = new Material(arrayToColor(m.ambient), arrayToColor(m.diffuse), arrayToColor(m.specular), m.n);

        for( var t in triangles[2].triangles){
            var temp = triangles[2].triangles[t];
            // Assuming each triangle has same material!
            var triangle = new Triangle(vertices[temp[0]],vertices[temp[1]],vertices[temp[2]]);
            triangle.material = triangleMaterial;
            set.add(triangle);
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
function getInputEllipsoids() {
    const INPUT_ELLIPSOIDS_URL =
        "EllipseData.json";

    // load the ellipsoids file
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

// get the input triangless from the standard class URL
function getInputTriangles() {
    const INPUT_ELLIPSOIDS_URL =
        "https://ncsucgclass.github.io/prog1/triangles.json";

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
