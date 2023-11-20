function cube(points, normals, translations, rotations, tVec) {
    var randomRotation = Math.random()
    if(randomRotation < 0.34) {
        var rotation = vec3(1.0, 0.0, 0.0)
    } else if(randomRotation >= 0.34 && randomRotation < 0.67) {
        var rotation = vec3(0.0, 1.0, 0.0)
    } else {
        var rotation = vec3(0.0, 0.0, 1.0)
    }
    quad( 1, 0, 3, 2, points, normals, translations, rotations, rotation, tVec);
    quad( 2, 3, 7, 6, points, normals, translations, rotations, rotation, tVec );
    quad( 3, 0, 4, 7, points, normals, translations, rotations, rotation, tVec);
    quad( 6, 5, 1, 2, points, normals, translations, rotations, rotation, tVec );
    quad( 4, 5, 6, 7, points, normals, translations, rotations, rotation, tVec );
    quad( 5, 4, 0, 1, points, normals, translations, rotations, rotation, tVec );
}

function quad(a, b, c, d, points, normals, translations, rotations, rotation, tVec) {

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[a]);
    var normal = cross(t1, t2);
    normal = vec3(normal);


    points.push(vertices[a]);
    normals.push(normal);
    points.push(vertices[b]);
    normals.push(normal);
    points.push(vertices[c]);
    normals.push(normal);
    points.push(vertices[a]);
    normals.push(normal);
    points.push(vertices[c]);
    normals.push(normal);
    points.push(vertices[d]);
    normals.push(normal);

    for(let i = 0; i < 6; i++) {
        rotations.push(rotation)
    }
    for(let i = 0; i < 2; i++) {
        translations.push(tVec[0])
        translations.push(tVec[1])
        translations.push(tVec[2])
    }
}