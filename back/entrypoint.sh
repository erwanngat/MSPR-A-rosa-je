#!/bin/bash

set -e

echo "⏳ En attente de la base de données..."

until mysqladmin ping -h mysql --silent; do
  sleep 1
done

echo "La base de données est prête. Lancement des migrations..."

php artisan migrate:fresh --seed
php artisan storage:link

echo "🚀 Lancement de Apache"
exec apache2-foreground
