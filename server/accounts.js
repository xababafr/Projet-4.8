import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser(function (options, user) {
    // ajout d'un role pour l'utilisateur (sans le package alaning:roles) et d'un record de jours deja reservés par semestre (y'en a 40, le premier est celui de l'été 2017)
    console.log(user);
    _.extend(user, { role : 'Guest' });
    _.extend(user, { semesters : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
    console.log(user);

    // We still want the default hook's 'profile' behavior.
    if (options.profile)
        user.profile = options.profile;

    return user;
});
