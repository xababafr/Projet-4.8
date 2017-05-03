import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

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

Template.calendar.helpers({
    currentCalendarSemester() {

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
    }
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

    console.log('CREATION');
    console.log($("#Calendar").fullCalendar('getDate'));

    // bon alors en fait un truc du genre :
    // tracker.autorun(
    //     $(calendar).click(
    //         Session.set(theMoment, fullcalendar.getDate)
    //         (  faire un $(#TEST).html a la palce d'un Session.set, et du coup y'a surement meme pas besoin du tracker autorun!!! )
    //     )
    // )
    // on capte n'importe quel click sur le calendrier, et à chaque click,
)
)

    // on passe le moment en variable réactive?! nan mais naaan
    var moment = $("#Calendar").fullCalendar('getDate');
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
      $('#TEST').html(0);
    else {
        $('#TEST').html( (year-2017)*2 + sem );
    }

    //this.data.currentDate = $("#Calendar").fullCalendar('getDate');
    //this.data.gateau = "gateau";

    //Session.set('getDate',($("#Calendar").fullCalendar('getDate')));

    Tracker.autorun( () => {
        Events.find().fetch();
        // relance la méthode events
        $( '#Calendar' ).fullCalendar( 'refetchEvents' );
    });
});
