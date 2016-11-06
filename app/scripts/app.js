/*global require*/
'use strict';

// https://github.com/tastejs/todomvc/tree/gh-pages/examples/backbone_require

require.config({

  paths: {
    underscore: 'vendor/underscore',
    jquery: 'vendor/jquery',
    backbone: 'vendor/backbone',
    d3: 'vendor/d3',
    handlebars: 'vendor/handlebars',
    idb: 'vendor/idb',
    moment: 'vendor/moment',
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

  // Set myFoods storage if non-existent
  if (localStorage.getItem('myFoods') === null) {
    localStorage.setItem('myFoods', '[]');
  }

  // Set date storage of food if not existent
  if (localStorage.getItem('foodTracker') === null) {
    localStorage.setItem('foodTracker', '{}');
  }


  new AppView();

  // Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };
});
