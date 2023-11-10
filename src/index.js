"use strict";

var canvas;
var gl;

var numTimesToSubdivide = 4;

var index = 0;

var points1 = [];
var points2 = []
var normals1 = [];
var normals2 = [];

var currentShader;

var va = vec4(0.0, 0.0, -1.0, 4);
var vb = vec4(0.0, 0.942809, 0.333333, 4);
var vc = vec4(-0.816497, -0.471405, 0.333333, 4);
var vd = vec4(0.816497, -0.471405, 0.333333, 4);

var near = 0.3;
var far = 10;
var radius = 1.5;
var fovy = 45.0
var theta = 0.0;
var phi = 0.0

var lightPosition = vec4(1, 1, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 40.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var eye;
var aspect;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var program, program2;

function triangle(a, b, c, points, normals) {



     points.push(a);
     points.push(b);
     points.push(c);

     // normals are vectors

     normals.push(vec4(a[0],a[1], a[2], 0.0));
     normals.push(vec4(b[0],b[1], b[2], 0.0));
     normals.push(vec4(c[0],c[1], c[2], 0.0));

     index += 3;

}


function divideTriangle(a, b, c, count, points, normals) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1, points, normals );
        divideTriangle( ab, b, bc, count - 1, points, normals );
        divideTriangle( bc, c, ac, count - 1, points, normals );
        divideTriangle( ab, bc, ac, count - 1, points, normals );
    }
    else {
        triangle( a, b, c, points, normals);
    }
}


function tetrahedron(a, b, c, d, n, points, normals) {
    divideTriangle(a, b, c, n, points, normals);
    divideTriangle(d, c, b, n, points, normals);
    divideTriangle(a, d, b, n, points, normals);
    divideTriangle(a, c, d, n, points, normals);
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    aspect = canvas.width/canvas.height;
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    program2 = initShaders(gl, "vertex-shader2", "fragment-shader2");
    gl.useProgram( program );
    currentShader = program;

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);


    tetrahedron(va, vb, vc, vd, numTimesToSubdivide, points1, normals1);


    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals1), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation(program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points1), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),ambientProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),diffuseProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"), specularProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "lightPosition"), lightPosition );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );


    render();
}

function switchShaders() {
    if(currentShader === program) {
        currentShader = program2;
        switchShader();
    }
    else {
        currentShader = program;
        switchShader();
    }
}

function switchShader() {
    gl.useProgram(currentShader);
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals1), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation(program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points1), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( currentShader, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( currentShader, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( currentShader, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( currentShader, "normalMatrix" );

    gl.uniform4fv( gl.getUniformLocation(currentShader,
       "ambientProduct"),ambientProduct );
    gl.uniform4fv( gl.getUniformLocation(currentShader,
       "diffuseProduct"),diffuseProduct );
    gl.uniform4fv( gl.getUniformLocation(currentShader,
       "specularProduct"), specularProduct );
    gl.uniform4fv( gl.getUniformLocation(currentShader,
       "lightPosition"), lightPosition );
    gl.uniform1f( gl.getUniformLocation(currentShader,
       "shininess"),materialShininess );

}

function render() {
    setTimeout(() => {
    theta += 0.1 
    phi += 0.01

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    // normal matrix only really need if there is nonuniform scaling
    // it's here for generality but since there is
    // no scaling in this example we could just use modelView matrix in shaders

    normalMatrix = mat3(
        modelViewMatrix[0], modelViewMatrix[1], modelViewMatrix[2],
        modelViewMatrix[4], modelViewMatrix[5], modelViewMatrix[6],
        modelViewMatrix[8], modelViewMatrix[9], modelViewMatrix[10]
    );

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, modelViewMatrix );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix );
    gl.uniformMatrix3fv(normalMatrixLoc, false, normalMatrix );

    for( var i=0; i<points1.length; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    window.requestAnimFrame(render)}, 25);
}
