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
      var date = this.currDate.format("YYYY-MM-DD");

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

    initialize: function() {
      // Draw line Chart
      // this.drawLineChart();
    },

    events: {
      'click table i': 'deleteItem',
      'click table': 'renderList',
    },

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

      // Draw line Chart
      this.drawLineChart();
    },

    /**
     * Draw line chart that display's
     * the calory intake over the whole
     * time
     * @return {null}
     */
    drawLineChart: function() {
      // Get all foods
      var foodStorage = JSON.parse(localStorage.getItem('myFoods'));
      console.log(foodStorage);
      ////////////////////
      // Aggregate data //
      ////////////////////

      // Get grouped data
      var aggregatedData = [];

      // Loop over each item
      $.each(foodStorage, function(index, element) {
        // Check if key exists
        if (aggregatedData[element.dateAdded] == undefined) {
          aggregatedData[element.dateAdded] = element.nf_calories;
        } else {
          aggregatedData[element.dateAdded] += element.nf_calories;
        }
      });

      // We need to parse the date for the x axis
      var parseTime = d3.timeParse('%Y-%m-%d');

      var data = [];
      for (var key in aggregatedData) {
        data.push({date: parseTime(key), calories: +aggregatedData[key]});
      }

      /////////////////////
      // Draw line chart //
      /////////////////////

      // Declare variables
      var margin = {top: 20, right: 20, bottom: 10, left: 10};
      var width = document.getElementById('line-chart').offsetWidth;
      var height = window.innerHeight * 0.4;

      // Set attributes to svg
      var svg = d3.select('#line-chart-svg')
        .attr('width', width)
        .attr('height', height);

      // Append g to svg
      var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');



      // Add scales
      var x = d3.scaleTime()
        .rangeRound([0, width])
        .domain(d3.extent(data, function(d) {
          return d.date;
        }));

      var y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain(d3.extent(data, function(d) {
          return d.calories;
        }));

      // Add line
      var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.calories); });

      // Append x axis
      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

      g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y))
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .style('text-anchor', 'end')
        .text('Calories');

      g.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line);
      // console.log(aggregatedData);
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

    /**
     * Render list of all items
     * @return {null}
     */
    renderList: function() {
      var self = this;

      // Grab div
      var foodList = $('#food-items');

      // Change inner html
      foodList.html(MyApp.templates['food-list']({item: self.foods}));
    },

    // Delete selected item from list
    deleteItem: function(item) {

      // Get id from item
      var id = item.currentTarget.id;

      // Remove item from localStorage
      var foodStorage = JSON.parse(localStorage.getItem('myFoods'));

      // Filter array
      var newArray = foodStorage.filter(function(item) {
        // All foods that do not match item id
        if (item.foodId !== id) {
          return item;
        }
      });

      // Update local storage for specific date
      localStorage.myFoods = JSON.stringify(newArray);

      this.renderFoods(this.day);
    },
  });

  return AppView;

});


