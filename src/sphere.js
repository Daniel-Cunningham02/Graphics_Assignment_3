function triangle(a, b, c, points, normals, translations, rotations, rotation, tVec) {
    points.push(a);
    points.push(b);
    points.push(c);

    rotations.push(rotation)
    rotations.push(rotation)
    rotations.push(rotation)

    translations.push(tVec[0])
    translations.push(tVec[1])
    translations.push(tVec[2])

    // normals are vectors

    normals.push(vec4(a[0],a[1], a[2], 0.0));
    normals.push(vec4(b[0],b[1], b[2], 0.0));
    normals.push(vec4(c[0],c[1], c[2], 0.0));
}


function divideTriangle(a, b, c, count, points, normals, translations, rotations, rotation, tVec) {
   if ( count > 0 ) {

       var ab = mix( a, b, 0.5);
       var ac = mix( a, c, 0.5);
       var bc = mix( b, c, 0.5);

       ab = normalize(ab, true);
       ac = normalize(ac, true);
       bc = normalize(bc, true);

       divideTriangle( a, ab, ac, count - 1, points, normals, translations, rotations, rotation, tVec);
       divideTriangle( ab, b, bc, count - 1, points, normals, translations, rotations, rotation, tVec);
       divideTriangle( bc, c, ac, count - 1, points, normals, translations, rotations, rotation, tVec);
       divideTriangle( ab, bc, ac, count - 1, points, normals, translations, rotations, rotation, tVec);
   }
   else {
       triangle( a, b, c, points, normals, translations, rotations, rotation, tVec);
   }
}


function tetrahedron(a, b, c, d, n, points, normals, translations, rotations, tVec) {
    var randomRotation = Math.random()
    if(randomRotation < 0.34) {
        var rotation = vec3(1.0, 0.0, 0.0)
    } else if(randomRotation >= 0.34 && randomRotation < 0.67) {
        var rotation = vec3(0.0, 1.0, 0.0)
    } else {
        var rotation = vec3(0.0, 0.0, 1.0)
    }
    divideTriangle(a, b, c, n, points, normals, translations, rotations, rotation, tVec);
    divideTriangle(d, c, b, n, points, normals, translations, rotations, rotation, tVec);
    divideTriangle(a, d, b, n, points, normals, translations, rotations, rotation, tVec);
    divideTriangle(a, c, d, n, points, normals, translations, rotations, rotation, tVec);
}

