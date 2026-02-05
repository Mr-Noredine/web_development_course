document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const exCards = document.querySelectorAll('.exercise-card');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 1. Gestion visuelle des boutons
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 2. Filtrage des cartes
                const category = btn.getAttribute('data-category');

                exCards.forEach(card => {
                    // Vérifie si c'est 'all' ou si la catégorie correspond
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});