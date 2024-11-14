let yaw = 0; // Rotation horizontale
let pitch = 0; // Rotation verticale
let pointerLocked = false; // État du verrouillage du pointeur

function setupMouseControls(camera) {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);

    // Tenter de verrouiller le pointeur lorsque l'utilisateur clique
    document.addEventListener('click', () => {
        document.body.requestPointerLock();
    });
}

function onPointerLockChange() {
    pointerLocked = document.pointerLockElement === document.body;
}

function onMouseMove(event) {
    if (pointerLocked) {
        yaw -= event.movementX * 0.002; // Rotation horizontale
        pitch -= event.movementY * 0.002; // Rotation verticale
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // Limiter la rotation
    }
}

function updateMouseControls(camera, character) {
    // Appliquer les rotations de la souris à la caméra
    camera.rotation.y = yaw; // Rotation horizontale
    camera.rotation.x = pitch; // Rotation verticale

    // Positionner la caméra derrière le personnage
    const distance = 5; // Distance entre la caméra et le personnage
    camera.position.x = character.position.x + distance * Math.sin(yaw);
    camera.position.z = character.position.z + distance * Math.cos(yaw);
    camera.position.y = character.position.y + 2; // Ajuster la hauteur de la caméra
}
