let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const moveSpeed = 0.1;

function setupControls(character) {
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'z':
                moveForward = true;
                break;
            case 's':
                moveBackward = true;
                break;
            case 'q':
                moveLeft = true;
                break;
            case 'd':
                moveRight = true;
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'z':
                moveForward = false;
                break;
            case 's':
                moveBackward = false;
                break;
            case 'q':
                moveLeft = false;
                break;
            case 'd':
                moveRight = false;
                break;
        }
    });
}

function updateControls(character, camera) {
    if (character) {
        const direction = new THREE.Vector3(); // Vecteur direction

        // Calculer la direction en fonction de la caméra
        camera.getWorldDirection(direction); // Récupérer la direction de la caméra
        direction.y = 0; // Ignorer la composante verticale
        direction.normalize(); // Normaliser le vecteur

        // Déplacement en avant et en arrière
        if (moveForward) {
            character.position.add(direction.clone().multiplyScalar(moveSpeed));
            character.lookAt(character.position.x + direction.x, character.position.y, character.position.z + direction.z); // Faire regarder le personnage vers l'avant
        }
        if (moveBackward) {
            character.position.add(direction.clone().multiplyScalar(-moveSpeed));
            character.lookAt(character.position.x + direction.x, character.position.y, character.position.z + direction.z); // Faire regarder le personnage vers l'arrière
        }

        // Déplacement à gauche et à droite
        const rightDirection = new THREE.Vector3(); // Vecteur direction droite
        camera.getWorldDirection(rightDirection);
        rightDirection.cross(new THREE.Vector3(0, 1, 0)); // Obtenir la direction à droite
        rightDirection.normalize(); // Normaliser le vecteur

        if (moveLeft) {
            character.position.add(rightDirection.clone().multiplyScalar(-moveSpeed));
            // Ne pas changer l'orientation du personnage ici
        }
        if (moveRight) {
            character.position.add(rightDirection.clone().multiplyScalar(moveSpeed));
            // Ne pas changer l'orientation du personnage ici
        }
    }
}
