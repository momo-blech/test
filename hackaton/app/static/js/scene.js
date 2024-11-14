let scene, camera, renderer, character;
let mazeWalls = []; // Tableau pour stocker les murs du labyrinthe
let door; // Déclarez la variable door ici

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5); // Position initiale de la caméra
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    loadCharacter(scene, (loadedCharacter) => {
        character = loadedCharacter;
        setupControls(character);
        setupCameraFollow(character);
        setupFairy(scene, character); // Assurez-vous que la fée est correctement configurée
        mazeWalls = generateMaze(scene, 10, 10); // Générer le labyrinthe et stocker les murs
        door = createDoor(scene, new THREE.Vector3(0, 1, -5), 'mas2.png'); // Créer une porte à une position donnée

        setupMouseControls(camera); // Initialiser les contrôles de la souris
        animate(); // Démarrer l'animation uniquement après que le personnage est chargé
});
}

function animate() {
    requestAnimationFrame(animate);
    updateControls(character, camera); // Passer le personnage et la caméra à updateControls

    // Vérifiez les collisions
    if (character && Array.isArray(mazeWalls)) { // Assurez-vous que mazeWalls est un tableau
         // Vérifiez les collisions avec la porte
        updateMouseControls(camera, character); // Mettre à jour les contrôles de la souris
    }

    updateCamera();
    updateFairy(character);
    renderer.render(scene, camera);
}

init();
