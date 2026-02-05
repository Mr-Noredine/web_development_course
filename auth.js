document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Gestion des Onglets (Connexion / Inscription) ---
    const authTabs = document.querySelectorAll('.auth-tab');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const switchLinks = document.querySelectorAll('.switch-tab');

    function switchForm(target) {
        // Mise à jour des boutons d'onglets (haut du formulaire)
        authTabs.forEach(t => t.classList.remove('active'));
        const activeTabBtn = document.querySelector(`.auth-tab[data-tab="${target}"]`);
        if(activeTabBtn) activeTabBtn.classList.add('active');

        // Affichage du bon formulaire
        if (target === 'login') {
            if(formLogin) formLogin.style.display = 'flex';
            if(formRegister) formRegister.style.display = 'none';
        } else {
            if(formLogin) formLogin.style.display = 'none';
            if(formRegister) formRegister.style.display = 'flex';
        }
    }

    // Écouteurs sur les boutons d'onglets
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => switchForm(tab.dataset.tab));
    });

    // Écouteurs sur les petits liens texte "Pas de compte ?" / "Déjà un compte ?"
    switchLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // évite le scroll
            switchForm(link.dataset.target);
        });
    });

    // --- 2. Voir / Masquer le mot de passe ---
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling; // L'input est juste avant le bouton
            if (input && (input.type === 'password' || input.type === 'text')) {
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.textContent = '🙈'; // Icône simple pour remplacer le SVG
                } else {
                    input.type = 'password';
                    btn.textContent = '👁️';
                }
            }
        });
    });

    // --- 3. Barre de force du mot de passe (Seulement pour register) ---
    const regPassword = document.getElementById('reg-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthLabel = document.querySelector('.strength-label');

    if (regPassword && strengthBar) {
        regPassword.addEventListener('input', () => {
            const val = regPassword.value;
            let score = 0;

            if (val.length >= 8) score++;
            if (/[A-Z]/.test(val)) score++; // Majuscule
            if (/[0-9]/.test(val)) score++; // Chiffre
            if (/[^A-Za-z0-9]/.test(val)) score++; // Caractère spécial

            // Reset classes
            strengthBar.className = 'strength-bar';
            
            if (val.length === 0) {
                strengthBar.style.width = '0%';
                strengthLabel.textContent = 'Minimum 8 caractères';
            } else if (score <= 1) {
                strengthBar.classList.add('weak');
                strengthLabel.textContent = 'Faible';
            } else if (score === 2) {
                strengthBar.classList.add('fair');
                strengthLabel.textContent = 'Moyen';
            } else if (score === 3) {
                strengthBar.classList.add('good');
                strengthLabel.textContent = 'Bon';
            } else {
                strengthBar.classList.add('strong');
                strengthLabel.textContent = 'Excellent';
            }
        });
    }

    // --- 4. Gestion des paramètres URL (pour redirection depuis Accueil) ---
    // Si l'URL contient ?tab=register, on active l'onglet register
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'register') {
        switchForm('register');
    }
});