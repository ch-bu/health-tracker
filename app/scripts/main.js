/*global require*/
'use strict';

// https://github.com/tastejs/todomvc/tree/gh-pages/examples/backbone_require

require.config({
  baseUrl: 'scripts',

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  },

  paths: {
    underscore: 'vendor/underscore',
    jquery: 'vendor/jquery',
    backbone: 'vendor/backbone',
    d3: 'vendor/d3',
    mainView: 'app/views/main',
  },
});


require(['backbone', 'mainView'], function(Backbone, AppView) {
  new AppView();
});
