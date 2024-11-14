let offset = new THREE.Vector3(0, 2, 5);

function setupCameraFollow(character) {
    // Cette fonction initialise les paramètres de suivi de la caméra
    if (character) {
        camera.position.set(
            character.position.x + offset.x,
            character.position.y + offset.y,
            character.position.z + offset.z
        );
        camera.lookAt(character.position);
    }
}

function updateCamera() {
    if (character) {
        // Mise à jour de la position de la caméra pour qu'elle suive le personnage
        camera.position.lerp(
            new THREE.Vector3(
                character.position.x + offset.x,
                character.position.y + offset.y,
                character.position.z + offset.z
            ),
            0.05
        );
        camera.lookAt(character.position);
    }
}
