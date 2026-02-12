# 🚀 TCF PREP - Backend API

Backend Node.js + Express + PostgreSQL pour l'application TCF Prep.

## 📋 Prérequis

- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm ou yarn

## 🛠️ Installation

### 1. Installation des dépendances

```bash
cd server
npm install
```

### 2. Configuration de l'environnement

Copier `.env.example` vers `.env` et configurer :

```bash
cp .env.example .env
```

Éditer `.env` avec vos paramètres :

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tcf_prep_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_key
```

### 3. Création de la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE tcf_prep_db;

# Quitter
\q
```

### 4. Initialisation du schéma

```bash
npm run db:setup
```

### 5. Import des données (seed)

```bash
npm run db:seed
```

## 🎯 Démarrage

### Mode développement (avec auto-reload)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

Le serveur démarre sur http://localhost:5000

## 📡 API Endpoints

### Health Check
- **GET** `/api/health` - Vérifier l'état du serveur

### Authentification
- **POST** `/api/auth/register` - Créer un compte
- **POST** `/api/auth/login` - Se connecter
- **GET** `/api/auth/me` - Obtenir l'utilisateur connecté (protégé)

### Exercices
- **GET** `/api/exercises` - Liste tous les exercices (avec filtres)
  - Query params : `?category=grammar&level=A1&type=mcq&limit=50`
- **GET** `/api/exercises/grouped` - Exercices groupés par catégorie/niveau
- **GET** `/api/exercises/categories` - Liste des catégories
- **GET** `/api/exercises/:id` - Obtenir un exercice par ID
- **POST** `/api/exercises/attempt` - Enregistrer une tentative

### Quiz
- **GET** `/api/quiz?category=grammar&level=A1&limit=25` - Obtenir questions aléatoires
- **POST** `/api/quiz/attempt` - Enregistrer une tentative de quiz

### Utilisateurs (Routes protégées)
- **GET** `/api/users/progress` - Progression de l'utilisateur
- **GET** `/api/users/attempts` - Historique des tentatives
- **GET** `/api/users/stats` - Statistiques globales

## 📊 Structure de la base de données

### Tables principales

- **users** - Utilisateurs
- **categories** - Catégories d'exercices
- **exercises** - Exercices TCF
- **exercise_attempts** - Historique des tentatives
- **user_progress** - Progression par catégorie/niveau

## 🔒 Authentification

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification.

### Headers requis pour les routes protégées

```
Authorization: Bearer <votre_token_jwt>
```

### Exemple de requête

```javascript
fetch('http://localhost:5000/api/users/progress', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## 🧪 Exemples de requêtes

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "firstname": "Jean",
    "lastname": "Dupont",
    "level": "A1"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

### Get exercises

```bash
curl http://localhost:5000/api/exercises?category=grammar&level=A1&limit=10
```

### Submit exercise attempt

```bash
curl -X POST http://localhost:5000/api/exercises/attempt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": 1,
    "exerciseId": "tcf_A1_grammar_001",
    "score": 8,
    "maxScore": 10,
    "percentage": 80,
    "timeSpent": 120,
    "answers": []
  }'
```

## 📁 Structure du projet

```
server/
├── config/
│   ├── database.js          # Configuration PostgreSQL
│   ├── setupDatabase.js     # Script de création schéma
│   └── seedDatabase.js      # Script d'import données
├── controllers/
│   ├── authController.js    # Logique authentification
│   ├── exercisesController.js
│   ├── quizController.js
│   └── usersController.js
├── middleware/
│   └── auth.js              # Middleware JWT
├── routes/
│   ├── auth.js
│   ├── exercises.js
│   ├── quiz.js
│   └── users.js
├── data/
│   └── items.json           # Données exercices
├── .env.example
├── package.json
├── server.js                # Point d'entrée
└── README.md
```

## 🐛 Debugging

### Logs de développement

En mode développement, Morgan affiche tous les logs HTTP :

```
GET /api/exercises 200 45ms
POST /api/auth/login 200 123ms
```

### Logs PostgreSQL

Les requêtes SQL sont loggées avec leur durée d'exécution :

```
✓ Query executée { text: 'SELECT * FROM ...', duration: 12, rows: 25 }
```

## 🚀 Déploiement

### Variables d'environnement en production

```env
NODE_ENV=production
PORT=5000
DB_HOST=your_db_host
DB_NAME=tcf_prep_db
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_very_long_random_secret_key
```

### Recommandations

- Utiliser un reverse proxy (Nginx)
- Activer HTTPS
- Configurer le CORS strictement
- Utiliser des variables d'environnement sécurisées
- Mettre en place des backups PostgreSQL

## 📝 License

MIT - MOHAMMEDI Noureddine
