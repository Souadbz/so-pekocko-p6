const Sauce = require('../models/Sauce'); /*** importer le modèle sauce ***/
/*** d'importer le package 'file system' de Node pour accéder au differentes opérations liées aux fichiers ainsi on peut gérer les téléchargements et modifications d'images ***/
const fs = require('fs');

/*** POST/ enregistrer et créer une nouvelle sauce ***/
exports.createSauce = (req, res, next) => {

    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; /*** on enleve id de la requete/ le front-end envoie un faux id  ***/
    /*** création d'un objet sauce ***/
    const sauce = new Sauce({
        ...sauceObject,
        /*** récupérer les segments nécessaire de l'URL où se trouve l'image ***/
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save() /*** enregistrer la sauce dans la base de données/ la méthode save renvoie une Promise ***/
        .then(() => res.status(201).json({
            message: 'Objet enregistré !'
        })) /*** reponse au frontend */
        .catch(error => res.status(400).json({
            error
        }));
};

/*** GET/ api/sauces/ récupérer les sauces de la base de donnée MongoDB ***/
exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};
/*** GET/ /api/sauces/:id/ récupérer une sauce ***/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
};
/*** PUT /api/sauces/:id/ modifier la sauce ***/
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? /*** l'utilisation de l'operateur ternaire ou conditionnel pour voir si req.file existe ou pas */
        /*** récupérer les information de la sauce et générer la nouvelle image***/
        /*** si l'image existe ***/
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
            ...req.body
        };
    /*** si il n'existe pas d'image ***/
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'la sauce est modifiée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};
/*** DELETE /api/sauces/:id/ supprimer une sauce ***/
exports.deleteSauce = (req, res, next) => {
    /*** avant la suppression on cherche l'objet pour avoir l'url de l'image et accéder au nom du fichier dans la base de données***/
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            /*** extraire le nom du fichier ***/
            const filename = sauce.imageUrl.split('/images/')[1];
            /*** appeler unlink pour supprimer le fichier ***/
            fs.unlink(`images/${filename}`, () => {
                /*** supprimer la sauce ***/
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'La sauce est supprimée !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            /*** erreur serveur ***/
            error
        }));
};
/*** POST/ api/sauces/:id/like / permet de like ou dislike ***/
exports.likeDislike = (req, res, next) => {
    /*** Si l'utilisateur like la sauce ***/
    if (req.body.like === 1) {
        /*** On ajoute l'utilisateur dans le tableau 'usersLiked' et on incrémente le compteur de 1***/
        Sauce.updateOne({
                _id: req.params.id
            }, {
                $inc: {
                    likes: req.body.like++
                },
                $push: {
                    usersLiked: req.body.userId
                }
            })
            .then((sauce) => res.status(200).json({
                message: 'La sauce est likée !'
            }))
            .catch(error => res.status(400).json({
                error
            }));
    } /*** Si l'utilisateur dislike la sauce ***/
    else if (req.body.like === -1) {
        /*** On ajoute l'utilisateur dans le tableau 'usersDisliked' et on incrémente de 1 ***/
        Sauce.updateOne({
                _id: req.params.id
            }, {
                $inc: {
                    dislikes: (req.body.like++) * -1
                },
                $push: {
                    usersDisliked: req.body.userId
                }
            })
            .then((sauce) => res.status(200).json({
                message: 'la sauce est Dislikée !'
            }))
            .catch(error => res.status(400).json({
                error
            }));
    } else {
        /*** si l'utilisateur annule un like ou un dislike ***/
        Sauce.findOne({
                _id: req.params.id
            })
            .then(sauce => {
                /*** récupérer l'id de l'utilisateur dans le tableau "userLiked" ***/
                if (sauce.usersLiked.includes(req.body.userId)) {
                    /*** on décrémente de -1 un like du tableau "userLiked" ***/
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {
                            $pull: {
                                usersLiked: req.body.userId
                            },
                            $inc: {
                                likes: -1
                            }
                        })
                        .then((sauce) => {
                            res.status(200).json({
                                message: 'Like de la sauce annulé !'
                            })
                        })
                        .catch(error => res.status(400).json({
                            error
                        }))
                    /*** récupérer l'id de l'utilisateur dans le tableau "userDisliked" ***/
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    /*** on décrémente de -1 un dislike du tableau "userDisliked" ***/
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {
                            $pull: {
                                usersDisliked: req.body.userId
                            },
                            $inc: {
                                dislikes: -1
                            }
                        })
                        .then((sauce) => {
                            res.status(200).json({
                                message: 'Dislike de la sauce annulé !'
                            })
                        })
                        .catch(error => res.status(400).json({
                            error
                        }))
                }
            })
            .catch(error => res.status(400).json({
                error
            }));
    }
};