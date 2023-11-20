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

class Cube {
    constructor(translation) {
        this.points = []
        this.normals = [];
        this.translation = translation;
        this.cube();    
    }
    cube() {
        var rotation = generateRotationVec()
        this.quad( 1, 0, 3, 2, rotation);
        this.quad( 2, 3, 7, 6, rotation);
        this.quad( 3, 0, 4, 7, rotation);
        this.quad( 6, 5, 1, 2, rotation);
        this.quad( 4, 5, 6, 7, rotation);
        this.quad( 5, 4, 0, 1, rotation);
    }
    
    quad(a, b, c, d, rotation) {
        var t1 = subtract(vertices[b], vertices[a]);
        var t2 = subtract(vertices[c], vertices[a]);
        var normal = cross(t1, t2);
        normal = vec3(normal);
   
   
        this.points.push(vertices[a]);
        this.normals.push(normal);
        this.points.push(vertices[b]);
        this.normals.push(normal);
        this.points.push(vertices[c]);
        this.normals.push(normal);
        this.points.push(vertices[a]);
        this.normals.push(normal);
        this.points.push(vertices[c]);
        this.normals.push(normal);
        this.points.push(vertices[d]);
        this.normals.push(normal);
        this.rotation = rotation;
    }
}