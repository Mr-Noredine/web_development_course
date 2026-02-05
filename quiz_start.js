// ═══════════════════════════════════════════════════════════
// QUIZ ACTIF - AVEC RÉCUPÉRATION DEPUIS LA BASE DE DONNÉES
// ═══════════════════════════════════════════════════════════

// ── Configuration ──
const API_URL = 'api_get_quiz.php';  // URL de votre API PHP

// ── État global ──
let quizState = {
    category: null,
    level: null,
    exerciseId: null,
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    score: 0,
    startTime: null
};

// ═══════════════════════════════════════════════════════════
// INITIALISATION : RÉCUPÉRATION DES PARAMÈTRES URL
// ═══════════════════════════════════════════════════════════

function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category'),
        level: params.get('level')
    };
}

// ═══════════════════════════════════════════════════════════
// CHARGEMENT DU QUIZ DEPUIS L'API
// ═══════════════════════════════════════════════════════════

async function loadQuiz() {
    const params = getURLParams();
    
    if (!params.category || !params.level) {
        showError('Paramètres manquants. Veuillez sélectionner une catégorie et un niveau.');
        return;
    }
    
    quizState.category = params.category;
    quizState.level = params.level;
    
    try {
        const response = await fetch(`${API_URL}?category=${params.category}&level=${params.level}`);
        const data = await response.json();
        
        if (!data.success) {
            showError(data.error || 'Erreur lors du chargement du quiz');
            return;
        }
        
        // Stocker les données
        quizState.exerciseId = data.exercise.id;
        quizState.questions = data.questions;
        quizState.startTime = new Date();
        
        // Mettre à jour l'interface
        document.getElementById('current-category').textContent = 
            params.category.charAt(0).toUpperCase() + params.category.slice(1);
        document.getElementById('current-level').textContent = params.level;
        document.getElementById('progress-total').textContent = data.total_questions;
        
        // Masquer le loading, afficher le quiz
        document.getElementById('quiz-loading').style.display = 'none';
        document.getElementById('quiz-active').style.display = 'flex';
        
        // Afficher la première question
        displayQuestion();
        
    } catch (error) {
        console.error('Erreur:', error);
        showError('Impossible de charger le quiz. Vérifiez votre connexion.');
    }
}

// ═══════════════════════════════════════════════════════════
// AFFICHAGE D'UNE QUESTION
// ═══════════════════════════════════════════════════════════

function displayQuestion() {
    const q = quizState.questions[quizState.currentQuestionIndex];
    
    // Mettre à jour la barre de progression
    const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-current').textContent = quizState.currentQuestionIndex + 1;
    
    // Afficher la question
    document.getElementById('question-text').textContent = q.question;
    
    // Afficher les options
    const answersGrid = document.getElementById('answers-grid');
    answersGrid.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-option';
        btn.textContent = option;
        btn.dataset.index = index;
        btn.addEventListener('click', () => handleAnswer(index));
        answersGrid.appendChild(btn);
    });
    
    // Réinitialiser feedback et bouton suivant
    document.getElementById('feedback-zone').style.display = 'none';
    document.getElementById('btn-next').style.display = 'none';
}

// ═══════════════════════════════════════════════════════════
// TRAITEMENT DE LA RÉPONSE
// ═══════════════════════════════════════════════════════════

function handleAnswer(selectedIndex) {
    const q = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = selectedIndex === q.correct;
    
    // Enregistrer la réponse
    quizState.userAnswers.push({
        question_id: q.question_id,
        question: q.question,
        selectedIndex,
        correctIndex: q.correct,
        isCorrect,
        points: isCorrect ? q.points : 0
    });
    
    if (isCorrect) {
        quizState.score += q.points;
    }
    
    // Désactiver tous les boutons et afficher les états
    const answerBtns = document.querySelectorAll('.answer-option');
    answerBtns.forEach((btn, idx) => {
        btn.classList.add('disabled');
        btn.style.pointerEvents = 'none';
        
        if (idx === selectedIndex) {
            btn.classList.add('selected');
            btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        
        if (idx === q.correct && !isCorrect) {
            btn.classList.add('correct');
        }
    });
    
    // Afficher le feedback
    const feedbackZone = document.getElementById('feedback-zone');
    feedbackZone.style.display = 'flex';
    feedbackZone.className = `feedback-zone ${isCorrect ? 'correct' : 'incorrect'}`;
    
    document.getElementById('feedback-title').textContent = 
        isCorrect ? 'Correct !' : 'Incorrect';
    document.getElementById('feedback-explanation').textContent = q.explanation;
    
    // Afficher le bouton suivant
    const btnNext = document.getElementById('btn-next');
    btnNext.style.display = 'block';
    
    if (quizState.currentQuestionIndex === quizState.questions.length - 1) {
        btnNext.textContent = 'Voir les résultats';
    } else {
        btnNext.textContent = 'Question suivante';
    }
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION : QUESTION SUIVANTE
// ═══════════════════════════════════════════════════════════

document.getElementById('btn-next').addEventListener('click', () => {
    quizState.currentQuestionIndex++;
    
    if (quizState.currentQuestionIndex < quizState.questions.length) {
        displayQuestion();
    } else {
        saveAttemptAndShowResults();
    }
});

// ═══════════════════════════════════════════════════════════
// SAUVEGARDE DE LA TENTATIVE ET AFFICHAGE DES RÉSULTATS
// ═══════════════════════════════════════════════════════════

async function saveAttemptAndShowResults() {
    const endTime = new Date();
    const timeSpent = Math.floor((endTime - quizState.startTime) / 1000); // en secondes
    
    const totalPoints = quizState.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((quizState.score / totalPoints) * 100);
    
    // Préparer les données à envoyer
    const attemptData = {
        exercise_id: quizState.exerciseId,
        user_id: 1, // À remplacer par l'ID utilisateur connecté (session)
        score: quizState.score,
        max_score: totalPoints,
        percentage: percentage,
        time_spent: timeSpent,
        answers: quizState.userAnswers
    };
    
    // Envoyer à l'API (optionnel - pour enregistrer la tentative)
    try {
        await fetch('api_save_attempt.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attemptData)
        });
    } catch (error) {
        console.warn('Impossible de sauvegarder la tentative:', error);
        // On continue quand même pour afficher les résultats
    }
    
    // Afficher les résultats
    showResults();
}

// ═══════════════════════════════════════════════════════════
// AFFICHAGE DES RÉSULTATS
// ═══════════════════════════════════════════════════════════

function showResults() {
    document.getElementById('quiz-active').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'flex';
    
    const totalPoints = quizState.questions.reduce((sum, q) => sum + q.points, 0);
    const correct = quizState.userAnswers.filter(a => a.isCorrect).length;
    const incorrect = quizState.userAnswers.length - correct;
    const percentage = Math.round((quizState.score / totalPoints) * 100);
    
    // Afficher le score
    document.getElementById('score-percentage').textContent = percentage;
    document.getElementById('score-correct').textContent = correct;
    document.getElementById('score-total').textContent = quizState.questions.length;
    
    // Animer le cercle de progression
    const circumference = 2 * Math.PI * 75;
    const offset = circumference - (percentage / 100) * circumference;
    
    setTimeout(() => {
        document.getElementById('score-circle').style.strokeDashoffset = offset;
    }, 200);
    
    // Stats
    document.getElementById('stat-correct').textContent = correct;
    document.getElementById('stat-incorrect').textContent = incorrect;
    
    // Points d'amélioration
    generateImprovementTips();
}

// ═══════════════════════════════════════════════════════════
// GÉNÉRATION DES CONSEILS D'AMÉLIORATION
// ═══════════════════════════════════════════════════════════

function generateImprovementTips() {
    const incorrectAnswers = quizState.userAnswers.filter(a => !a.isCorrect);
    const improvementList = document.getElementById('improvement-list');
    improvementList.innerHTML = '';
    
    if (incorrectAnswers.length === 0) {
        improvementList.innerHTML = `
            <div class="improvement-item">
                <div class="improvement-bullet" style="background: #f0fdf4;">
                    <span style="color: #22c55e; font-weight: 700;">✓</span>
                </div>
                <div class="improvement-text">
                    <strong>Excellent travail !</strong>
                    <p>Vous avez répondu correctement à toutes les questions. Passez au niveau suivant !</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Conseils génériques basés sur la catégorie
    const tips = [];
    
    if (quizState.category === 'grammaire') {
        tips.push({
            title: "Réviser les règles grammaticales",
            text: "Concentrez-vous sur les articles, les pronoms et les structures de phrases."
        });
    }
    
    if (quizState.category === 'conjugaison') {
        tips.push({
            title: "Revoir la conjugaison",
            text: "Pratiquez les temps et modes verbaux les plus utilisés (présent, passé composé, futur)."
        });
    }
    
    if (quizState.category === 'vocabulaire') {
        tips.push({
            title: "Enrichir votre vocabulaire",
            text: "Lisez des textes variés en français pour découvrir de nouveaux mots."
        });
    }
    
    if (quizState.category === 'comprehension') {
        tips.push({
            title: "Améliorer la compréhension",
            text: "Pratiquez la lecture de textes et l'écoute de dialogues en français."
        });
    }
    
    // Ajouter un conseil sur les erreurs
    tips.push({
        title: `${incorrectAnswers.length} erreur${incorrectAnswers.length > 1 ? 's' : ''} à corriger`,
        text: "Relisez les explications des questions manquées et refaites l'exercice."
    });
    
    tips.forEach(tip => {
        const item = document.createElement('div');
        item.className = 'improvement-item';
        item.innerHTML = `
            <div class="improvement-bullet"></div>
            <div class="improvement-text">
                <strong>${tip.title}</strong>
                <p>${tip.text}</p>
            </div>
        `;
        improvementList.appendChild(item);
    });
}

// ═══════════════════════════════════════════════════════════
// AFFICHAGE D'ERREUR
// ═══════════════════════════════════════════════════════════

function showError(message) {
    document.getElementById('quiz-loading').style.display = 'none';
    document.getElementById('quiz-error').style.display = 'flex';
    document.getElementById('error-message').textContent = message;
}

// ═══════════════════════════════════════════════════════════
// BOUTONS ACTIONS
// ═══════════════════════════════════════════════════════════

// Bouton Quitter
document.getElementById('btn-quit').addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir quitter le quiz ? Votre progression sera perdue.')) {
        window.location.href = 'quiz.html';
    }
});

// Bouton Recommencer
document.getElementById('btn-restart').addEventListener('click', () => {
    window.location.href = 'quiz.html';
});

// ═══════════════════════════════════════════════════════════
// DÉMARRAGE
// ═══════════════════════════════════════════════════════════

// Lang switcher
const currentLang = document.documentElement.lang;
document.querySelectorAll('.lang-option').forEach(option => {
    if (option.dataset.lang === currentLang) option.classList.add('active');
});

// Charger le quiz au chargement de la page
window.addEventListener('DOMContentLoaded', loadQuiz);