import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// https://themeteorchef.com/tutorials/reactive-calendars-with-fullcalendar
// http://getbootstrap.com/javascript/#modals

let isPast = ( date ) => {
    let today = moment().format();
    return moment( today ).isAfter( date );
};

Template.calendar.onCreated( () => {
    let template = Template.instance();
    template.subscribe( 'events' );
    template.subscribe( 'currentUser' );
});

Template.calendar.onRendered( () => {
    // meme genre de definition que les helpers
    $( '#Calendar' ).fullCalendar({
        // Methode events()
        events( start, end, timezone, callback ) {
            let data = Events.find().fetch().map( ( event ) => {
                event.editable = !isPast( event.start );
                return event;
            });

            if ( data ) {
                // une fois que l'on a récupéré les données
                // on les retransmet à fullcalendar en utilisant le callback
                callback( data );
            }
        },

        // Methode eventRender
        eventRender( event, element ) {
            element.find( '.fc-content' ).html(
                `<h4>${ event.title }</h4>
                 <p class="guest-count">${ event.guests } Guests</p>
                 <p class="type-${ event.type }">#${ event.type }</p>
                `
            );
        },

        eventDrop( event, delta, revert ) {
            let date = event.start.format();
            if ( !isPast( date ) ) {
                let update = {
                  _id: event._id,
                  start: date,
                  end: date
                };

                Meteor.call( 'editEvent', update, ( error ) => {
                    if ( error ) {
                        Bert.alert( error.reason, 'danger' );
                    }
                });
            }
            else {
                revert();
                Bert.alert( 'Sorry, you can\'t move items to the past!', 'danger' );
            }
        },

        // Methode dayClick
        dayClick( date ) {
            console.log('DAYCLICK');
            Session.set( 'eventModal', { type: 'add', date: date.format() } );
            $( '#add-edit-event-modal' ).modal( 'show' );
        },

        // Methode eventClick
        eventClick( event ) {
            console.log('EVENTCLICK');
            Session.set( 'eventModal', { type: 'edit', event: event._id } );
            $( '#add-edit-event-modal' ).modal( 'show' );
        }
    });

    Tracker.autorun( () => {
        Events.find().fetch();
        // relance la méthode events
        $( '#Calendar' ).fullCalendar( 'refetchEvents' );
    });
});
