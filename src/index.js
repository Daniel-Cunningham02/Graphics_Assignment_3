"use strict";

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
    
    //create spheres
    tetrahedron(va, vb, vc, vd, subdivisions, points1, normals1, translations1, rotations1, vec3(-0.5, 0, 0.5));
    tetrahedron(va, vb, vc, vd, subdivisions, points1, normals1, translations1, rotations1, vec3(0.5, 0, 0.5));
    

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
    rotationMatrixLoc = gl.getUniformLocation(program, "rotationMatrix");
    translationMatrixLoc = gl.getUniformLocation(program, "translationMatrix");
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


    canvas.addEventListener('mousedown', (e) => {
        rebindBuffers();
        var x = -1 + ((2 * e.clientX)/canvas.width);
        var y = -1 + ((2 * (canvas.height - e.clientY))/canvas.height)
        tetrahedron(va, vb, vc, vd, subdivisions, points1, normals1, translations1, rotations1, vec3(x, y, 0))
    }, undefined, (error) => {
        console.error(error);
    });
    projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix );
    render();
}



function render() {
    setTimeout(() => {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        theta += 4
        for( var i=0; i<points1.length; i+=3) { 
            /*translationMatrix = translate(translations1[i], translations1[i+1], translations1[i+2])
            rotationMatrix = rotate(theta, rotations1[i])*/
        modelViewMatrix = lookAt(eye, at , up);
        modelViewMatrix = mult(modelViewMatrix, translate(translations1[i], translations1[i+1], translations1[i+2]))
        modelViewMatrix = mult(modelViewMatrix, rotate(theta, rotations1[i]))

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
           //gl.uniformMatrix4fv(rotationMatrixLoc, false, rotationMatrix);
            //gl.uniformMatrix4fv(translationMatrixLoc, false, translationMatrix)
            gl.drawArrays( gl.TRIANGLES, i, 3 );
        }
        

    window.requestAnimFrame(render)}, 25);
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