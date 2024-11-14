let fairy;
let messageTimeout; // Variable pour stocker le timeout du message
let messageElement; // Élément DOM pour afficher le message

function createFairy() {
    // Création d'une fée simple en utilisant une sphère pour le corps
    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xffccff });
    fairy = new THREE.Mesh(geometry, material);
    fairy.castShadow = true;
    fairy.receiveShadow = true;

    return fairy;
}

function setupFairy(scene, character) {
    fairy = createFairy();
    scene.add(fairy);
}

function updateFairy(character) {
    if (fairy) {
        // Obtenez la direction vers laquelle le personnage est orienté
        const leftDirection = new THREE.Vector3(-1, 0, 0); // Utiliser -1 pour obtenir la gauche
        character.getWorldDirection(leftDirection);

        // Positionner la fée à gauche en fonction de la direction du personnage
        fairy.position.set(
            character.position.x - leftDirection.z, // Décalage de gauche sur l'axe z
            character.position.y + 2 + Math.sin(Date.now() * 0.002) * 0.5, // Mouvement de haut en bas
            character.position.z + leftDirection.x // Décalage de gauche sur l'axe x
        );
    }
}




function showMessage(message) {
    if (messageElement) {
        messageElement.textContent = message; // Mettre à jour le texte du message
        messageElement.style.display = 'block'; // Afficher le message

        // Masquer le message après 3 secondes
        clearTimeout(messageTimeout); // Effacer le timeout précédent si un message est déjà affiché
        messageTimeout = setTimeout(() => {
            messageElement.style.display = 'none'; // Masquer le message
        }, 3000);
    }
}

// Créer l'élément DOM pour le message
function setupMessageElement() {
    messageElement = document.createElement('div');
    messageElement.style.position = 'absolute';
    messageElement.style.top = '10px';
    messageElement.style.left = '10px';
    messageElement.style.color = 'white';
    messageElement.style.fontSize = '20px';
    messageElement.style.display = 'none'; // Initialement caché
    document.body.appendChild(messageElement);
}

// Appel de setupMessageElement pour créer l'élément du message
setupMessageElement();

// Ajouter l'écouteur d'événements pour la touche "E"
document.addEventListener('keydown', (event) => {
    if (event.key === 'e') {
        showMessage("Voici un message de la fée !");
    }
});