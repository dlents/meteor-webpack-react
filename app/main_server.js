import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './components/App';
import { Posts } from './collections';
import { createPosts, createUsers } from './fixtures';
// we don't call this so we're just importing to initialize file
import './method_example';

// these will only run on the sever since we only 'import' them in main_server.js

if (!Posts.find()
    .fetch().length) {
  createPosts();
  createUsers();
}

// smoke test that these are present
Npm.require('fs');
Assets;
//require('fs').readFile.call;

console.log('\n\nRunning on server only');
console.log('There are # posts:',
  Posts.find()
    .fetch().length);
console.log('React SSR:', ReactDOMServer.renderToString(<App/>));
