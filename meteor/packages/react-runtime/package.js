Package.describe({
  name: 'react-runtime',
  version: '0.13.3_5',
  // Brief, one-line summary of the package.
  summary: 'Facebook\'s React library',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/meteor/react-packages',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  // These are commented out so that the Webpack bundle can provide React
  // instead, so that it can be shared with other Meteor packages that
  // depend on react-runtime.

  // api.use('react-runtime-dev@=0.13.3_4');
  // api.use('react-runtime-prod@=0.13.3_3');
  api.addFiles('react.bundle.js', 'client');
  // api.addFiles('react-runtime.js');

  api.export('React');
});