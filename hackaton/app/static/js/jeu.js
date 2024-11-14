let scene, camera, renderer, character, fairy, fairyDialog, door, mathDialog, doorMessage, robot;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let clock = new THREE.Clock(); // Pour gérer le temps dans l'animation de la fée
let pointerLocked = false;

let yaw = 0;  // Axe horizontal pour la rotation avec la souris
let pitch = 0;  // Axe vertical pour la rotation avec la souris
let doorOpened = false; // Pour savoir si la porte est ouverte
let nearDoor = false; // Pour détecter si on est proche de la porte
let mathQuestion = { operand1: 0, operand2: 0, operator: '', answer: 0 };
let walls = []; // Tableau pour stocker les murs
let wallsBoundingBoxes = []; // Tableau pour stocker les bounding boxes des murs
let characterBoundingBox = new THREE.Box3(); // La boîte englobante du personnage

let timerElement = document.getElementById('timeLeft');
let totalTime = 10; // Temps en secondes (10 minutes)
let interval; // Stocker l'intervalle du compte à rebours

const matrixSize = 20;
const matrix = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function startTimer() {
    interval = setInterval(updateTimer, 1000); // Appeler updateTimer toutes les secondes
}

// Fonction pour mettre à jour le chrono chaque seconde
function updateTimer() {
    if (totalTime > 0) {
        totalTime--;
        // Calculer les minutes et les secondes
        let minutes = Math.floor(totalTime / 60);
        let seconds = totalTime % 60;
        // Mettre à jour l'affichage du chrono
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    } else {
        // Temps écoulé, tout devient rouge et le joueur est bloqué
        clearInterval(interval);
        document.body.style.backgroundColor = 'red';  // Change la couleur de fond en rouge
        alert("Temps écoulé ! Vous êtes bloqué.");  // Message d'alerte lorsque le temps est écoulé
    }
}   

function init() {
    // Création de la scène
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Ciel bleu

    // Création de la caméra à la troisième personne (derrière le personnage)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5); // Position initiale de la caméra derrière le personnage

    // Création du renderer et ajout à la page
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;  // Activer les ombres
    document.body.appendChild(renderer.domElement);

    // Lumière ambiante plus forte pour éclairer toute la scène
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);  // Lumière ambiante augmentée
    scene.add(ambientLight);

    // Lumière directionnelle puissante
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);  // Intensité augmentée
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;  // Activer les ombres pour cette lumière
    scene.add(directionalLight);

    startTimer(); // Lancer le compte à rebours dès que l'interface est affichée

    // Charger le modèle GLTF pour remplacer le cube rouge
    const loader = new THREE.GLTFLoader();
    loader.load('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb', function (gltf) {
        robot = gltf.scene;
        robot.scale.set(0.5, 0.5, 0.5);  // Ajuster l'échelle
        robot.position.set(9, 0, 5);     // Positionner le robot dans la scène
        robot.traverse(function(node) {
            if (node.isMesh) {
                node.castShadow = true;  // Activer les ombres pour le modèle
                node.receiveShadow = true;
            }
        });
        scene.add(robot);
        character = robot; // Remplacer le cube par le robot comme "character"
        console.log("GLTF model loaded successfully");
    }, undefined, function (error) {
        console.error('An error occurred while loading the GLTF model:', error);
    });

    // Création d'un quadrillage pour le sol
    const gridHelper = new THREE.GridHelper(500, 50);
    scene.add(gridHelper);

    // Création de la fée (sphère lumineuse)
    const fairyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const fairyMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00, emissive: 0xffff00 });
    fairy = new THREE.Mesh(fairyGeometry, fairyMaterial);
    scene.add(fairy);

    // Création de la porte (un cube)
    const doorGeometry = new THREE.BoxGeometry(2, 4, 0.1);
    const doorMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(10, 2, 18); // Positionner la porte plus loin
    scene.add(door);

    // Générer la carte
    generateMap(matrix);

    // Référence aux boîtes de dialogue HTML
    fairyDialog = document.getElementById('fairyDialog');
    mathDialog = document.getElementById('mathDialog');
    doorMessage = document.getElementById('doorMessage');

    // Générer l'opération mathématique
    generateMathQuestion();

    // Écouter les événements clavier pour déplacer le personnage
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Écouter les mouvements de la souris pour la caméra
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', requestPointerLock);

    // Événement pour détecter le changement de l'état du verrouillage du pointeur
    document.addEventListener('pointerlockchange', onPointerLockChange);

    // Animation
    animate();
}

function generateMap(matrix) {
    const cellSize = 1; // Taille d'une cellule pour le sol
    const wallHeight = 3; // Hauteur du mur
    const wallThickness = 0.1; // Épaisseur du mur

    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB });
    const contourWallMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Noir pour les murs de contour
    const interiorWallMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rouge pour les murs à l'intérieur

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 0) {
                // Créer un sol
                const floorGeometry = new THREE.PlaneGeometry(cellSize, cellSize);
                const floor = new THREE.Mesh(floorGeometry, floorMaterial);
                floor.rotation.x = -Math.PI / 2; 
                floor.position.set(i, 0, j);
                scene.add(floor);
            } else if (matrix[i][j] === 1) {
                // Créer un mur
                const wallGeometry = new THREE.BoxGeometry(cellSize, wallHeight, wallThickness); // Définir la géométrie ici

                let wallMaterial = contourWallMaterial; // Par défaut, couleur noir pour les contours

                // Si ce n'est pas un mur de contour, appliquer la couleur rouge pour l'intérieur
                if (i !== 0 && i !== matrix.length - 1 && j !== 0 && j !== matrix[i].length - 1) {
                    wallMaterial = interiorWallMaterial; // Rouge pour les murs à l'intérieur
                }

                const wall = new THREE.Mesh(wallGeometry, wallMaterial);

                // Positionner et orienter les murs
                if (i === 0 || i === matrix.length - 1) {
                    // Murs en haut et en bas
                    wall.rotation.y = Math.PI / 2; // Rotation pour que le mur soit orienté correctement
                } else if (j === 0 || j === matrix[i].length - 1) {
                    // Murs à gauche et à droite
                    wall.rotation.y = 0; // Aucun changement de rotation
                }

                wall.position.set(i, wallHeight / 2, j);
                scene.add(wall);
            }
        }
    }
}

function checkCollision() {
    for (let i = 0; i < wallsBoundingBoxes.length; i++) {
        if (characterBoundingBox.intersectsBox(wallsBoundingBoxes[i])) {
            return true; // Collision détectée
        }
    }
    return false; // Aucune collision
}

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);
    let prevPosition = character.position.clone(); // Sauvegarder la position avant de bouger

    // Gestion des mouvements du personnage par rapport à la direction de la caméra
    let moveSpeed = 0.2;

    // Calcul de la direction avant/arrière et gauche/droite par rapport à la caméra
    let forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    let right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

    if (moveForward) character.position.add(forward.multiplyScalar(moveSpeed));
    if (moveBackward) character.position.add(forward.multiplyScalar(-moveSpeed));
    if (moveLeft) character.position.add(right.multiplyScalar(-moveSpeed));
    if (moveRight) character.position.add(right.multiplyScalar(moveSpeed));
    characterBoundingBox.setFromObject(character);

    // Vérifier la collision
    if (checkCollision()) {
        character.position.copy(prevPosition); // Revenir à la position précédente si collision
    }
    // Mise à jour de la position de la caméra pour suivre le personnage
    let offsetX = 5 * Math.sin(yaw);
    let offsetZ = 5 * Math.cos(yaw);
    camera.position.set(character.position.x - offsetX, character.position.y + 2, character.position.z - offsetZ);
    camera.lookAt(character.position);

    // Animation de la fée
    let time = clock.getElapsedTime();
    fairy.position.x = character.position.x + 1;
    fairy.position.z = character.position.z;
    fairy.position.y = character.position.y + 2 + Math.sin(time * 2) * 0.5;

    // Suivre la position de la fée pour la boîte de dialogue
    updateFairyDialogPosition();

    // Vérifier la distance entre le personnage et la porte
    checkProximityToDoor();

    // Rendu de la scène
    renderer.render(scene, camera);
}

// Fonction pour déplacer la boîte de dialogue avec la fée
function updateFairyDialogPosition() {
    let fairyPosition = fairy.position.clone();
    fairyPosition.project(camera);  // Convertir la position 3D en position écran

    let x = (fairyPosition.x * 0.5 + 0.5) * window.innerWidth;
    let y = (-fairyPosition.y * 0.5 + 0.5) * window.innerHeight;

    fairyDialog.style.left = `${x}px`;
    fairyDialog.style.top = `${y}px`;
}

// Vérifier si le personnage est proche de la porte
function checkProximityToDoor() {
    let distanceToDoor = character.position.distanceTo(door.position);
    if (distanceToDoor < 3 && !doorOpened) { 
        doorMessage.style.display = 'block';
        updateDoorMessagePosition();
        nearDoor = true;
        console.log("Vous êtes proche de la porte.");
    } else {
        doorMessage.style.display = 'none';
        nearDoor = false;
    }
}

function showDoorActionMessage() {
    const doorActionMessage = document.getElementById('doorActionMessage');
    
    // Affiche le message
    doorActionMessage.style.display = 'block';

    // Cache le message après 2 secondes
    setTimeout(() => {
        doorActionMessage.style.display = 'none';
    }, 2000);
}

// Déplacer la boîte de message pour la porte
function updateDoorMessagePosition() {
    let doorPosition = door.position.clone();
    doorPosition.project(camera); // Convertir la position 3D en position écran

    let x = (doorPosition.x * 0.5 + 0.5) * window.innerWidth;
    let y = (-doorPosition.y * 0.5 + 0.5) * window.innerHeight;

    doorMessage.style.left = `${x}px`;
    doorMessage.style.top = `${y}px`;
}

// Gestion des touches appuyées
function onKeyDown(event) {
    switch (event.key) {
        case 'z': moveForward = true; break;
        case 's': moveBackward = true; break;
        case 'q': moveLeft = true; break;
        case 'd': moveRight = true; break;
        case 'e': showFairyMessage(); playFairySound(); break;
        case 'f': 
            if (nearDoor && !doorOpened) {
                if (mathDialog.style.display === 'block') {
                    mathDialog.style.display = 'none'; // Masquer la boîte de dialogue si elle est affichée
                } else {
                    showMathDialog(); // Affiche le problème mathématique
                    showDoorActionMessage(); // Affiche un message temporaire
                }
            } else if (!nearDoor) {
                console.log("Vous n'êtes pas assez proche de la porte.");
            }
            break; // Si proche de la porte, appuyer sur F
    }
}

function playFairySound() {
    const fairySound = document.getElementById('fairySound');
    fairySound.play();
}

// Gestion des touches relâchées
function onKeyUp(event) {
    switch (event.key) {
        case 'z': moveForward = false; break;
        case 's': moveBackward = false; break;
        case 'q': moveLeft = false; break;
        case 'd': moveRight = false; break;
    }
}

// Fonction pour afficher la boîte de dialogue de la fée
function showFairyMessage() {
    fairyDialog.style.display = 'block';
    setTimeout(() => {
        fairyDialog.style.display = 'none';
    }, 3000);
}

// Fonction pour afficher la boîte de dialogue pour l'opération mathématique
function showMathDialog() {
    // Afficher le problème de math sous forme d'équation
    const questionText = `${mathQuestion.operand1} ${mathQuestion.operator} ${mathQuestion.operand2} = ?`;
    
    // Remplir l'élément HTML avec la question mathématique
    document.getElementById('mathQuestion').textContent = questionText;
    
    // Afficher la boîte de dialogue pour l'utilisateur
    mathDialog.style.display = 'block';
    
    // Debugging pour s'assurer que l'élément est bien visible
    console.log("Affichage du problème mathématique :", questionText);
    console.log("Style d'affichage de la boîte de dialogue :", mathDialog.style.display);
}

// Fonction pour gérer la réponse de l'utilisateur
function submitAnswer() {
    let userAnswer = parseInt(document.getElementById('answerInput').value);
    if (userAnswer === mathQuestion.answer) {
        openDoor(); // Ouvrir la porte si la réponse est correcte
        mathDialog.style.display = 'none'; // Masquer la boîte de dialogue
        
        // Ajouter une redirection vers la page des missions après un court délai
        setTimeout(() => {
            window.location.href = "/missions"; // Remplacez "/missions" par l'URL correcte de la page des missions
        }, 1000); // Délai d'une seconde avant redirection
    } else {
        alert('Réponse incorrecte. Réessayez.');
    }
}

// Fonction pour ouvrir la porte
function openDoor() {
    door.position.y += 5; // La porte "monte" pour s'ouvrir
    doorOpened = true;
}

// Fonction pour générer une opération mathématique simple
function generateMathQuestion() {
    mathQuestion.operand1 = Math.floor(Math.random() * 10) + 1;
    mathQuestion.operand2 = Math.floor(Math.random() * 10) + 1;
    mathQuestion.operator = '+';
    mathQuestion.answer = mathQuestion.operand1 + mathQuestion.operand2;
}

// Fonction pour gérer les mouvements de la souris
function onMouseMove(event) {
    if (pointerLocked) {
        yaw -= event.movementX * 0.002;
        pitch -= event.movementY * 0.002;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    }
}

// Fonction pour demander le verrouillage du pointeur
function requestPointerLock() {
    if (!pointerLocked) {
        document.body.requestPointerLock();
    }
}

// Fonction appelée lors du changement d'état du verrouillage du pointeur
function onPointerLockChange() {
    pointerLocked = !!document.pointerLockElement;
}

// Redimensionner le canvas si la fenêtre est redimensionnée
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

document.getElementById('fullscreenButton').addEventListener('click', () => {
    if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
    } else if (document.body.mozRequestFullScreen) { // Firefox
        document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullscreen) { // Chrome, Safari et Opera
        document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) { // IE/Edge
        document.body.msRequestFullscreen();
    }
});

// Lancer l'initialisation
init();
