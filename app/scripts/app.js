/*global require*/
'use strict';

// https://github.com/tastejs/todomvc/tree/gh-pages/examples/backbone_require

require.config({
  baseUrl: 'scripts',

  paths: {
    underscore: 'vendor/underscore',
    jquery: 'vendor/jquery',
    backbone: 'vendor/backbone',
    d3: 'vendor/d3',
    handlebars: 'vendor/handlebars',
    mainView: 'app/views/main',
    templates: 'templates',
    foodCollection: 'app/collections/food-collection',
    foodModel: 'app/models/food-model',
  },

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});


require(['backbone', 'mainView'], function(Backbone, AppView) {
  new AppView();
});
