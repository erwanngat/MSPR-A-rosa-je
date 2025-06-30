#!/bin/bash

# Attendre que MySQL soit prêt
until mysqladmin ping -h"$DB_HOST" --silent; do
  echo "⏳ En attente de la base de données..."
  sleep 2
done

echo "Base de données détectée. Lancement des commandes Laravel..."

# Lancer les commandes Laravel
php artisan migrate:fresh --seed
php artisan storage:link

# Lancer Apache
exec apache2-foreground
