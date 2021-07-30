# p6-So Pekocko openclassrooms

## Présentation du projet

Je suis développeuse backend freelance et je travaille depuis quelques années sur des
projets web pour des startups ou des grandes entreprises.
La semaine dernière, j'ai reçu un mail me proposant un nouveau projet.
La marque So Pekocko, qui crée des sauces piquantes, connaît un franc succès, en partie
grâce à sa chaîne de vidéos YouTube “La piquante”.
L’entreprise souhaite désormais développer une
application d’évaluation de ses sauces piquantes,
appelée “Piquante”.
Même si l’application deviendra peut-être un magasin
en ligne dans un futur proche, Sophie, la product
owner de So Pekocko, a décidé que le MVP du projet
sera une application web permettant aux utilisateurs
d’ajouter leurs sauces préférées et de liker ou disliker
les sauces ajoutées par les autres utilisateurs.

## Prérecquis

Pour faire fonctionner le projet, vous devez installer :

- NodeJS en version 12.14 ou 14.0
- Angular CLI en version 7.0.2.
- node-sass : attention à prendre la version correspondante à NodeJS. Pour Node 14.0 par exemple, installer node-sass en version 4.14+.
  Sur Windows, ces installations nécessitent d'utiliser PowerShell en tant qu'administrateur.

## Development server

Démarrer ng serve pour avoir accès au serveur de développement. Rendez-vous sur http://localhost:4200/. L'application va se recharger automatiquement si vous modifiez un fichier source.

## Cahier MVP

l’API doit respecter le RGPD et les standards OWASP ;

- le mot de passe des utilisateurs doit être chiffré ;
- 2 types de droits administrateur à la base de données doivent être définis : un accès
  pour supprimer ou modifier des tables, et un accès pour éditer le contenu de la base
  de données ;
- la sécurité de la base de données MongoDB (à partir d’un service tel que MongoDB
  Atlas) doit être faite de telle sorte que le validateur puisse lancer l’application depuis
  sa machine ;
- l’authentification est renforcée sur les routes requises ;
- les mots de passe sont stockés de manière sécurisée ;
- les adresses mails de la base de données sont uniques et un plugin Mongoose
  approprié est utilisé pour s’assurer de leur caractère unique et rapporter des erreurs

## Technologies à utiliser

- framework : Express;
- serveur : NodeJS;
- base de données : MongoDB;
- toutes les opérations de la base de données doivent utiliser le pack Mongoose avec
  des schémas de données stricts
