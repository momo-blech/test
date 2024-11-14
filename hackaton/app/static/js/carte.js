document.querySelectorAll('.mission-circle').forEach(circle => {
    circle.addEventListener('click', function() {
        const mission = this.getAttribute('data-mission'); // Récupérer le numéro de mission

        // Jouer le son des portes qui se ferment
        const doorSound = document.getElementById('doorSound');
        doorSound.play();

        // Ajouter la classe pour fermer les portes
        document.body.classList.add('close-doors');

        // Redirection après la fin de l'animation des portes
        setTimeout(() => {
            window.location.href = "/game3d?mission=" + mission;
            }, 1000); // Délai de 1 seconde pour correspondre à la durée de l'animation
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const missionCircles = document.querySelectorAll('.mission-circle');
    const resetButton = document.getElementById('reset-button');

    // Récupérer le niveau atteint depuis le stockage local
    let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;

    // Fonction pour mettre à jour l'état des niveaux
    const updateMissionAccess = () => {
        missionCircles.forEach((circle, index) => {
            const level = index + 1;

            if (level < unlockedLevel) {
                // Applique la classe de mission complétée pour les niveaux déjà validés
                circle.classList.add('mission-completed');
                circle.style.pointerEvents = 'auto';
            } else if (level === unlockedLevel) {
                // Déverrouille seulement le niveau actuel
                circle.classList.remove('locked');
                circle.style.pointerEvents = 'auto';
                circle.style.opacity = '1';
            } else {
                // Verrouille les niveaux non atteints
                circle.classList.add('locked');
                circle.style.pointerEvents = 'none';
                circle.style.opacity = '0.5';
            }
        });
    };

    // Initialiser les niveaux d'accès
    updateMissionAccess();

    // Bouton pour réinitialiser la progression
    resetButton.addEventListener('click', () => {
        localStorage.removeItem('unlockedLevel'); // Supprimer la progression
        unlockedLevel = 1; // Réinitialiser au niveau 1
        updateMissionAccess(); // Mettre à jour l'accès aux niveaux
        alert('Progression réinitialisée.');
    });

    // Boucle pour gérer le déblocage des niveaux lorsqu'ils sont atteints
    missionCircles.forEach((circle, index) => {
        const level = index + 1;

        if (level <= unlockedLevel) {
            // Ajouter un événement pour débloquer les niveaux lorsqu'ils sont atteints
            circle.addEventListener('click', () => {
                localStorage.setItem('unlockedLevel', level + 1); // Débloque le niveau suivant
                unlockedLevel = level + 1; // Met à jour la progression
                updateMissionAccess(); // Met à jour l'accès aux niveaux
            });
        }
    });
});

