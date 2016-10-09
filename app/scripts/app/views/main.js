define(['backbone', 'd3', 'foodModel',
  'foodCollection', 'templates', 'moment'],
  function(Backbone, d3, FoodModel, FoodCollection, Handlebars, moment) {

  var AppView = Backbone.View.extend({

    el: 'main',

    events: {
      'click #food-search-button': 'searchFood',
      'click #previous-day': 'previousDay',
      'click #next-day': 'nextDay',
    },

    initialize: function() {
      // Init models and collections
      this.foodModel = new FoodModel();
      this.foodCollection = new FoodCollection();
      this.foodView = new FoodView();

      // Init date for data
      this.currDate = moment();

      // Render food
      this.foodView.renderFoods(this.currDate);

      // Add current date to heading
      $('#today').html(moment().format("MMMM DD YYYY"));
    },

    // Set curr day to day before current day
    previousDay: function() {
      this.currDate.subtract(1, "days");
      this.foodView.renderFoods(this.currDate);
    },

    // Add a day to current day
    nextDay: function() {
      this.currDate.add(1, "days");
      this.foodView.renderFoods(this.currDate);
    },

    /**
     * Search for food when user pushes
     * search button
     */
    searchFood: function() {
      var self = this;

      // Empty list
      this.$el.find('#food-list').empty();

      // Get value from input
      var food = $('#food-search').val();

      // Append food to api url
      this.foodCollection.url = this.foodCollection.apiUrl() + food;

      // Replace button with loading template
      $('#food-search-button').replaceWith(
        MyApp.templates['loading-ring']());

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
      var self = this;

      // Remove loading ring
      $('#loading-ring').replaceWith(
        MyApp.templates['food-search-button']());

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
      var interpolationGreenRed = d3.interpolate("#26a69a", "#D7756B");

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
        .on('click', function(food, day) {
          self.foodSelected(food, self);
        });
    },

    /**
     * Add selected food to database for
     * this day
     */
    foodSelected: function(food, self) {
      ////////////////////////////////
      // Store food in localstorage //
      ////////////////////////////////

      // Get today's date
      var date = moment().format("YYYY-MM-DD");

      // Add id to storedFood
      food.foodId = "food_" + Math.floor((Math.random() * 1e+20) + 1);

      // Add date added to storedFood
      food.dateAdded = date;

      // Turn localStorage to JSON object
      var storedFood = JSON.parse(localStorage.getItem('myFoods'));

      // Push new food to stored foods
      storedFood.push(food);

      // Update local storage for specific date
      localStorage.myFoods = JSON.stringify(storedFood);

      //////////////////////////////////
      // Add food to foodTracker list //
      //////////////////////////////////

      // Get trackedFood
      var trackedFood = JSON.parse(localStorage.getItem('foodTracker'));

      // Check if food for this day exists and add calories
      if (trackedFood[date] === null) {
        trackedFood[date] = food.nf_calories;
      }

      // Add calories to current day
      trackedFood[date] = trackedFood[date] + food.nf_calories;

      // Save added calories for this day
      localStorage.setItem('foodTracker', JSON.stringify(trackedFood));

      // Render foods with added item
      self.foodView.renderFoods(self.currDate);
    },



  });

  var FoodView = Backbone.View.extend({
    el: '#food-display',

    /**
     * Render all food data for view
     * @return {null}
     */
    renderFoods: function(day) {
      // Save day variables in foodView scope
      this.dayFormatted = day.format("YYYY-MM-DD");
      this.day = day;

      // Get all foods for current date
      this.foods = this.getFoodsCurrDate(this.dayFormatted);

      // Change heading
      this.changeHeading();

      // Render food list where items can be deleted
      this.renderList();
    },

    /**
     * Change date in heading
     * @return {null}
     */
    changeHeading: function() {
      // Grab heading
      var heading = $('#today');

      // Change html of heading
      heading.html(this.day.format("MMMM DD YYYY"));
    },

    /**
     * Get list of foods for a
     * specific day
     * @param  {Object} day     moment object of date
     * @return {Object} foods   List of foods
     */
    getFoodsCurrDate: function(day) {
      // Read data from local storage
      var foodStorage = JSON.parse(localStorage.getItem('myFoods'));

      // Grep items for specific day
      var foods = $.grep(foodStorage, function(e){ return e.dateAdded == day; });

      return foods;
    },

    renderList: function() {
      console.log(this.foods);
    }
  });

  return AppView;

});


