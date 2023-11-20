const va = vec4(0.0, 0.0, -1.0, 1);
const vb = vec4(0.0, 0.942809, 0.333333, 1);
const vc = vec4(-0.816497, -0.471405, 0.333333, 1);
const vd = vec4(0.816497, -0.471405, 0.333333,  1);

var subdivisions = 4;

class Sphere { 
    constructor(translation) {
        this.points = []
        this.normals = []
        this.translation = translation;
        this.tetrahedron();
    }
    
    triangle(a, b, c, rotation) {
        this.points.push(a);
        this.points.push(b);
        this.points.push(c);
    
        // normals are vectors
        this.normals.push(vec4(a[0],a[1], a[2], 0.0));
        this.normals.push(vec4(b[0],b[1], b[2], 0.0));
        this.normals.push(vec4(c[0],c[1], c[2], 0.0));

        this.rotation = rotation;
    }
    
    divideTriangle(a, b, c, count, rotation) {
       if ( count > 0 ) {
           var ab = mix( a, b, 0.5);
           var ac = mix( a, c, 0.5);
           var bc = mix( b, c, 0.5);
    
           ab = normalize(ab, true);
           ac = normalize(ac, true);
           bc = normalize(bc, true);
    
           this.divideTriangle( a, ab, ac, count - 1, rotation);
           this.divideTriangle( ab, b, bc, count - 1, rotation);
           this.divideTriangle( bc, c, ac, count - 1, rotation);
           this.divideTriangle( ab, bc, ac, count - 1,rotation);
       }
       else {
           this.triangle( a, b, c, rotation,);
       }
    }
    
    
    tetrahedron() {
        var rotation = generateRotationVec()
        this.divideTriangle(va, vb, vc, subdivisions, rotation);
        this.divideTriangle(vd, vc, vb, subdivisions, rotation);
        this.divideTriangle(va, vd, vb, subdivisions, rotation);
        this.divideTriangle(va, vc, vd, subdivisions, rotation);
    }
}
