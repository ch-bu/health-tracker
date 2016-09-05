define(['underscore', 'backbone'], function(_, Backbone) {

  var FoodModel = Backbone.Model.extend({

    initialize: function() {
      console.log('food model');
    }
  });

  return FoodModel;
});
