import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

let closeModal = () => {
    $( '#add-edit-event-modal' ).modal( 'hide' );
    $( '.modal-backdrop' ).fadeOut();
};

Template.addEditEventModal.helpers({
    modalType( type ) {
        let eventModal = Session.get( 'eventModal' );
        if ( eventModal ) {
            return eventModal.type === type;
        }
    },
    modalLabel() {
        let eventModal = Session.get( 'eventModal' );

        if ( eventModal ) {
            return {
                button: eventModal.type === 'edit' ? 'Edit' : 'Add',
                label: eventModal.type === 'edit' ? 'Edit' : 'Add an'
          };
        }
    },
    selected( v1, v2 ) {
        return v1 === v2;
    },
    event() {
        let eventModal = Session.get( 'eventModal' );

        if ( eventModal ) {
            return eventModal.type === 'edit' ? Events.findOne( eventModal.event ) : {
                start: eventModal.date,
                end: eventModal.date,
                title: Meteor.user().username
            };
        }
    },
    currentUser() {
        return Meteor.user();
    },
    isDisabled() {
        if(Meteor.user().role == 'Admin')
            return " ";
        else
            return "disabled";
    }
});

Template.addEditEventModal.events({
    'submit form' ( event, template ) {
        event.preventDefault();

        let eventModal = Session.get( 'eventModal' ),
        submitType = eventModal.type === 'edit' ? 'editEvent' : 'addEvent',
        eventItem  = {
            title: template.find( '[name="title"]' ).value,
            start: template.find( '[name="start"]' ).value,
            end: template.find( '[name="end"]' ).value,
            type: template.find( '[name="type"] option:selected' ).value,
            guests: parseInt( template.find( '[name="guests"]' ).value, 10 ),
            comment: template.find( '[name="comment"]' ).value,
            author : Meteor.userId()
        };

        if ( submitType === 'editEvent' ) {
            eventItem._id   = eventModal.event;
        }

        // pour l'ajout, on récupere l'ancienne valeur de la saisn, et on lui rajoute le nommbre de semaines de l'event actuel
        // pour l'edit, c'est plus chaud. On récupère l'ancienne valeur de la saison, on récupère la différence entre le nouvel event et son ancienne version, et on ajoute ça à la saison donnée.
        // dans le cas où une date chevaucherait deux saisons, on considère la date de départ comme etant celle fixant la saison (car de toute façon getSaison et getSaisonNumber se basent sur le mois acutel, et donc sur la date de depart)
        //  pour le remove, c'est assez easy

        Meteor.call( submitType, eventItem, ( error ) => {
          if ( error ) {
              Bert.alert( error.reason, 'danger' );
          }
          else {
              Bert.alert( `Event ${ eventModal.type }ed!`, 'success' );
              closeModal();
          }
        });
    },
    'click .delete-event' ( event, template ) {
      let eventModal = Session.get( 'eventModal' );
      if ( confirm( 'Are you sure? This is permanent.' ) ) {
        Meteor.call( 'removeEvent', eventModal.event, ( error ) => {
        if ( error ) {
            Bert.alert( error.reason, 'danger' );
          } else {
            Bert.alert( 'Event deleted!', 'success' );
            closeModal();
          }
        });
      }
    }
});
