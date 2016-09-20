define(['underscore', 'backbone', 'app/models/food-model'],
  function(_, Backbone, FoodModel) {

  var FoodCollection = Backbone.Collection.extend({

    initialize: function() {
      console.log('food collection');
    },

    apiUrl: function() {
      return 'https://api.nutritionix.com/v1_1/search/';
    },

    parse: function(response) {
      return response.fields;
    }
  });

  return FoodCollection;
});
