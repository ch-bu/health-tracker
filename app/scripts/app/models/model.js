define(['backbone'], function(Backbone) {
  var Model = Backbone.Model.extend({
    initialize: function() {
      console.log('model');
    }
  });

  return Model;
});
