import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// la limite de weeks par saison en fonction du role
let getLimit = (role) => {
    let limit;
    if(role == "Admin" || role == "Babault")
        limit = 4;
    else
        limit = 1.5;
    return limit;
}

// les frontières du semestre courant, en fonction du mois et de l'année actuelle
let getSeasonBounds = (month, year) => {
    // dates du semestre de l'event actuel
    if(month >= 3 && month <= 8) {
        startSeason = year + '-03-01';
        endSeason = year + '-09-01';
    }
    else {
        if(month < 3) {
            startSeason = (year-1) + '-09-01';
            endSeason = year + '-03-01';
        }
        else {
            startSeason = year + '-09-01';
            endSeason = (year+1) + '-03-01';
        }
    }
    return ({start: startSeason, end : endSeason});
}

let indexOfId = (array, id) => {
    console.log('appel de indexOfId');
    for(var i = 0; i < array.length; i++ ) {
        let el = array[i];
        let idbis = el._id;

        // egalité entre les strings, l'égalité normale ne fonctionnait pas
        if(id.localeCompare(el._id) == 0) {
            return (i);
        }
    }
    return (-1);
}

Meteor.methods({

  // ------------------------------------
  // ------------ ADD METHOD ------------
  // ------------------------------------

  addEvent( event ) {
    check( event, {
      title: String,
      start: String,
      end: String,
      type: String,
      guests: Number,
      comment : Match.Optional( String ),
      author : String
    });

    let user = Meteor.user();
    let startMoment = moment(event.start);
    let endMoment = moment(event.end);
    let month = startMoment.month();
    let year = startMoment.year();

    // LIMITES PAR SAISON
    let limit = getLimit(user.role);
    let bounds = getSeasonBounds(month, year);

    if(startMoment.isAfter(endMoment))
        throw new Meteor.Error( '500', `Erreur de dates` );

    // le nombre de semaines de l'evenement que l'on veux rajouter
    let week = endMoment.diff(startMoment,'week', true);

    let exceptionExterieure = '';

    if(event.title == user.username) {
        Meteor.call('getWeeksOfSeason',user._id,bounds.start,bounds.end,function(error,retour){
            console.log(retour);
            // on rajoute l'event potentiel dans les données
            if( ((retour.events + 1) < 6) && ((retour.weeks + week) < limit) ) {
                try {
                  //return Events.insert( event );
                  Events.insert( event );
                }
                catch ( exception ) {
                  exceptionExterieure = `${ exception }` ;
                }
            }
            else
                // si on throw les erreurs à l'interieur de ce meteor.call, l'erreur est dans ce dernier, pas dans le meteor.call parent, ce qui veux dire que Bert ne récupère par l'erreur et l'affiche donc pas. j'utilise une variable "exterieure" pour lancer ces erreurs depuis le call parent
                exceptionExterieure = `Vous avez dépassé la limite de réservations par saison (6 reservations par saison max. ${ limit } semaines par saisons max.)`;
        });
        if(exceptionExterieure != '')
            throw new Meteor.Error( '500', exceptionExterieure );
    }
    else
        throw new Meteor.Error( '500', `${ exception }` );
  },

  // -------------------------------------
  // ------------ EDIT METHOD ------------
  // -------------------------------------

  editEvent( event ) {
    check( event, {
      _id: String,
      title: Match.Optional( String ),
      start: String,
      end: String,
      type: Match.Optional( String ),
      guests: Match.Optional( Number ),
      comment : Match.Optional( String ),
      author : Match.Optional( String )
    });

    // l'evenement pas encore modifié dans la bdd
    let actualEvent = Events.findOne({'_id' : event._id});
    let user = Meteor.user();

    let startMoment = moment(event.start);
    let endMoment = moment(event.end);

    let actualStartMoment = moment(actualEvent.start);
    let actualEndMoment = moment(actualEvent.end);

    let month = startMoment.month();
    let year = startMoment.year();

    // LIMITES PAR SAISON
    let limit = getLimit(user.role);
    let bounds = getSeasonBounds(month, year);

    if(startMoment.isAfter(endMoment))
        throw new Meteor.Error( '500', `Erreur de dates` );

    // le nombre de semaines de l'objet event, qui est l'event voulant remplacer l'ancien dans la bdd
    let duree1 = endMoment.diff(startMoment,'week', true);
    // le nombre de semaines de l'event actuel, encore présent dans la bdd pour le moment
    let duree2 = actualEndMoment.diff(actualStartMoment,'week', true);
    let week = duree1 - duree2;
    console.log(week);

    let exceptionExterieure = '';

    // on a le droit d'editer un event que si c'est le notre ou que l'on est un admin
    if(user.role == "Admin" || actualEvent.author == user._id) {
        Meteor.call('getWeeksOfSeason',user._id,bounds.start,bounds.end,function(error,retour){
            console.log(retour);
            if( (retour.events < 6) && ((retour.weeks + week) < limit) ) {
                try {
                  return Events.update( event._id, {
                      $set: event
                  });
                }
                catch ( exception ) {
                    exceptionExterieure = `/!\\ add : ${ exception }`;
                }
            }
            else
                exceptionExterieure = `Vous avez dépassé la limite de réservations par saison (6 reservations par saison max. ${ limit } semaines par saisons max.)`;
        });
        if(exceptionExterieure != '')
            throw new Meteor.Error( '500', exceptionExterieure );

    }
    else
        throw new Meteor.Error( '500', 'Vous n\'avez pas les droits nécessaires' );

  },

  // ---------------------------------------
  // ------------ REMOVE METHOD ------------
  // ---------------------------------------

removeEvent( event ) {
    check( event, String );

    // l'evenement pas encore modifié dans la bdd
    let actualEvent = Events.findOne({'_id' : event});
    let user = Meteor.user();

    // on a le droit de supprimer un event que si c'est le notre ou que l'on est un admin
    if(user.role == "Admin" || actualEvent.author == user._id) {
        try {
            return Events.remove( event );
        }
        catch ( exception ) {
            throw new Meteor.Error( '500', `/!\\ edit : ${ exception }` );
        }
    }
    else
        throw new Meteor.Error( '500', 'Vous n\'avez pas les droits nécessaires' );

  },

  // je met userId en parametre car ce n'est pas genant, et car cette fonction pourrait dans
  // le futur etre appellée dans un autre cas que pour l'utilisateur actuel
  // cette méthode renvoi le nombre de semaines occupés par l'utilisateur userId dans le semestre défini par startSeason et endSeason
  getWeeksOfSeason( userId, startSeason, endSeason ) {
      check(userId, String);
      check(startSeason, String);
      check(endSeason, String);

      let data = Events.find({
          'start' : { $gte : startSeason, $lt: endSeason },
          'author' : userId
      }).fetch();

      let weeks = 0;
      let i = 0;

      _.each(data, function(doc) {

         let startMoment = moment(doc.start);
         let endMoment = moment(doc.end);

         // seul probleme : avec cette méthode, un event d'une seule journee ne pese "rien", et on peux donc reserver tout un semestre en faisant jour par jour. Pour contrer cela, mettons une limite d'events par semestre par personne.
         let diff = endMoment.diff(startMoment,'week', true);
         weeks += diff;
         i += 1;

      });

      return( {weeks : weeks, events : i} );

  },

  // si chaque Babault de la bdd a réservé au mois un event dans le semestre concerné, l'indicateur passe de bloqué à débloqué, et les autres peuvent réserver. Si on est un admin, on peux toujours réserver.
  seasonReady( month, year ) {
      check(month, Match.Integer);
      check(year, Match.Integer);

      if(Meteor.user().role == 'Admin')
          return true;

      let bounds = getSeasonBounds(month,year);

      // les id de tous les babaults
      let babaults = Meteor.users.find({'role' : 'Babault'}, { fields: { _id: 1 } }).fetch();

      let events = Events.find({
          'start' : { $gte : bounds.start, $lt: bounds.end }
      }).fetch();

      _.each(events,function(event) {
          let index = indexOfId(babaults,event.author);

          if(index != -1) {
              console.log('splice!');
              babaults.splice(index,1);
          }
      });

      return (babaults.length == 0);
  }

});
