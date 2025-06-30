# Utiliser une image PHP avec Apache
FROM php:8.4-apache

# Définir le répertoire de travail
WORKDIR /var/www/html

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libpng-dev \
    default-mysql-client

# Activer GD (gestion d'images)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd

# Installer PDO MySQL
RUN docker-php-ext-install pdo_mysql

# Installer Xdebug
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo "xdebug.mode=coverage" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Activer le module rewrite d'Apache
RUN a2enmod rewrite

# Installer Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copier les fichiers de l'application
COPY . .

# Copier le fichier .env.example → .env
RUN cp .env.example .env

# Configurer MySQL dans le .env
RUN echo "DB_CONNECTION=mysql" >> .env && \
    echo "DB_HOST=mysql" >> .env && \
    echo "DB_PORT=3306" >> .env && \
    echo "DB_DATABASE=arosage" >> .env && \
    echo "DB_USERNAME=root" >> .env && \
    echo "DB_PASSWORD=" >> .env

# Autoriser Composer en root
ENV COMPOSER_ALLOW_SUPERUSER=1

# Donner les permissions à Laravel
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Installer les dépendances PHP et JS
RUN composer install

# Installer les dépendances NPM
RUN npm install
RUN npm run build

# Lancer les commandes Laravel
RUN php artisan key:generate
RUN php artisan storage:link

# Copier la config Apache personnalisée
COPY apache-default.conf /etc/apache2/sites-available/000-default.conf

# Copier le script d'initialisation
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Exposer le port HTTP
EXPOSE 80

# Démarrer via le script d'entrypoint
ENTRYPOINT ["entrypoint.sh"]
