// ═══════════════════════════════════════════════════════════
// QUIZ TCF - LOGIQUE COMPLÈTE
// ═══════════════════════════════════════════════════════════

// ── État global du quiz ──
let quizState = {
    category: null,
    level: null,
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    score: 0
};

// ── Banque de questions (exemples par catégorie/niveau) ──
const questionBank = {
    grammaire: {
        A1: [
            {
                question: "Complétez : Je ___ un étudiant.",
                options: ["suis", "es", "est", "sommes"],
                correct: 0,
                explanation: "On utilise 'suis' avec 'je' pour le verbe être au présent."
            },
            {
                question: "Quel est l'article défini féminin singulier ?",
                options: ["le", "la", "les", "un"],
                correct: 1,
                explanation: "'La' est l'article défini féminin singulier. Exemple : la maison."
            },
            {
                question: "Complétez : ___ chat est noir.",
                options: ["Le", "La", "Les", "Un"],
                correct: 0,
                explanation: "'Le' est l'article défini masculin singulier pour 'chat'."
            },
            // ... générons automatiquement 22 questions supplémentaires
        ],
        A2: [
            {
                question: "Choisissez la bonne forme : Hier, j'___ au cinéma.",
                options: ["vais", "suis allé", "irai", "aille"],
                correct: 1,
                explanation: "Le passé composé 'suis allé' est utilisé avec 'hier' pour une action passée ponctuelle."
            },
            {
                question: "Quel pronom COD remplace 'les livres' ?",
                options: ["le", "la", "les", "leur"],
                correct: 2,
                explanation: "'Les' remplace un nom masculin ou féminin pluriel en tant que COD."
            }
        ],
        B1: [
            {
                question: "Il faut que tu ___ plus attention.",
                options: ["fais", "fasses", "faire", "feras"],
                correct: 1,
                explanation: "Après 'il faut que', on utilise le subjonctif présent : 'fasses'."
            }
        ]
    },
    conjugaison: {
        A1: [
            {
                question: "Conjuguez 'avoir' à la 1ère personne du singulier au présent.",
                options: ["j'ai", "tu as", "il a", "nous avons"],
                correct: 0,
                explanation: "'J'ai' est la conjugaison correcte de 'avoir' pour 'je' au présent."
            }
        ]
    },
    vocabulaire: {
        A1: [
            {
                question: "Que signifie 'Bonjour' ?",
                options: ["Goodbye", "Hello", "Good night", "Thank you"],
                correct: 1,
                explanation: "'Bonjour' signifie 'Hello' en anglais."
            }
        ]
    },
    comprehension: {
        A1: [
            {
                question: "Pierre mange une pomme. Que fait Pierre ?",
                options: ["Il dort", "Il mange", "Il court", "Il lit"],
                correct: 1,
                explanation: "Dans la phrase 'Pierre mange une pomme', l'action est 'mange'."
            }
        ]
    }
};

// ── Générateur de questions supplémentaires (pour atteindre 25) ──
function generateQuestions(category, level) {
    const base = questionBank[category]?.[level] || [];
    
    // Si on a déjà 25+, on prend les 25 premières
    if (base.length >= 25) {
        return base.slice(0, 25);
    }

    // Sinon on duplique et modifie légèrement pour atteindre 25
    const questions = [...base];
    const variants = [
        "Quelle est la bonne réponse ?",
        "Choisissez la forme correcte.",
        "Trouvez l'option appropriée.",
        "Sélectionnez la réponse exacte."
    ];

    while (questions.length < 25) {
        const original = base[questions.length % base.length];
        const variant = {
            ...original,
            question: `${variants[questions.length % variants.length]} ${original.question}`
        };
        questions.push(variant);
    }

    return questions;
}

// ═══════════════════════════════════════════════════════════
// ÉTAPE 1 : SÉLECTION CATÉGORIE + NIVEAU
// ═══════════════════════════════════════════════════════════

const categoryCards = document.querySelectorAll('.category-card');
const levelBtns = document.querySelectorAll('.level-btn');
const btnStartQuiz = document.getElementById('btn-start-quiz');

categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        categoryCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        quizState.category = card.dataset.category;
        checkCanStart();
    });
});

levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        levelBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        quizState.level = btn.dataset.level;
        checkCanStart();
    });
});

function checkCanStart() {
    if (quizState.category && quizState.level) {
        btnStartQuiz.disabled = false;
    }
}

btnStartQuiz.addEventListener('click', () => {
    // Rediriger vers la page quiz-start.html avec les paramètres
    window.location.href = `quiz_start.html?category=${quizState.category}&level=${quizState.level}`;
});

// ═══════════════════════════════════════════════════════════
// ÉTAPE 2 : AFFICHAGE DES QUESTIONS
// ═══════════════════════════════════════════════════════════

function displayQuestion() {
    const q = quizState.questions[quizState.currentQuestionIndex];
    
    // Mettre à jour progression
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

function handleAnswer(selectedIndex) {
    const q = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = selectedIndex === q.correct;
    
    // Enregistrer la réponse
    quizState.userAnswers.push({
        question: q.question,
        selectedIndex,
        correctIndex: q.correct,
        isCorrect
    });
    
    if (isCorrect) {
        quizState.score++;
    }
    
    // Désactiver tous les boutons
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

document.getElementById('btn-next').addEventListener('click', () => {
    quizState.currentQuestionIndex++;
    
    if (quizState.currentQuestionIndex < quizState.questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
});

// Bouton Quitter
document.getElementById('btn-quit').addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir quitter le quiz ?')) {
        location.reload();
    }
});

// ═══════════════════════════════════════════════════════════
// ÉTAPE 3 : RÉSULTATS
// ═══════════════════════════════════════════════════════════

function showResults() {
    document.getElementById('quiz-active').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'flex';
    
    const total = quizState.questions.length;
    const correct = quizState.score;
    const incorrect = total - correct;
    const percentage = Math.round((correct / total) * 100);
    
    // Score
    document.getElementById('score-percentage').textContent = percentage;
    document.getElementById('score-correct').textContent = correct;
    document.getElementById('score-total').textContent = total;
    
    // Animer le cercle de progression
    const circumference = 2 * Math.PI * 75; // rayon = 75
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

function generateImprovementTips() {
    const incorrectAnswers = quizState.userAnswers.filter(a => !a.isCorrect);
    const improvementList = document.getElementById('improvement-list');
    improvementList.innerHTML = '';
    
    if (incorrectAnswers.length === 0) {
        improvementList.innerHTML = `
            <div class="improvement-item">
                <div class="improvement-bullet" style="background: #f0fdf4;">
                    <span style="color: #22c55e;">✓</span>
                </div>
                <div class="improvement-text">
                    <strong>Excellent travail !</strong>
                    <p>Vous avez répondu correctement à toutes les questions. Passez au niveau suivant !</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Analyser les erreurs par type
    const tips = [];
    
    if (quizState.category === 'grammaire') {
        tips.push({
            title: "Réviser les articles",
            text: "Pratiquez davantage la différence entre 'le/la/les' et 'un/une/des'."
        });
    }
    
    if (quizState.category === 'conjugaison') {
        tips.push({
            title: "Revoir les temps verbaux",
            text: "Concentrez-vous sur la conjugaison au présent et au passé composé."
        });
    }
    
    if (quizState.category === 'vocabulaire') {
        tips.push({
            title: "Enrichir le vocabulaire",
            text: "Lisez des textes courts en français pour découvrir de nouveaux mots."
        });
    }
    
    if (quizState.category === 'comprehension') {
        tips.push({
            title: "Améliorer la compréhension",
            text: "Pratiquez la lecture de textes simples et répondez aux questions."
        });
    }
    
    // Ajouter un conseil général
    tips.push({
        title: `${incorrectAnswers.length} erreur${incorrectAnswers.length > 1 ? 's' : ''} identifiée${incorrectAnswers.length > 1 ? 's' : ''}`,
        text: "Refaites le quiz pour consolider vos connaissances."
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

// Bouton Recommencer
document.getElementById('btn-restart').addEventListener('click', () => {
    location.reload();
});

// ── Lang switcher ──
const currentLang = document.documentElement.lang;
document.querySelectorAll('.lang-option').forEach(option => {
    if (option.dataset.lang === currentLang) option.classList.add('active');
});