import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

// https://themeteorchef.com/tutorials/reactive-calendars-with-fullcalendar
// http://getbootstrap.com/javascript/#modals

let isPast = ( date ) => {
    let today = moment().format();
    return moment( today ).isAfter( date );
};

let getSaison = ( month ) => {
    if(month >= 3 && month <= 8)
      return 'Été';
    else // sinon on est en hiver
      return 'Hiver';
}

let getSaisonNumber = ( month, year ) => {
    let saison = getSaison(month);
    let nbr;

    // le cas particulier
    if(saison == 'Hiver' && month < 3)
        year = year-1;

    // si on est en été
    if(month >= 3 && month <= 8)
        sem = 1;
    else // sinon on est en hiver
        sem = 2;

   if(year < 2017)
       return (0);
   else
       return ( (year-2017)*2 + sem );
}

Template.calendar.onCreated( () => {
    let template = Template.instance();
    template.subscribe( 'events' );
    template.subscribe( 'currentUser' );
});

Template.calendar.helpers({
    /*currentCalendarSemester() {

          var moment = Session.get('getData');
          var month = moment.get('month') + 1;
          var year = moment.get('year');
          var sem;

          console.log(moment);
          console.log(month);
          console.log(year);

          // si on est en été
          if(month >= 3 && month <= 8)
            sem = 1;
          else // sinon on est en hiver
            sem = 2;

          console.log(sem);

          if(year < 2017)
            return(0);
          else {
              return ( (year-2017)*2 + sem );
          }
    },
    currentDate() {
        //return Session.get('getDate');
        template = Template.instance();
        console.log(template);
        return template.data.currentDate;
    }*/
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
            Session.set( 'eventModal', { type: 'add', date: date.format() } );
            $( '#add-edit-event-modal' ).modal( 'show' );
        },

        // Methode eventClick
        eventClick( event ) {
            Session.set( 'eventModal', { type: 'edit', event: event._id } );
            $( '#add-edit-event-modal' ).modal( 'show' );
        }
    });

    $('#Calendar').click(function() {
        let moment = $("#Calendar").fullCalendar('getDate');
        let month = moment.get('month') + 1;
        let year = moment.get('year');
        let saison = getSaison( month );
        let txt;
        if(saison == 'Hiver')
            if(month < 3)
                txt = saison + ' ' + (year-1) + '/' + year;
            else
                txt = saison + ' ' + year + '/' + (year+1);
        else
            txt = saison + ' ' + year;

        txt = txt + ' / Saison n°' + getSaisonNumber(month,year);
        $('#TEST').html( txt );
    });

    $('#Calendar').trigger('click');

    Tracker.autorun( () => {
        Events.find().fetch();
        // relance la méthode events
        $( '#Calendar' ).fullCalendar( 'refetchEvents' );
    });
});
