define(['underscore', 'backbone'], function(_, Backbone) {

  var FoodModel = Backbone.Model.extend({

    initialize: function() {
    },

    parse: function(response) {
      return response.fields;
    }
  });

  return FoodModel;
});
