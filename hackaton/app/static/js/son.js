document.addEventListener('DOMContentLoaded', () => {
    // Création de l'élément audio pour la musique de fond
    const backgroundMusic = new Audio('/static/sounds/ambiance.mp3'); // Chemin relatif pour Django
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5; // Volume initial

    // Références aux éléments de la page
    const soundToggle = document.getElementById('sound-toggle');
    const volumeSlider = document.getElementById('volume-slider');

    // Initialiser l'état du son (par défaut non muet)
    let isMuted = false;

    // Fonction pour mettre à jour l'icône de son
    const updateSoundIcon = () => {
        soundToggle.textContent = (isMuted || backgroundMusic.volume === 0) ? "🔇" : "🔊";
    };

    // Fonction pour activer/désactiver le son
    const toggleSound = () => {
        isMuted = !isMuted;
        backgroundMusic.muted = isMuted; // Active/désactive le son réel
        updateSoundIcon();
        soundToggle.blur();
    };

    // Écouter l'événement de clic sur le bouton de contrôle du son
    soundToggle.addEventListener('click', toggleSound);

    // Lancer le son au premier clic n'importe où sur la page
    document.addEventListener('click', () => {
        if (!backgroundMusic.playing && !isMuted) {
            backgroundMusic.play().catch(error => console.error("Erreur de lecture audio :", error));
        }
    }, { once: true });

    // Écouter les changements du curseur de volume
    volumeSlider.addEventListener('input', (event) => {
        const volume = event.target.value;
        backgroundMusic.volume = volume;

        // Si le volume est réglé à 0, on considère que c'est en mode mute
        if (volume == 0) {
            isMuted = true;
            backgroundMusic.muted = true;
        } else {
            isMuted = false;
            backgroundMusic.muted = false;
        }

        updateSoundIcon();
    });

    // Écouter la touche 'V' pour activer/désactiver le son
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'v') {
            toggleSound();
        }
    });
});
