# devtest
This web application uses PHP Lavarel framework and React JavaScript library.

Steps to run the application:
1. Clone the requirement project from the repo or download it as a zip to your workspace.
2. Go into "devtest" directory.
3. Open ".env" file to update database connection according to your environement.
=========
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=test
DB_USERNAME=
DB_PASSWORD=
=========
4. Run command: php artisan serve
5. Open your browser, application is running on: http://127.0.0.1:8000
6. PHPUnit test. Form the applicaiton directory, go to /devtest/vendor/bin directory, run command: phpunit ../../tests/feature/memberTest.php
(the path of memberTest.php maybe different in your system depends on your environment configuration)