function createDoor() {
    const doorTextureLoader = new THREE.TextureLoader();
    
    // Charger la texture de pierre pour la porte
    const doorTexture = doorTextureLoader.load(
        'stone.jpg', 
        function (texture) {
            console.log("Texture chargée avec succès");
        },
        undefined,
        function (err) {
            console.error("Erreur lors du chargement de la texture :", err);
        }
    );

    // Appliquer la texture à un MeshStandardMaterial
    const doorMaterial = new THREE.MeshStandardMaterial({
        map: doorTexture,
        roughness: 0.8, // Ajustez pour donner un aspect pierre
    });

    // Créer la géométrie de la porte
    const doorGeometry = new THREE.BoxGeometry(2, 3, 0.1); // Ajustée pour correspondre aux murs
    const door = new THREE.Mesh(doorGeometry, doorMaterial);

    // Position et ombre de la porte
    door.position.set(0, 1.5, 5); // Ajuster si besoin
    door.castShadow = true;
    door.receiveShadow = true;

    return door;
}
