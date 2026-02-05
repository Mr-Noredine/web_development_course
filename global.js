document.addEventListener('DOMContentLoaded', () => {
    // 1. Gestion du switch de langue (Visuel)
    const currentLang = document.documentElement.lang; // 'fr' ou 'en'
    
    document.querySelectorAll('.lang-option').forEach(option => {
        // Enlève la classe active de tous
        option.classList.remove('active');
        // Ajoute si ça correspond à la langue html
        if (option.dataset.lang === currentLang) {
            option.classList.add('active');
        }
    });

    // 2. Gestion des liens de navigation (Active state)
    // Récupère le nom du fichier actuel (ex: "quiz.html")
    const path = window.location.pathname;
    const page = path.split("/").pop();

    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        // Enlève la classe active par défaut pour éviter les doublons
        link.classList.remove('nav-active');
        
        // Si le href du lien correspond à la page, on active
        if (link.getAttribute('href') === page) {
            link.classList.add('nav-active');
        }
    });
});