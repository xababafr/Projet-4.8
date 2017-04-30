import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// username et email obligatoires
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});
