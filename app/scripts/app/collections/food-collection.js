/* global define: false */

define(['underscore', 'backbone', 'foodModel'],
  function(_, Backbone, FoodModel) {
    var FoodCollection = Backbone.Collection.extend({
      model: FoodModel,

      initialize: function() {
      },

      apiUrl: function() {
        return 'https://api.nutritionix.com/v1_1/search/';
      },

      parse: function(response) {
        return response.hits;
      }
    });

    return FoodCollection;
  });
