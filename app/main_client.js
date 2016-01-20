import 'babel-polyfill'
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
});

console.log('Running on client only');

Meteor.startup(() => {
  render(<App/>, document.getElementById('app'));
});
