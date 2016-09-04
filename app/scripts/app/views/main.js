define(['backbone', 'app/models/model'], function(Backbone, Model) {

  var AppView = Backbone.View.extend({

    el: '.container',

    initialize: function() {
      console.log('initalize app');
      var model = new Model();
    }

  });

  return AppView;

});


