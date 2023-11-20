// Buffer Variables

var nBuffer;
var vBuffer;

var vNormal, vPosition;


// Basic Variables
var canvas;
var gl;
var aspect;
var at = new vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var program, program2;
var subdivisions = 4;
var createSphere = true;    

// arrays for the first shader
var points1 = [];
var normals1 = [];
var rotations1 = [];
var translations1 = []

// arrays for the second shader
var points2 = [];
var normals2 = [];
var rotations2 = [];
var translations2 = []

var theta = 0.01
var phi = 0

// Constants for building the sphere
const va = vec4(0.0, 0.0, -1.0, 1);
const vb = vec4(0.0, 0.942809, 0.333333, 1);
const vc = vec4(-0.816497, -0.471405, 0.333333, 1);
const vd = vec4(0.816497, -0.471405, 0.333333, 1   );

// Constants for building the cube
const vertices = [
    vec4( -0.5, -0.5,  0.5, 1 ),
    vec4( -0.5,  0.5,  0.5, 1 ),
    vec4( 0.5,  0.5,  0.5, 1 ),
    vec4( 0.5, -0.5,  0.5, 1 ),
    vec4( -0.5, -0.5, -0.5, 1 ),
    vec4( -0.5,  0.5, -0.5, 1 ),
    vec4( 0.5,  0.5, -0.5, 1 ),
    vec4( 0.5, -0.5, -0.5, 1 )
];

// Camera options

var near = 0.3
var far  = 10
var radius = 1.5
var fovy = 45.0
const eye = vec3(radius*Math.sin(0)*Math.cos(0), radius*Math.sin(0)*Math.sin(0), radius*Math.cos(0));

// Lighting
var lightPosition = vec4(1, 1, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

// material
var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 0, 0.5, 1, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 40.0;

// GLSL variables
var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var normalMatrix, normalMatrixLoc;
var rotationMatrixLoc, rotationMatrix;
var translationMatrixLoc, translationMatrix;

