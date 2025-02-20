# Utiliser une image PHP avec Apache
FROM php:8.4-apache

# Définir le répertoire de travail
WORKDIR /var/www/html
# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    libsqlite3-dev \
    unzip \
    nodejs \
    npm \
    sqlite3

# Installer uniquement l'extension PHP pour SQLite
RUN docker-php-ext-install pdo_sqlite

# Activer le module rewrite d'Apache
RUN a2enmod rewrite

# Installer Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copier les fichiers du projet Laravel depuis le dossier back
COPY . .

# Copier le fichier .env.example vers .env
RUN cp .env.example .env

# Configurer SQLite dans le fichier .env
RUN echo "DB_CONNECTION=sqlite" >> .env && \
    echo "DB_DATABASE=/var/www/html/database/database.sqlite" >> .env

# Créer le fichier de base de données SQLite
RUN touch database/database.sqlite

#Donner les droits de super utilisateur pour installer composer
ENV COMPOSER_ALLOW_SUPERUSER=1

# Installer les dépendances Composer
RUN composer install

# Installer les dépendances NPM
RUN npm install

# Générer les assets front-end avec Vite
RUN npm run build

# Générer la clé d'application Laravel
RUN php artisan key:generate

# Éfectuer les migrations
RUN php artisan migrate --seed

# Donner les permissions appropriées aux répertoires de stockage et de cache Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database/database.sqlite
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database/database.sqlite

# Copier le fichier de configuration Apache
COPY apache-default.conf /etc/apache2/sites-available/000-default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Apache
CMD ["apache2-foreground"]
