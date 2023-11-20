"use strict";

var objects1 = [];
var normals1 = [];
var points1 = [];

var objects2 = []
var normals2 = []
var points2 = []
var theta = 0;
var nBuffer, vBuffer;
var vNormal, vPosition;
var ctm;


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

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    
    var s = new Sphere(vec3(0.5, 0, 0))
    var s2 = new Sphere(vec3(-0.5, 0, 0));
    console.log(s);
    objects1.push(s);
    objects2.push(s2);

    bindArrays();
    //end of creating spheres
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
    gl.uniform4fv(gl.getUniformLocation(program,
       "lightPosition"), lightPosition );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );

    projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix );
    
    canvas.addEventListener('mousedown', (e) => {
        var x = 2 * e.clientX/canvas.width - 1;
        var y = 2 * (canvas.height - e.clientY)/ canvas.height - 1
        

        if (createSphere) {
            var temp = new Sphere(vec3(x, y, 0))
            console.log(temp)
            objects1.push(temp)
            console.log(objects1)
        }
        else {
            var temp = new Cube(vec3(x, y, 0))
            console.log(temp)
            objects1.push(temp)
            console.log(objects1)
        }
        bindArrays();
        console.log(points1);
    }, undefined, (error) => {
        console.error(error);
    });
    
    render();
}



function render() {
    setTimeout(() => {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        theta += 4
        var index = 0;
        drawSecondBuffer();
        for(const o of objects1) {
            modelViewMatrix = lookAt(eye, at, up);
            ctm = mult(translate(o.translation[0], o.translation[1], o.translation[2]), rotate(theta, o.rotation))
            ctm = mult(ctm, scale(0.1, 0.1, 0.1))
            modelViewMatrix = mult(modelViewMatrix, ctm)
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, modelViewMatrix );
            normalMatrix = mat3(
                modelViewMatrix[0], modelViewMatrix[1], modelViewMatrix[2],
                modelViewMatrix[4], modelViewMatrix[5], modelViewMatrix[6],
                modelViewMatrix[8], modelViewMatrix[9], modelViewMatrix[10]
            );
            gl.uniformMatrix3fv(normalMatrixLoc, false, normalMatrix);
            gl.drawArrays(gl.TRIANGLES, index, o.points.length);
            index += o.points.length    
        }
        
        window.requestAnimFrame(render)}, 25);
    }
    
function bindArrays() {
    points1 = []
    normals1 = [];
    for(let i = 0; i < objects1.length; i++) {
        for(const p of objects1[i].points) {
            points1.push(p);
        }
        
        for(const n of objects1[i].normals) {
            normals1.push(n)                
        }
    }   
}


function rebindBuffers() {
    nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals1), gl.STATIC_DRAW );

    vNormal = gl.getAttribLocation(program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points1), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}


function drawSecondBuffer() {
        bindProgram2();
        modelViewMatrix = lookAt(eye, at , up);
        modelViewMatrix = mult(modelViewMatrix, translate(objects2[0].translation[0], objects2[0].translation[1], objects2[0].translation[2]))
        modelViewMatrix = mult(modelViewMatrix, rotate(theta, objects2[0].rotation))
        modelViewMatrix = mult(modelViewMatrix, scale(0.1, 0.1, 0.1))

        normalMatrix = mat3(
            modelViewMatrix[0], modelViewMatrix[1], modelViewMatrix[2],
            modelViewMatrix[4], modelViewMatrix[5], modelViewMatrix[6],
            modelViewMatrix[8], modelViewMatrix[9], modelViewMatrix[10]
        );

            // normal matrix only really need if there is nonuniform scaling
            // it's here for generality but since there is
            // no scaling in this example we could just use modelView matrix in shaders

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, modelViewMatrix );
        gl.uniformMatrix3fv(normalMatrixLoc, false, normalMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, points2.length);
        bindProgram1()
        rebindBuffers();
}

function bindProgram1() {
    gl.useProgram(program);

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
    
    
    gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),ambientProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),diffuseProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"), specularProduct );
    gl.uniform4fv(gl.getUniformLocation(program,
       "lightPosition"), lightPosition );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );

    projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix );
}

function bindProgram2() {
    gl.useProgram(program2);
    points2 = []
    normals2 = []
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    modelViewMatrixLoc = gl.getUniformLocation( program2, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program2, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program2, "normalMatrix" );
    
    
    gl.uniform4fv( gl.getUniformLocation(program2,
       "ambientProduct"),ambientProduct );
    gl.uniform4fv( gl.getUniformLocation(program2,
       "diffuseProduct"),diffuseProduct );
    gl.uniform4fv( gl.getUniformLocation(program2,
       "specularProduct"), specularProduct );
    gl.uniform4fv(gl.getUniformLocation(program2,
       "lightPosition"), lightPosition );
    gl.uniform1f( gl.getUniformLocation(program2,
       "shininess"),materialShininess );

    projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix );

    for(const o of objects2) {
        for(let i = 0; i < o.normals.length; i++) {
            normals2.push(o.normals[i])
        }
        for(let i = 0; i < o.points.length; i++) {
            points2.push(o.points[i])
        }
    }

    nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals2), gl.STATIC_DRAW );

    vNormal = gl.getAttribLocation(program2, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points2), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation( program2, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

}

function changeShape() {
    createSphere = !createSphere
}