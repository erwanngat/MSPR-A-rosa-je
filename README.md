Pour lancer le back :
Aller sur la branche develop puis cd back
Apres avoir lancer docker desktop, faire docker build -t monImage .
une fois finis faire :
docker run -p <port>:<port> monImage
ex: docker run -p 8080:80 monImage ou encore docker run -p 8000:80 monImage
