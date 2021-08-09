# Installation:

- Exécuter la commande `npm install` pour installer tous les modules nécessaires au fonctionnement de l'application.
- chargez le package nodemon : `npm install -g nodemon`
- lancez le serveur: `nodemon server`
- Exécution de l’api sur http://localhost:3000

## Indication:

Avant d'accéder à l'application, vous devrez créer un fichier d'environnement nommé `.env` dans le répertoire racine du dossier backend.
Dans le fichier `.env`, ajoutez vos variables d'environnement comme ci-dessous :

**1- informations base de données (app)**

DB_USERNAME='Nom de L'utilisateur MongoDB'

DB_PASSWORD='mot de passe de l'utilisateur MongoDB'

DB_HOST='nom du cluster et lien MongoDB'

DB_Name='nom de la première base de données'

**2- authentification/ Clé de sécurité TOKEN**

SECRET_KEY='clé secrète du token qui doit être difficile à pirater'

**3- la clé secrète pour sécuriser les emails**

EMAILSECRET_KEY='clé secrète longue et difficle à pirater pour crypter les emails'
