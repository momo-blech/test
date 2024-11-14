function generateMaze(scene) {
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const wallThickness = 0.5;
    const wallHeight = 3; // Hauteur des murs, ni trop haut ni trop bas
    const roomSize = 10; // Taille de la pièce pour entourer les personnages

    const walls = []; // Tableau pour stocker les murs

    // Mur de gauche
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, roomSize), wallMaterial);
    leftWall.position.set(-roomSize / 2, wallHeight / 2, 0);
    leftWall.castShadow = true;
    scene.add(leftWall);
    walls.push(leftWall);

    // Mur de droite
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, roomSize), wallMaterial);
    rightWall.position.set(roomSize / 2, wallHeight / 2, 0);
    rightWall.castShadow = true;
    scene.add(rightWall);
    walls.push(rightWall);

    // Mur de fond (arrière)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallHeight, wallThickness), wallMaterial);
    backWall.position.set(0, wallHeight / 2, -roomSize / 2);
    backWall.castShadow = true;
    scene.add(backWall);
    walls.push(backWall);

    // Mur avant (avec un espace pour la porte)
    const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(roomSize / 2 - 1, wallHeight, wallThickness), wallMaterial);
    frontWallLeft.position.set(-3, wallHeight / 2, roomSize / 2);
    frontWallLeft.castShadow = true;
    scene.add(frontWallLeft);
    walls.push(frontWallLeft);

    const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(roomSize / 2 - 1, wallHeight, wallThickness), wallMaterial);
    frontWallRight.position.set(3, wallHeight / 2, roomSize / 2);
    frontWallRight.castShadow = true;
    scene.add(frontWallRight);
    walls.push(frontWallRight);

    return walls;
}
