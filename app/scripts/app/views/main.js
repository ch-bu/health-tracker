define(['backbone', 'd3', 'foodModel',
  'foodCollection', 'templates'],
  function(Backbone, d3, FoodModel, FoodCollection, Handlebars) {

  var AppView = Backbone.View.extend({

    el: 'main',

    events: {
      'click #food-search-button': 'searchFood',
    },

    initialize: function() {
      // Init models and collections
      this.foodModel = new FoodModel();
      this.foodCollection = new FoodCollection();
    },

    /**
     * Search for food when user types
     */
    searchFood: function() {
      var self = this;

      // Empty list
      this.$el.find('#food-list').empty();

      // Get value from input
      var food = $('#food-search').val();

      // Append food to api url
      this.foodCollection.url = this.foodCollection.apiUrl() + food;

      // Search food
      this.foodCollection.fetch({
        // Add parameters to api request
        data: $.param({results: '0:5', appId: '14f78fa8',
          fields: 'item_name,brand_name,item_description,nf_serving_weight_grams,nf_calories,nf_total_fat,nf_total_carbohydrate,nf_protein,nf_sugars',
          appKey: '05fb77c91338716322dfed86dc63eabc'}),

        success: function(model, response) {
          self.renderSearch();
        },

        error: function(model, response) {
          console.log('error');
        },
      });
    },

    /**
     * Render list of foods that
     * user is looking for
     */
    renderSearch: function() {
      // Get data
      var data = this.foodCollection.toJSON();

      // Calculate domain and range for calories
      // in order to color the food items according
      // to their calories
      var colorScale = d3.scaleLinear()
        .range([0, 1])
        .domain(d3.extent(data, function(d) {
          return d.nf_calories;
        }));

      // Interpolate between green and red
      var interpolationGreenRed = d3.interpolate("#A1C763", "#D7756B");

      // Add food items to search
      d3.select('#food-list')
        .selectAll('li')
        .data(this.foodCollection.toJSON())
        .enter()
        .append('li')
        .text(function(d) {
          return d.item_name;
        })
        .style('background-color', function(d) {
          return interpolationGreenRed(colorScale(d.nf_calories));
        })
        .on('click', this.foodSelected);

    },

    /**
     * Add selected food to database for
     * this day
     */
    foodSelected: function(food) {
      console.log(food);
    }

  });

  return AppView;

});


