define(['backbone', 'app/models/food-model',
  'app/collections/food-collection'], function(Backbone, FoodModel, FoodCollection) {

  var AppView = Backbone.View.extend({

    el: 'main',

    events: {
      'keydown #food-search': 'searchFood',
    },

    initialize: function() {
      console.log('initalize app');
      var model = new FoodModel();
      var foodCollection = new FoodCollection();
      console.log(foodCollection);
    },

    searchFood: function() {
      console.log('food');
    }

  });

  return AppView;

});


