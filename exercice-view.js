// ═══════════════════════════════════════════════════════════
// EXERCISE VIEW - AFFICHAGE D'UN EXERCICE
// ═══════════════════════════════════════════════════════════

let exercisePack = null;
let currentIndex = 0;
let userAnswers = [];

// Mapping catégories pour affichage
const categoryNames = {
    'grammar': 'Grammaire',
    'conjugation': 'Conjugaison',
    'vocabulary': 'Vocabulaire',
    'reading_comprehension': 'Compréhension Écrite'
};

// ═══════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════

function init() {
    // Récupérer le pack depuis localStorage
    const packData = localStorage.getItem('currentExercisePack');
    
    if (!packData) {
        alert('Aucun exercice sélectionné.');
        window.location.href = 'exercices.html';
        return;
    }
    
    exercisePack = JSON.parse(packData);
    currentIndex = exercisePack.currentIndex || 0;
    userAnswers = exercisePack.answers || [];
    
    // Afficher les infos de l'exercice
    document.getElementById('category-label').textContent = 
        categoryNames[exercisePack.category] || exercisePack.category;
    document.getElementById('level-label').textContent = exercisePack.level;
    document.getElementById('progress-total').textContent = exercisePack.exercises.length;
    
    // Afficher la première question
    displayCurrentQuestion();
}

// ═══════════════════════════════════════════════════════════
// AFFICHAGE D'UNE QUESTION
// ═══════════════════════════════════════════════════════════

function displayCurrentQuestion() {
    const exercise = exercisePack.exercises[currentIndex];
    
    // Mettre à jour la progression
    const progress = ((currentIndex + 1) / exercisePack.exercises.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-current').textContent = currentIndex + 1;
    
    // Afficher le contexte si présent
    const contextBox = document.getElementById('context-box');
    const contextText = document.getElementById('context-text');
    
    if (exercise.context) {
        contextBox.style.display = 'block';
        contextText.textContent = exercise.context;
    } else {
        contextBox.style.display = 'none';
    }
    
    // Afficher la question
    document.getElementById('question-text').textContent = exercise.prompt;
    
    // Réinitialiser feedback et bouton suivant
    document.getElementById('feedback-zone').style.display = 'none';
    document.getElementById('btn-next').style.display = 'none';
    
    // Afficher la zone de réponse selon le type
    const answerZone = document.getElementById('answer-zone');
    
    if (exercise.type === 'mcq') {
        displayMCQ(exercise, answerZone);
    } else if (exercise.type === 'fill_blank') {
        displayFillBlank(exercise, answerZone);
    } else {
        // Type non supporté pour l'instant
        answerZone.innerHTML = `<p style="color: #757575;">Type d'exercice non supporté : ${exercise.type}</p>`;
    }
}

// ═══════════════════════════════════════════════════════════
// TYPE: MCQ (Multiple Choice)
// ═══════════════════════════════════════════════════════════

function displayMCQ(exercise, container) {
    container.className = 'answer-zone type-mcq';
    container.innerHTML = '';
    
    exercise.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'mcq-option';
        btn.textContent = choice;
        btn.dataset.index = index;
        btn.addEventListener('click', () => handleMCQAnswer(exercise, index));
        container.appendChild(btn);
    });
}

function handleMCQAnswer(exercise, selectedIndex) {
    const isCorrect = exercise.choices[selectedIndex] === exercise.answer;
    
    // Enregistrer la réponse
    userAnswers.push({
        exercise_id: exercise.id,
        question: exercise.prompt,
        user_answer: exercise.choices[selectedIndex],
        correct_answer: exercise.answer,
        isCorrect: isCorrect
    });
    
    // Désactiver tous les boutons et afficher les états
    const options = document.querySelectorAll('.mcq-option');
    options.forEach((opt, idx) => {
        opt.classList.add('disabled');
        opt.style.pointerEvents = 'none';
        
        if (idx === selectedIndex) {
            opt.classList.add('selected');
            opt.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        
        // Montrer la bonne réponse si l'utilisateur s'est trompé
        if (!isCorrect && exercise.choices[idx] === exercise.answer) {
            opt.classList.add('correct');
        }
    });
    
    // Afficher le feedback
    showFeedback(isCorrect, exercise.explanation);
}

// ═══════════════════════════════════════════════════════════
// TYPE: FILL_BLANK (Text Input)
// ═══════════════════════════════════════════════════════════

function displayFillBlank(exercise, container) {
    container.className = 'answer-zone type-fill-blank';
    container.innerHTML = `
        <div class="fill-blank-input-group">
            <label class="fill-blank-label">Votre réponse :</label>
            <input 
                type="text" 
                class="fill-blank-input" 
                id="fill-blank-input" 
                placeholder="Tapez votre réponse ici..."
                autocomplete="off"
            >
            <p class="fill-blank-hint">Écrivez votre réponse exactement comme demandé (attention aux majuscules/minuscules).</p>
        </div>
        <button class="btn-primary btn-check-answer" id="btn-check-fill-blank">Valider</button>
    `;
    
    // Permettre validation avec Entrée
    const input = document.getElementById('fill-blank-input');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('btn-check-fill-blank').click();
        }
    });
    
    // Bouton de validation
    document.getElementById('btn-check-fill-blank').addEventListener('click', () => {
        handleFillBlankAnswer(exercise);
    });
    
    // Focus sur l'input
    input.focus();
}

function handleFillBlankAnswer(exercise) {
    const input = document.getElementById('fill-blank-input');
    const userAnswer = input.value.trim();
    
    if (!userAnswer) {
        alert('Veuillez entrer une réponse.');
        return;
    }
    
    // Vérifier la réponse (comparaison flexible)
    const isCorrect = checkFillBlankAnswer(userAnswer, exercise.answer);
    
    // Enregistrer la réponse
    userAnswers.push({
        exercise_id: exercise.id,
        question: exercise.prompt,
        user_answer: userAnswer,
        correct_answer: exercise.answer,
        isCorrect: isCorrect
    });
    
    // Marquer visuellement la réponse (mais garder l'input actif)
    input.classList.add(isCorrect ? 'correct' : 'incorrect');
    document.getElementById('btn-check-fill-blank').style.display = 'none';
    
    // Afficher la bonne réponse si incorrect
    if (!isCorrect) {
        const correctDisplay = document.createElement('div');
        correctDisplay.className = 'correct-answer-display';
        correctDisplay.innerHTML = `<strong>Bonne réponse :</strong> ${exercise.answer}`;
        document.querySelector('.fill-blank-input-group').appendChild(correctDisplay);
    }
    
    // Afficher le feedback
    showFeedback(isCorrect, exercise.explanation);
}

function checkFillBlankAnswer(userAnswer, correctAnswer) {
    // Comparaison flexible : enlever espaces, mettre en minuscules
    const normalize = (str) => str.toLowerCase().trim().replace(/\s+/g, ' ');
    return normalize(userAnswer) === normalize(correctAnswer);
}

// ═══════════════════════════════════════════════════════════
// AFFICHAGE DU FEEDBACK
// ═══════════════════════════════════════════════════════════

function showFeedback(isCorrect, explanation) {
    const feedbackZone = document.getElementById('feedback-zone');
    feedbackZone.style.display = 'flex';
    feedbackZone.className = `feedback-zone ${isCorrect ? 'correct' : 'incorrect'}`;
    
    document.getElementById('feedback-title').textContent = 
        isCorrect ? 'Correct !' : 'Incorrect';
    document.getElementById('feedback-explanation').textContent = explanation;
    
    // Afficher le bouton suivant
    const btnNext = document.getElementById('btn-next');
    btnNext.style.display = 'block';
    
    if (currentIndex === exercisePack.exercises.length - 1) {
        btnNext.textContent = 'Voir les résultats';
    } else {
        btnNext.textContent = 'Question suivante';
    }
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════

document.getElementById('btn-next').addEventListener('click', () => {
    currentIndex++;
    
    // Sauvegarder la progression
    exercisePack.currentIndex = currentIndex;
    exercisePack.answers = userAnswers;
    localStorage.setItem('currentExercisePack', JSON.stringify(exercisePack));
    
    if (currentIndex < exercisePack.exercises.length) {
        displayCurrentQuestion();
    } else {
        showResults();
    }
});

document.getElementById('btn-quit').addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir quitter ? Votre progression sera perdue.')) {
        localStorage.removeItem('currentExercisePack');
        window.location.href = 'exercices.html';
    }
});

// ═══════════════════════════════════════════════════════════
// RÉSULTATS
// ═══════════════════════════════════════════════════════════

function showResults() {
    document.querySelector('.exercise-view').style.display = 'none';
    document.getElementById('exercise-results').style.display = 'flex';
    
    const total = userAnswers.length;
    const correct = userAnswers.filter(a => a.isCorrect).length;
    const incorrect = total - correct;
    const percentage = Math.round((correct / total) * 100);
    
    // Afficher le score
    document.getElementById('score-percentage').textContent = percentage;
    document.getElementById('score-correct').textContent = correct;
    document.getElementById('score-total').textContent = total;
    
    // Animer le cercle
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
    
    // Nettoyer localStorage
    localStorage.removeItem('currentExercisePack');
}

function generateImprovementTips() {
    const incorrectAnswers = userAnswers.filter(a => !a.isCorrect);
    const improvementList = document.getElementById('improvement-list');
    improvementList.innerHTML = '';
    
    if (incorrectAnswers.length === 0) {
        improvementList.innerHTML = `
            <div class="improvement-item">
                <strong>Excellent travail !</strong>
                <p>Vous avez répondu correctement à toutes les questions. Continuez comme ça !</p>
            </div>
        `;
        return;
    }
    
    // Afficher les questions manquées
    incorrectAnswers.slice(0, 5).forEach((answer, idx) => {
        const item = document.createElement('div');
        item.className = 'improvement-item';
        item.innerHTML = `
            <strong>Question ${idx + 1}</strong>
            <p><strong>Q :</strong> ${answer.question}</p>
            <p><strong>Votre réponse :</strong> ${answer.user_answer}</p>
            <p><strong>Bonne réponse :</strong> ${answer.correct_answer}</p>
        `;
        improvementList.appendChild(item);
    });
    
    if (incorrectAnswers.length > 5) {
        const more = document.createElement('p');
        more.style.textAlign = 'center';
        more.style.color = '#757575';
        more.style.marginTop = '1rem';
        more.textContent = `... et ${incorrectAnswers.length - 5} autre(s) question(s) à réviser.`;
        improvementList.appendChild(more);
    }
}

// ═══════════════════════════════════════════════════════════
// INITIALISATION AU CHARGEMENT
// ═══════════════════════════════════════════════════════════

// Lang switcher
const currentLang = document.documentElement.lang;
document.querySelectorAll('.lang-option').forEach(option => {
    if (option.dataset.lang === currentLang) option.classList.add('active');
});

// Lancer au chargement
document.addEventListener('DOMContentLoaded', init);