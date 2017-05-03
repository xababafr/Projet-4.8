import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({

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

    if(event.title == user.username) {
        try {
          return Events.insert( event );
        } catch ( exception ) {
          throw new Meteor.Error( '500', `${ exception }` );
        }
    }
    else
        throw new Meteor.Error( '500', `${ exception }` );
  },

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

    // on a le droit d'editer un event que si c'est le notre ou que l'on est un admin
    if(user.role == "Admin" || actualEvent.author == user._id) {
        try {
          return Events.update( event._id, {
              $set: event
          });
        }
        catch ( exception ) {
            throw new Meteor.Error( '500', `/!\\ add : ${ exception }` );
        }
    }
    else
        throw new Meteor.Error( '500', 'Vous n\'avez pas les droits nécessaires' );

  },

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

  }

});
