import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser(function (options, user) {
    // ajout d'un role pour l'utilisateur (sans le package alaning:roles)
    console.log(user);
    _.extend(user, { role : 'Guest' });
    console.log(user);

    // We still want the default hook's 'profile' behavior.
    if (options.profile)
        user.profile = options.profile;

    return user;
});
