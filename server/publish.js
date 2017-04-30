Meteor.publish('events', function() {
    return Events.find();
});

Meteor.publish('currentUser', function() {
    return Meteor.users.find(this.userId);
});
