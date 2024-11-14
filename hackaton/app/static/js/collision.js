function checkCollision(character, mazeWalls, door) {
    const characterBox = new THREE.Box3().setFromObject(character); // Créez une boîte englobante autour du personnage

    // Vérifiez la collision avec chaque mur du labyrinthe
    for (let wall of mazeWalls) {
        const wallBox = new THREE.Box3().setFromObject(wall); // Créez une boîte englobante pour chaque mur
        if (characterBox.intersectsBox(wallBox)) {
            // Collision détectée, ajustez la position du personnage
            const intersection = characterBox.intersect(wallBox);
            if (intersection) {
                // Déplacer le personnage en arrière en fonction de l'intersection
                if (character.position.x < wall.position.x) {
                    character.position.x -= intersection.max.x - intersection.min.x;
                } else {
                    character.position.x += intersection.max.x - intersection.min.x;
                }
            }
        }
    }

    // Vérifiez la collision avec la porte
    const doorBox = new THREE.Box3().setFromObject(door); // Créez une boîte englobante pour la porte
    if (characterBox.intersectsBox(doorBox)) {
        // Collision détectée avec la porte, ajustez la position du personnage
        const intersection = characterBox.intersect(doorBox);
        if (intersection) {
            if (character.position.x < door.position.x) {
                character.position.x -= intersection.max.x - intersection.min.x;
            } else {
                character.position.x += intersection.max.x - intersection.min.x;
            }
        }
    }
}
