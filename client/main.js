// main.js

/* CE QU'IL RESTE A FAIRE :

- [OK] comprendre à 100% le code (actuellement : 80%)
- [OK] et [OK] faire en sorte que le type d'evènement corresponde au role de l'utilisateur actuellement (client ET serveur) et pareil pour le username (l'admin  a le droit de changer le typde d'evenement, pas l'utilisateur normal)
- [OK] autoriser le deplacement d'events (et leur edit en general) si le role de l'utilisateur est suffisant ou si  c'est son propre event
- [OK role par defaut] role : admin, babault, famille, guest
- [OK] ajouter des commentaires pour chaque event
- [OK] mettre un indicateur de semestre, pour que cela soit clair (avril, mai, juin, juillet, aout, septembre = été, le reste = hiver) semestre numero 1 = été 2017 (chaque user avec un champ semesters = [0,0,0,0,;..]) ( = nombre de semaines dejà prises sur chaque semestre)
- [OK] quand on ajoute un evenement, on doit pouvoir choisir la date de départ et d'arrivée
- [OK] quand on ajoute un event, on doit avoir un nombre limite de semaines à ajouter par semestre, qui depends surement du role (et également un nombre limite d'events par semestre)
- [OK] si on modifie les dates d'un evenement, reverifier que la limite de semaines / semestre, en fonction du role, n'est pas atteinte

- [PAS ENTIEREMENT OK] tout traduire en français, notamment le formattage des dates
- [OK ??] corriger le bug : quand on edite un event, y'a match failed, mais l'update se fait quand meme
- [CANCELLED?] quand on passe notre souris sur le pseudo d'un utilisateur, ça nous affiche des détails

- [PAS OK] faire en sorte qu'il y ait une priorité par semestre (les babaults d'abord, le reste ensuite) (surement la dernière tâche à faire?!)

- [PAS OK] Page d'administration et de forgot password (donc juste un poil de routes)
- [PAS OK] formulaire d'inscription personnalisé
- [PAS OK] email de verification? (le forgotPassword est dejà là)



- [PAS OK] parfois l'application de "demarre pas" (on dirait qu'il faut qu'abord cliquer sur un jour du mois suivant, et apres tout est ok ,je ne sais pas pourquoi) (c'est aussi le cas quand on se déco/reco, donc c'est à l'initialisation du calendar que y'a un probleme)
c'est ptet lié au fait que y'ait bcp d'appel à indexOfId dès le depart?!
- [PAS OK] les commentaires ne s'affichent pas toujours en placeholder (lors de l'édition), je sais pas trop si c'est normal

*/

/*Template.body.events({
    'submit #method'(event) {
        event.preventDefault();
        console.log('seasonReady');
        Meteor.call('seasonReady', 6, 2019,function(error,retour){
            console.log(error);
            console.log(retour);
        });
        //Meteor.call('getWeeksOfSeason', 'BfvgqChxzBcQqjfpC', '2017-09-01', '2018-03-01');
    }
});*/
