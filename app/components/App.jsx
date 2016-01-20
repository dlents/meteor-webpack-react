/* global ReactMeteorData getMeteorData */
import React, { Component } from 'react';
import { render } from 'react-dom'
import reactMixin from 'react-mixin';
import BlazeTemplate from './BlazeTemplate';
import { Users, Posts } from 'collections';

import CSSModules from 'react-css-modules';
import styles from './stylesheets/App.scss';


Meteor.call('sayHello', function(err, res) {
  console.log(res);
});

const Template = {
  loginButtons: 'any'
};

@CSSModules(styles)
@reactMixin.decorate(ReactMeteorData)
class App extends Component {
  constructor(props) {
    super(props)
  }

  getMeteorData() {
    return {
      users: Users.find()
               .fetch()
    };
  }

  render() {
    let userCount = Users.find()
      .fetch().length;
    let postsCount = Posts.find()
      .fetch().length;

    return (
      <div styleName="root">
        <BlazeTemplate template={Template.loginButtons}/>
        <h1>Hello Webpack!</h1>
        <p>There are {userCount} users in the Minimongo (login to change)</p>
        <p>There are {postsCount} posts in the Minimongo (autopublish removed)</p>
      </div>
    );
  }
}

export default App
// export default CSSModules(App, styles)
