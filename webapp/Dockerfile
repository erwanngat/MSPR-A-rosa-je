# Utiliser l'image Node.js officielle
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et package-lock.json (ou yarn.lock si tu utilises Yarn) dans le conteneur
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier tous les fichiers de l'application dans le conteneur
COPY . .

# Exposer le port sur lequel l'application React fonctionne
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
