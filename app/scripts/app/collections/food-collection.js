define(['underscore', 'backbone', 'app/models/food-model'], function(_, Backbone, FoodModel) {

  var FoodCollection = Backbone.Collection.extend({

    initialize: function() {
      console.log('food collection');
    },

    url: 'https://api.nutritionix.com/v1_1/search'
  });

  return FoodCollection;
});
