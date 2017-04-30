Events = new Mongo.Collection( 'events' );

Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let EventsSchema = new SimpleSchema({
  'title': {
    type: String,
    label: 'The title of this event.'
  },
  'start': {
    type: String,
    label: 'When this event will start.'
  },
  'end': {
    type: String,
    label: 'When this event will end.'
  },
  'type': {
    type: String,
    label: 'What type of event is this?',
    allowedValues: [ 'Babault', 'Famille', 'Guest' ]
  },
  'guests': {
    type: Number,
    label: 'The number of guests expected at this event.'
  },
  'author': {
    type: String,
    label: 'Author of the event'
  }
});

Events.attachSchema( EventsSchema );
