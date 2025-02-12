# MSPR-A-rosa-je

Pour le back:

Requirements:
Composer
PHP
Node.js and NPM

Install:
# Clone this repository
$ git clone https://github.com/erwanngat/MSPR-A-rosa-je

# Go into the repository
$ cd MSPR-A-rosa-je/back

# Install dependencies
$ npm install
$ composer install

# Duplicate .env.exemple into .env

# Generate your key
$ php artisan key:generate

# Migrate the database
$ php artisan migrate --seed

# Start your local server 
$ php artisan serve

# Compile assets
$ npm run dev
