# 1. Aller dans le dossier server
cd server

# 2. Installer les dépendances
npm install

# 3. Configurer .env (copier .env.example)
cp .env.example .env
# Puis éditer .env avec vos paramètres PostgreSQL

# 4. Créer la DB et importer les données
npm run db:setup
npm run db:seed

# 5. Démarrer le serveur
npm run dev

# ✅ Backend prêt sur http://localhost:5000