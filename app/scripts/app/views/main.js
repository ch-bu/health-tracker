define(['backbone', 'app/models/food-model',
  'app/collections/food-collection', 'templates'],
  function(Backbone, FoodModel, FoodCollection, Handlebar) {

  var AppView = Backbone.View.extend({

    el: 'main',

    events: {
      'keyup #food-search': 'searchFood',
    },

    initialize: function() {
      // Init models and collections
      this.model = new FoodModel();
      this.foodCollection = new FoodCollection();
    },

    /**
     * Search for food when user types
     */
    searchFood: function() {
      // Get value from input
      var food = $('#food-search').val();

      // Append food to api url
      this.foodCollection.url = this.foodCollection.apiUrl() + food;

      // Search food
      this.foodCollection.fetch({

        // Send api-key with request
        // beforeSend: sendAuthentication,

        // Add parameters to api request
        data: $.param({results: '0:20', appId: '14f78fa8',
          fields: 'item_name,brand_name,item_description,nf_serving_weight_grams,nf_calories,nf_total_fat,nf_total_carbohydrate,nf_protein,nf_sugars',
          appKey: '05fb77c91338716322dfed86dc63eabc'}),

        success: function(model, response) {
          console.log(response);
        },

        error: function(model, response) {
          console.log(response);
        },
      });
    }

  });

  return AppView;

});


