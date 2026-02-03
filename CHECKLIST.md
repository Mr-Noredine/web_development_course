# ✅ Checklist complète – Images + Filtres + Fichiers

---

## 📁 Structure de dossiers attendue

```
votre-projet/
├── main-fr.html
├── main-en.html
├── quiz.html
├── exercices.html
├── auth.html              ← nouvelle page
├── style.css              ← styles communs (nav, footer, hero, buttons…)
├── style_quiz.css         ← styles spécifiques quiz
├── style_exercices.css    ← styles spécifiques exercices
├── style_auth.css         ← styles spécifiques auth   ← nouveau fichier
└── images/                ← créez ce dossier
    ├── hero-student.jpg
    ├── workspace.jpg
    ├── classroom.jpg
    ├── book-grammar.jpg
    └── exercise-papers.jpg
```

---

## 📸 Images à télécharger

Téléchargez chaque URL ci-dessous, puis renommez le fichier selon la colonne "Nom local".

| # | URL à télécharger | Nom local | Utilisée dans |
|---|-------------------|-----------|---------------|
| 1 | https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80 | `hero-student.jpg` | main-fr / main-en (section About) |
| 2 | https://images.unsplash.com/photo-1593506338-a385935cd131?w=800&q=80 | `workspace.jpg` | main-fr / main-en (section Demo) |
| 3 | https://images.unsplash.com/photo-1513085745570-040d273d7e6f?w=1600&q=80 | `classroom.jpg` | main-fr / main-en / quiz / exercices (CTA background) |
| 4 | https://images.unsplash.com/photo-1491750296711-ca938ed752c7?w=800&q=80 | `book-grammar.jpg` | quiz (leçon mise en avant) + auth (image côté gauche) |
| 5 | https://images.unsplash.com/photo-1468533344113-50a2e8a08fb8?w=800&q=80 | `exercise-papers.jpg` | exercices (exercice mis en avant) |

---

## 🔗 Mise à jour des `src` après téléchargement

Une fois les images téléchargées dans `images/`, remplacez les URLs Unsplash par les chemins locaux :

### main-fr.html & main-en.html
```
AVANT  → src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
APRÈS  → src="images/hero-student.jpg"

AVANT  → src="https://images.unsplash.com/photo-1593506338-a385935cd131?w=800&q=80"
APRÈS  → src="images/workspace.jpg"

AVANT  → src="https://images.unsplash.com/photo-1513085745570-040d273d7e6f?w=1600&q=80"
APRÈS  → src="images/classroom.jpg"
```

### quiz.html
```
AVANT  → src="https://images.unsplash.com/photo-1491750296711-ca938ed752c7?w=800&q=80"
APRÈS  → src="images/book-grammar.jpg"

AVANT  → src="https://images.unsplash.com/photo-1513085745570-040d273d7e6f?w=1600&q=80"
APRÈS  → src="images/classroom.jpg"
```

### exercices.html
```
AVANT  → src="https://images.unsplash.com/photo-1468533344113-50a2e8a08fb8?w=800&q=80"
APRÈS  → src="images/exercise-papers.jpg"

AVANT  → src="https://images.unsplash.com/photo-1513085745570-040d273d7e6f?w=1600&q=80"
APRÈS  → src="images/classroom.jpg"
```

### auth.html
```
AVANT  → src="https://images.unsplash.com/photo-1491750296711-ca938ed752c7?w=900&q=80"
APRÈS  → src="images/book-grammar.jpg"
```

---

## 🎛️ Filtres – Comment ils fonctionnent

Les filtres sont **déjà 100 % opérationnels** via le JavaScript embarqué dans chaque fichier HTML. Voici la logique :

### quiz.html – Filtres par niveau (A1 → C2)

Chaque carte a un attribut `data-level` :
```html
<article class="lesson-card" data-level="a1">...</article>
<article class="lesson-card" data-level="b1">...</article>
```

Le bouton cliqué a un attribut `data-filter` :
```html
<button class="filter-btn" data-filter="a1">A1</button>
```

Le JS compare les deux :
- Si `data-filter="all"` → affiche toutes les cartes
- Sinon → cache les cartes dont `data-level` ne correspond pas

**Pour ajouter une nouvelle carte**, copiez une carte existante et changez uniquement `data-level` :
```html
<article class="lesson-card" data-level="b2">
    <div class="lesson-card-top">
        <span class="lesson-level">B2</span>
        ...
    </div>
    <h3>Titre de votre nouvelle leçon</h3>
    <p>Description.</p>
    <a href="#" class="lesson-link">Voir la leçon</a>
</article>
```

---

### exercices.html – Filtres par catégorie (tabs)

Chaque carte a un attribut `data-category` :
```html
<article class="exercise-card" data-category="conjugaison">...</article>
<article class="exercise-card" data-category="grammaire">...</article>
<article class="exercise-card" data-category="co">...</article>
<article class="exercise-card" data-category="ce">...</article>
```

Les valeurs possibles sont exactement : `conjugaison`, `grammaire`, `co`, `ce`.

Le tab cliqué a `data-category` identique :
```html
<button class="tab-btn" data-category="conjugaison">Conjugaison</button>
```

**Pour ajouter un exercice**, utilisez l'une des 4 valeurs ci-dessus dans `data-category`.

---

## ⚠️ Points d'attention

1. **Noms de fichiers** : pas d'accents, pas d'espaces.  
   ✅ `exercise-papers.jpg`  
   ❌ `exercice papiers.jpg`

2. **Casse des attributs** : `data-level="a1"` doit être en minuscules partout (bouton ET carte).

3. **Le bouton nav actif** : dans quiz.html et exercices.html, le lien actif a la classe `nav-active`.  
   Si vous êtes sur la page quiz → `<a href="quiz.html" class="nav-active">Leçons</a>`  
   Sur exercices → `<a href="exercices.html" class="nav-active">Exercices</a>`  
   Sur auth → aucun lien actif (vous pouvez en ajouter un si vous voulez).

4. **Le bouton "Connexion" dans la nav** doit pointer vers auth.html :
```html
<button type="button" class="btn-login" onclick="window.location='auth.html'">Connexion</button>
```

---

## 🔗 Liens entre pages – Résumé

| Élément | Pointe vers |
|---------|-------------|
| Nav → Accueil | `main-fr.html` |
| Nav → Leçons | `quiz.html` |
| Nav → Exercices | `exercices.html` |
| Nav → Connexion | `auth.html` |
| quiz.html CTA | `exercices.html` |
| auth.html "Créer un compte" | même page (tab switch) |
| auth.html "Se connecter" | même page (tab switch) |

---

## ✅ Vérification rapide

- [ ] Dossier `images/` créé avec les 5 fichiers
- [ ] Les `src` sont mis à jour dans les 5 HTML
- [ ] `style_auth.css` est dans le même dossier que les autres CSS
- [ ] Le bouton "Connexion" pointe vers `auth.html`
- [ ] Les filtres quiz.html fonctionnent (cliquez A1, A2…)
- [ ] Les tabs exercices.html fonctionnent (cliquez Conjugaison…)
- [ ] La page auth.html s'affiche avec les 2 tabs (Connexion / Créer un compte)
- [ ] Le toggle œil cache/montre le mot de passe
- [ ] La barre de force du mot de passe change en tapant
