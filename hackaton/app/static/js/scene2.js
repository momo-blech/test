let scene, camera, renderer, character;
let mazeWalls = []; // Tableau pour stocker les murs de la pièce
let door; // Variable pour la porte

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Couleur d'arrière-plan

    // Configuration de la caméra pour voir toute la pièce
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10); // Position de la caméra pour bien voir la pièce

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Ajout de la lumière ambiante et directionnelle
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Utilisez `generateMaze` pour créer la pièce avec quatre murs autour des personnages
    mazeWalls = generateMaze(scene);

    // Charger le personnage (robot) et le placer au centre de la pièce
    loadCharacter(scene, (loadedCharacter) => {
        character = loadedCharacter;
        character.position.set(0, 0, 0); // Centré dans la pièce
        setupControls(character);
        setupCameraFollow(character);
        setupFairy(scene, character); // Assurez-vous que la fée est correctement configurée

        // Créer et positionner la porte dans le mur avant
        door = createDoor(); // Créer la porte en appelant createDoor()
        door.position.set(0, 2, 5); // Position de la porte dans le mur avant
        scene.add(door); // Ajouter la porte à la scène

        setupMouseControls(camera); // Initialiser les contrôles de la souris
        animate(); // Démarrer l'animation une fois les éléments chargés
    });
}

function animate() {
    requestAnimationFrame(animate);
    updateControls(character, camera); // Passer le personnage et la caméra à updateControls

    // Vérifiez les collisions et mettez à jour les contrôles de la souris
    if (character && Array.isArray(mazeWalls)) {
        updateMouseControls(camera, character);
    }

    updateCamera();
    updateFairy(character); // Met à jour la position de la fée
    renderer.render(scene, camera);
}

init();
