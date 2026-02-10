// ═══════════════════════════════════════════════════════════
// EXERCICES - CHARGEMENT DEPUIS items.json (VERSION ICÔNES)
// ═══════════════════════════════════════════════════════════

let allExercises = [];

// Mapping catégories avec icônes et couleurs
const categoryMap = {
    'grammar': { 
        name: 'Grammaire', 
        slug: 'grammaire',
        icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
        color: '#3b82f6' // Bleu
    },
    'conjugation': { 
        name: 'Conjugaison', 
        slug: 'conjugaison',
        icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        color: '#8b5cf6' // Violet
    },
    'vocabulary': { 
        name: 'Vocabulaire', 
        slug: 'vocabulaire',
        icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
        color: '#10b981' // Vert
    },
    'reading_comprehension': { 
        name: 'Compréhension Écrite', 
        slug: 'ce',
        icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
        color: '#f59e0b' // Orange
    }
};

// Mapping difficulté
const difficultyMap = {
    1: { label: 'Facile', class: 'easy' },
    2: { label: 'Moyen', class: 'medium' },
    3: { label: 'Difficile', class: 'hard' },
    4: { label: 'Expert', class: 'hard' },
    5: { label: 'Maître', class: 'hard' }
};

// Mapping niveau -> difficulté
const levelDifficultyMap = {
    'A1': 1,
    'A2': 2,
    'B1': 2,
    'B2': 3,
    'C1': 3,
    'C2': 3
};

// ═══════════════════════════════════════════════════════════
// CHARGEMENT DES EXERCICES
// ═══════════════════════════════════════════════════════════

async function loadExercises() {
    try {
        const response = await fetch('items.json');
        const data = await response.json();
        allExercises = data.items;
        
        displayExercises(allExercises);
        
    } catch (error) {
        console.error('Erreur lors du chargement des exercices:', error);
        showError();
    }
}

// ═══════════════════════════════════════════════════════════
// AFFICHAGE DES EXERCICES
// ═══════════════════════════════════════════════════════════

function displayExercises(exercises) {
    // Grouper par catégorie + niveau
    const grouped = {};
    
    exercises.forEach(ex => {
        const key = `${ex.category_id}_${ex.level}`;
        if (!grouped[key]) {
            grouped[key] = {
                category_id: ex.category_id,
                level: ex.level,
                exercises: []
            };
        }
        grouped[key].exercises.push(ex);
    });
    
    // Convertir en array et trier
    const packs = Object.values(grouped).sort((a, b) => {
        // Ordre : A1, A2, B1, B2, C1, C2
        const levelOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
        return (levelOrder[a.level] || 0) - (levelOrder[b.level] || 0);
    });
    
    const gridContainer = document.getElementById('exercises-grid');
    gridContainer.innerHTML = '';
    
    // Afficher tous les packs dans la grille (pas de featured)
    packs.forEach(pack => {
        const card = createExerciseCard(pack);
        gridContainer.appendChild(card);
    });
}

function createExerciseCard(pack) {
    const category = categoryMap[pack.category_id] || { 
        name: pack.category_id, 
        slug: pack.category_id,
        icon: '',
        color: '#757575'
    };
    const difficulty = getDifficultyForLevel(pack.level);
    
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.dataset.category = category.slug;
    
    card.innerHTML = `
        <div class="card-icon" style="color: ${category.color};">
            ${category.icon}
        </div>
        <div class="card-header">
            <span class="card-category">${category.name}</span>
            <span class="card-level">Niveau ${pack.level}</span>
        </div>
        <h3 class="card-title">${category.name} - ${pack.level}</h3>
        <p class="card-description">${pack.exercises.length} questions disponibles</p>
        <div class="card-footer">
            <span class="card-difficulty badge-${difficulty.class}">${difficulty.label}</span>
            <button class="btn-start" onclick="startExercisePack('${pack.category_id}', '${pack.level}')">Commencer</button>
        </div>
    `;
    
    return card;
}

function getDifficultyForLevel(level) {
    const difficultyNum = levelDifficultyMap[level] || 2;
    return difficultyMap[difficultyNum];
}

// ═══════════════════════════════════════════════════════════
// DÉMARRER UN PACK D'EXERCICES
// ═══════════════════════════════════════════════════════════

function startExercisePack(categoryId, level) {
    // Filtrer les exercices correspondants
    const exercises = allExercises.filter(ex => 
        ex.category_id === categoryId && ex.level === level
    );
    
    if (exercises.length === 0) {
        alert('Aucun exercice disponible pour cette catégorie et ce niveau.');
        return;
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('currentExercisePack', JSON.stringify({
        category: categoryId,
        level: level,
        exercises: exercises,
        currentIndex: 0,
        answers: []
    }));
    
    // Rediriger vers la page d'exercice
    window.location.href = 'exercice-view.html';
}

// ═══════════════════════════════════════════════════════════
// FILTRES PAR CATÉGORIE
// ═══════════════════════════════════════════════════════════

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Ajouter au bouton cliqué
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            filterExercises(category);
        });
    });
}

function filterExercises(category) {
    const cards = document.querySelectorAll('.exercise-card');
    
    cards.forEach(card => {
        if (category === 'tous' || card.dataset.category === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ═══════════════════════════════════════════════════════════
// GESTION DES ERREURS
// ═══════════════════════════════════════════════════════════

function showError() {
    const gridContainer = document.getElementById('exercises-grid');
    gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <p style="color: #ef4444; font-size: 1.1rem; margin-bottom: 1rem;">
                ⚠️ Erreur lors du chargement des exercices
            </p>
            <p style="color: #757575; margin-bottom: 2rem;">
                Veuillez vérifier que le fichier items.json est présent et valide.
            </p>
            <button class="btn-primary" onclick="location.reload()">Recharger la page</button>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    loadExercises();
    setupFilters();
});