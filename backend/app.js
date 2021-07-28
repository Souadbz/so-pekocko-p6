const express = require('express'); /*** importer l'express ***/
const bodyParser = require('body-parser'); /*** importer le bodyParser ***/
const mongoose = require('mongoose'); /*** importer le package mongoose qui facilite les interactions avec notre base de données MongoDB grâce à des fonctions extrêmement utiles ***/
const path = require('path'); /*** accés au chemin des fichiers/repertoires ***/
/*** importer les routes à notre application ***/
const sauceRoutes = require("./routes/sauce"); /*** importer la route sauce ***/
const userRoutes = require('./routes/user'); /*** importer la route user ***/

/*** la connection à la base de donnée MONGODB ***/

mongoose.connect('mongodb+srv://souad-piquante:20210723@cluster0.qhbsk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); /*** créer notre application ***/

/*** Middleware général/ configurer des Headers sur l'objet réponse pour eviter les erreurs du CORS ***/

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); /*** d'accéder à notre API depuis n'importe quelle origine ***/
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); /*** d'ajouter les headers mentionnés aux requêtes envoyées vers notre API ***/
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); /*** d'envoyer des requêtes avec les méthodes mentionnées  ***/
    next();
});
/*** définir la fonction JSON comme middleware global pour l'application ***/
app.use(bodyParser.json());

/*** les routes attendues par le frontend ***/
/*** création d'un middleware pour indiquer à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images ***/
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/sauces", sauceRoutes);
app.use('/api/auth', userRoutes);
/*** exporter notre application pour qu'on puisse y accéder dans les autres fichiers de notre projet ***/
module.exports = app;