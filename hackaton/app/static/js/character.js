function loadCharacter(scene, callback) {
    const loader = new THREE.GLTFLoader();
    loader.load('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb', function (gltf) {
        const robot = gltf.scene;
        robot.scale.set(0.5, 0.5, 0.5);  // Ajuster l'échelle
        robot.position.set(0, 0, 0);     // Positionner le robot dans la scène
        robot.traverse(function(node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        scene.add(robot);
        callback(robot);  // Retourner le modèle chargé
        console.log("GLTF model loaded successfully");
    }, undefined, function (error) {
        console.error('An error occurred while loading the GLTF model:', error);
    });
}
