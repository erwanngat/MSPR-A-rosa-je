FROM node:18

WORKDIR /app

# Copier uniquement le package.json + lock pour l'étape d'install
COPY package*.json ./

# Installer expo-cli
RUN npm install -g expo-cli

# Installer d'abord toutes les deps (avec expo install pour respecter les versions)
RUN npm install && npx expo install

# Puis copier le reste des fichiers
COPY . .

# Exposer port web
EXPOSE 19006

# Lancer Expo en mode web
CMD ["npx", "expo", "start", "--web"]
