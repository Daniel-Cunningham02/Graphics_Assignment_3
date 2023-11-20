// Basic Variables
var canvas;
var gl;
var aspect;
var at = new vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var program, program2;
var createSphere = true;    

// Camera options

var near = 0.3
var far  = 10
var radius = 1.5
var fovy = 45.0
var eye = vec3(radius*Math.sin(theta)*Math.cos(theta), radius*Math.sin(theta)*Math.sin(theta), radius*Math.cos(theta));

// Lighting
var lightPosition = vec4(1, 1, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

// material
var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 0, 0.5, 1, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1 );
var materialShininess = 40.0;

// GLSL variables
var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var normalMatrix, normalMatrixLoc;

function generateRotationVec() {
    var randomRotation = Math.random()
    if(randomRotation < 0.34) {
        var rotation = vec3(1.0, 0.0, 0.0)
    } else if(randomRotation >= 0.34 && randomRotation < 0.67) {
        var rotation = vec3(0.0, 1.0, 0.0)
    } else {
        var rotation = vec3(0.0, 0.0, 1.0)
    }
    return rotation;
}