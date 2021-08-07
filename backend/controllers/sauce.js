const Sauce = require('../models/Sauce'); /*** importer le modèle sauce ***/
/** d'importer le package 'file system' de Node pour accéder aux differentes opérations liées aux systèmes de fichiers
 *  ainsi on peut gérer les téléchargements et suppressions d'images ***/
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
            message: 'la sauce est enregistrée !'
        })) /*** reponse au frontend/ nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.***/
        .catch(error => res.status(400).json({
            error
        }));
};

/*** GET/ api/sauces/ récupérer les sauces de la base de donnée MongoDB ***/
exports.getSauces = (req, res, next) => {
    Sauce.find() /*** find va nous retourner une Promise ***/
        /*** la base de données va retourner le tableau des sauces/reponse 200: ok/
         *  on récupére le tableau des sauces depuis la base de données ***/
        .then(sauces => res.status(200).json(sauces))
        /*** nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.***/
        .catch(error => res.status(400).json({
            error
        }));
};
/*** GET/ /api/sauces/:id/ récupérer une sauce ***/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id /*** id de la sauce est le même que l'id du paramètre de la requête ***/
        })
        .then(sauce => res.status(200).json(sauce)) /*** reponse ok ***/
        /*** nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 404 pour indiquer que la sauce n'a pas été trouvé.***/
        .catch(error => res.status(404).json({
            error
        }));
};
/*** PUT /api/sauces/:id/ modifier la sauce ***/
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? /*** l'utilisation de l'objet sauceObject avec l'operateur ternaire ou conditionnel pour voir si req.file existe ou pas */
        /*** récupérer les informations de la sauce et générer la nouvelle image si l'image existe/modification de l'image ***/
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
            ...req.body /*** sinon on récupérer la sauce dans le corps de la requête avec les informations modifiés/sans modifier l'image ***/
        };
    Sauce.updateOne({
            _id: req.params.id /*** id de la sauce est le même que l'id du paramètre de la requête ***/
        }, {
            ...sauceObject,
            /*** la nouvelle sauce ***/

            _id: req.params.id /*** id de la sauce est le même que l'id du paramètre de la requête ***/
        })
        .then(() => res.status(200).json({
            /*** reponse ok ***/
            message: 'la sauce est modifiée !'
        })) /*** nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.***/
        .catch(error => res.status(400).json({
            error
        }));
};
/*** DELETE /api/sauces/:id/ supprimer une sauce ***/
exports.deleteSauce = (req, res, next) => {
    /*** avant la suppression on cherche l'objet pour avoir l'url de l'image et donc on va
     *  accéder au nom du fichier dans la base de données***/
    Sauce.findOne({
            _id: req.params.id /*** id de la sauce est le même que l'id du paramètre de la requête ***/
        })
        .then(sauce => {
            /*** extraire le nom du fichier dans l'objet sauce***/
            const filename = sauce.imageUrl.split('/images/')[1];
            /*** appeler unlink pour supprimer le fichier ***/
            fs.unlink(`images/${filename}`, () => {
                /*** puis on va supprimer aussi la sauce de la base de données***/
                Sauce.deleteOne({
                        _id: req.params.id /*** id de la sauce est le même que l'id du paramètre de la requête ***/
                    })
                    .then(() => res.status(200).json({
                        /*** reponse ok ***/
                        message: 'La sauce est supprimée !'
                    })) /*** nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.***/
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
                _id: req.params.id /*** id de la sauce est le même que l'id du paramètre de la requête ***/
            }, {
                $inc: {
                    /*** l'opérateur $inc permet d'incrémenter une valeur ***/
                    likes: req.body.like++
                },
                $push: {
                    /*** envoyer le like au tableau userLiked ***/
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
                _id: req.params.id /*** id de la sauce est le même que l'id du paramètre de la requête ***/
            }, {
                $inc: {
                    /*** l'opérateur $inc permet d'incrémenter une valeur ***/
                    dislikes: (req.body.like++) * -1
                },
                $push: {
                    /*** envoyer le like au tableau userDisliked ***/
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
                _id: req.params.id /*** id de la sauce est le même que l'id du paramètre de la requête ***/
            })
            .then(sauce => {
                /*** récupérer l'id de l'utilisateur dans le tableau "userLiked" ***/
                if (sauce.usersLiked.includes(req.body.userId)) {
                    /*** modification/on décrémente de -1 un like du tableau "userLiked" ***/
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {
                            $inc: {
                                likes: -1
                            },
                            $pull: {
                                usersLiked: req.body.userId
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
                    /*** modification/on décrémente de -1 un dislike du tableau "userDisliked" ***/
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {
                            $inc: {
                                dislikes: -1
                            },
                            $pull: {
                                usersDisliked: req.body.userId
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