// ═══════════════════════════════════════════════════════════
// QUIZ ACTIF - AVEC RÉCUPÉRATION DEPUIS items.js
// ═══════════════════════════════════════════════════════════

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
// HELPERS
// ═══════════════════════════════════════════════════════════

function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get('category'),
    level: params.get('level')
  };
}

function normalizeCategoryParam(category) {
  if (!category) return null;
  const c = category.trim().toLowerCase();

  const map = {
    'grammaire': 'grammar',
    'conjugaison': 'conjugation',
    'vocabulaire': 'vocabulary',
    'comprehension': 'reading_comprehension',
    'compréhension': 'reading_comprehension',
    'compréhension écrite': 'reading_comprehension',
    'grammar': 'grammar',
    'conjugation': 'conjugation',
    'vocabulary': 'vocabulary',
    'reading_comprehension': 'reading_comprehension'
  };

  return map[c] || c;
}

function categoryLabel(categoryId) {
  const map = {
    grammar: 'Grammaire',
    conjugation: 'Conjugaison',
    vocabulary: 'Vocabulaire',
    reading_comprehension: 'Compréhension Écrite'
  };
  return map[categoryId] || categoryId;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mapItemToQuestion(item, idx) {
  const points = Number.isFinite(item.difficulty) ? Math.max(1, item.difficulty) : 1;

  if (item.type === 'mcq') {
    const options = Array.isArray(item.choices) ? item.choices : [];
    const correctIndex = options.findIndex(c => c === item.answer);

    return {
      question_id: item.id || `q_${idx}`,
      question: item.prompt || '',
      options,
      correct: correctIndex >= 0 ? correctIndex : 0,
      explanation: item.explanation || '',
      points,
      type: 'mcq',
      answerText: item.answer
    };
  }

  return {
    question_id: item.id || `q_${idx}`,
    question: item.prompt || '',
    options: null,
    correct: null,
    explanation: item.explanation || '',
    points,
    type: 'fill_blank',
    answerText: item.answer
  };
}

// ═══════════════════════════════════════════════════════════
// CHARGEMENT DU QUIZ DEPUIS items.js
// ═══════════════════════════════════════════════════════════

async function loadQuiz() {
  const params = getURLParams();

  if (!params.category || !params.level) {
    showError('Paramètres manquants. Veuillez sélectionner une catégorie et un niveau.');
    return;
  }

  const categoryId = normalizeCategoryParam(params.category);
  const level = params.level.trim().toUpperCase();

  quizState.category = categoryId;
  quizState.level = level;

  try {
    // Attendre que items.js charge les données
    await window.itemsReady;
    
    const itemsData = window.QUIZ_ITEMS;
    const items = Array.isArray(itemsData?.items) ? itemsData.items : [];

    if (items.length === 0) {
      showError("Aucune question chargée. Vérifiez que items.json contient des exercices.");
      return;
    }

    // Filtrer par catégorie et niveau
    const filtered = items.filter(it =>
      normalizeCategoryParam(it.category_id) === categoryId &&
      String(it.level || '').toUpperCase() === level &&
      (String(it.exam || '').toUpperCase() === 'TCF' || !it.exam)
    );

    if (filtered.length === 0) {
      showError(`Aucune question trouvée pour ${categoryLabel(categoryId)} / ${level}.`);
      return;
    }

    quizState.exerciseId = `local_${categoryId}_${level}`;
    quizState.questions = shuffleArray(filtered).map(mapItemToQuestion);
    quizState.startTime = new Date();

    // UI header
    document.getElementById('current-category').textContent = categoryLabel(categoryId);
    document.getElementById('current-level').textContent = level;
    document.getElementById('progress-total').textContent = quizState.questions.length;

    // Afficher quiz
    document.getElementById('quiz-loading').style.display = 'none';
    document.getElementById('quiz-active').style.display = 'flex';

    displayQuestion();
  } catch (error) {
    console.error('Erreur:', error);
    showError('Impossible de charger le quiz. Vérifiez que items.json est présent.');
  }
}

// ═══════════════════════════════════════════════════════════
// AFFICHAGE D'UNE QUESTION
// ═══════════════════════════════════════════════════════════

function displayQuestion() {
  const q = quizState.questions[quizState.currentQuestionIndex];

  const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
  document.getElementById('progress-current').textContent = quizState.currentQuestionIndex + 1;

  document.getElementById('question-text').textContent = q.question;

  const answersGrid = document.getElementById('answers-grid');
  answersGrid.innerHTML = '';

  if (q.options && q.options.length > 0) {
    q.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'answer-option';
      btn.textContent = option;
      btn.dataset.index = index;
      btn.addEventListener('click', () => handleAnswer(index));
      answersGrid.appendChild(btn);
    });
  }

  document.getElementById('feedback-zone').style.display = 'none';
  document.getElementById('btn-next').style.display = 'none';
}

// ═══════════════════════════════════════════════════════════
// TRAITEMENT DE LA RÉPONSE
// ═══════════════════════════════════════════════════════════

function handleAnswer(selectedIndex) {
  const q = quizState.questions[quizState.currentQuestionIndex];
  const isCorrect = selectedIndex === q.correct;

  quizState.userAnswers.push({
    question_id: q.question_id,
    question: q.question,
    selectedIndex,
    correctIndex: q.correct,
    isCorrect,
    points: isCorrect ? q.points : 0
  });

  if (isCorrect) quizState.score += q.points;

  const answerBtns = document.querySelectorAll('.answer-option');
  answerBtns.forEach((btn, idx) => {
    btn.classList.add('disabled');
    btn.style.pointerEvents = 'none';

    if (idx === selectedIndex) {
      btn.classList.add('selected');
      btn.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
    if (idx === q.correct && !isCorrect) btn.classList.add('correct');
  });

  const feedbackZone = document.getElementById('feedback-zone');
  feedbackZone.style.display = 'flex';
  feedbackZone.className = `feedback-zone ${isCorrect ? 'correct' : 'incorrect'}`;

  document.getElementById('feedback-title').textContent = isCorrect ? 'Correct !' : 'Incorrect';
  document.getElementById('feedback-explanation').textContent = q.explanation || '';

  const btnNext = document.getElementById('btn-next');
  btnNext.style.display = 'block';
  btnNext.textContent =
    quizState.currentQuestionIndex === quizState.questions.length - 1
      ? 'Voir les résultats'
      : 'Question suivante';
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════

document.getElementById('btn-next').addEventListener('click', () => {
  quizState.currentQuestionIndex++;
  if (quizState.currentQuestionIndex < quizState.questions.length) {
    displayQuestion();
  } else {
    showResults();
  }
});

// ═══════════════════════════════════════════════════════════
// AFFICHAGE DES RÉSULTATS
// ═══════════════════════════════════════════════════════════

function showResults() {
  document.getElementById('quiz-active').style.display = 'none';
  document.getElementById('quiz-results').style.display = 'flex';

  const totalPoints = quizState.questions.reduce((sum, q) => sum + q.points, 0);
  const correct = quizState.userAnswers.filter(a => a.isCorrect).length;
  const incorrect = quizState.userAnswers.length - correct;
  const percentage = totalPoints > 0 ? Math.round((quizState.score / totalPoints) * 100) : 0;

  document.getElementById('score-percentage').textContent = percentage;
  document.getElementById('score-correct').textContent = correct;
  document.getElementById('score-total').textContent = quizState.questions.length;

  const circumference = 2 * Math.PI * 75;
  const offset = circumference - (percentage / 100) * circumference;

  setTimeout(() => {
    const circle = document.getElementById('score-circle');
    if (circle) circle.style.strokeDashoffset = offset;
  }, 200);

  document.getElementById('stat-correct').textContent = correct;
  document.getElementById('stat-incorrect').textContent = incorrect;

  generateImprovementTips();
}

// ═══════════════════════════════════════════════════════════
// CONSEILS D'AMÉLIORATION
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

  const tips = [];

  if (quizState.category === 'grammar') {
    tips.push({ title: 'Réviser les règles grammaticales', text: 'Concentrez-vous sur les articles, les pronoms et les structures.' });
  }
  if (quizState.category === 'conjugation') {
    tips.push({ title: 'Revoir la conjugaison', text: 'Pratiquez les temps et modes verbaux (présent, passé composé, futur).' });
  }
  if (quizState.category === 'vocabulary') {
    tips.push({ title: 'Enrichir votre vocabulaire', text: 'Lisez des textes variés en français pour découvrir de nouveaux mots.' });
  }
  if (quizState.category === 'reading_comprehension') {
    tips.push({ title: 'Améliorer la compréhension', text: "Pratiquez la lecture de textes et identifiez l'idée principale et les détails." });
  }

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
// ERREURS + ACTIONS
// ═══════════════════════════════════════════════════════════

function showError(message) {
  document.getElementById('quiz-loading').style.display = 'none';
  document.getElementById('quiz-error').style.display = 'flex';
  document.getElementById('error-message').textContent = message;
}

document.getElementById('btn-quit').addEventListener('click', () => {
  if (confirm('Êtes-vous sûr de vouloir quitter le quiz ? Votre progression sera perdue.')) {
    window.location.href = 'quiz.html';
  }
});

document.getElementById('btn-restart').addEventListener('click', () => {
  window.location.href = 'quiz.html';
});

// Lang switcher
const currentLang = document.documentElement.lang;
document.querySelectorAll('.lang-option').forEach(option => {
  if (option.dataset.lang === currentLang) option.classList.add('active');
});

// Charger au démarrage
window.addEventListener('DOMContentLoaded', loadQuiz);