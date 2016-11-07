/* global localStorage: false, console: false, $: false, define: false,
document: false, window: false, MyApp: false */

define(['backbone', 'd3', 'foodModel',
  'foodCollection', 'templates', 'moment'],
  function(Backbone, d3, FoodModel, FoodCollection, Handlebars, moment) {
    // Create FoodView
    var FoodView = Backbone.View.extend({
      el: '#food-display',

      initialize: function(currDate) {
        // Save current date
        this.day = currDate;

        // Draw line Chart
        this.drawLineChart();

        // Draw pies
        this.drawPie('#fatPie', 'fat', 'fatArc');
        this.drawPie('#carboPie', 'carbohydrates', 'carboArc');
        this.drawPie('#proteinPie', 'protein', 'proteinArc');
      },

      events: {
        'click table i': 'deleteItem',
        'click table': 'renderList'
      },

      /**
       * Render all food data for view
       * @param {Object} day Day object
       */
      renderFoods: function(day) {
        // Save day variables in foodView scope
        this.dayFormatted = day.format('YYYY-MM-DD');
        this.day = day;

        // Get all foods for current date
        this.foods = this.getFoodsCurrDate(this.dayFormatted);

        // Change heading
        this.changeHeading();

        // Render food list where items can be deleted
        this.renderList();

        // Draw line Chart
        this.updateChart();

        // Update fat chart
        this.updatePie('#fatArc', 'fat');
        this.updatePie('#carboArc', 'carbohydrates');
        this.updatePie('#proteinArc', 'proteins');
      },

      /**
       * Gets well formed data from localStorage
       * @return {Array} Returns the data of calories per day
       */
      getChartData: function() {
        // Get all foods
        var foodStorage = JSON.parse(localStorage.getItem('myFoods'));

        // Aggregate data

        // Get grouped data
        var aggregatedData = [];

        // Loop over each item
        $.each(foodStorage, function(index, element) {
          // Check if key exists
          if (aggregatedData[element.dateAdded] === undefined) {
            aggregatedData[element.dateAdded] = element.nf_calories;
          } else {
            aggregatedData[element.dateAdded] += element.nf_calories;
          }
        });

        // We need to parse the date for the x axis
        var parseTime = d3.timeParse('%Y-%m-%d');

        // Init final data array
        var data = [];

        // Loop over every day in data
        // we need to restructure the data so that we have
        // objects inside the array
        var key = null;
        if (aggregatedData) {
          for (key in aggregatedData) {
            if (key) {
              // Init macronutritions for each
              // day anew
              var proteins = 0;
              var fat = 0;
              var carbohydrates = 0;
              var total = 0;

              //  Get each item for specific day
              for (var i = 0; i < foodStorage.length; i++) {
                var element = foodStorage[i];

                if (element.dateAdded === key) {
                  // Add grams
                  proteins += element.nf_protein;
                  fat += element.nf_total_fat;
                  carbohydrates += element.nf_total_carbohydrate;
                  total += element.nf_protein + element.nf_total_fat +
                           element.nf_total_carbohydrate;
                }
              }

              // Add data for current day
              data.push({date: parseTime(key),
                         calories: Number(aggregatedData[key]),
                         proteins: proteins / total,
                         fat: fat / total,
                         carbohydrates: carbohydrates / total});
            }
          }
        }

        /**
         * Sort data by ascending order
         * @param {Object} a a date
         * @param {Object} b another date
         * @return {Number} date
         */
        function sortByDateAscending(a, b) {
          // Dates will be cast to numbers automagically:
          return a.date - b.date;
        }

        // Sort data
        data.sort(sortByDateAscending);

        // Return data
        return data;
      },

      /**
       * Draw line chart that display's
       * the calory intake over the whole
       * time
       */
      drawLineChart: function() {
        var self = this;

        // Get data
        var data = this.getChartData();

        // if (isNaN(data[0].calories)) {
        //   data.slice(1, data.length);
        // }
        // data.slice(1, data.length);
        // console.log(data);

        // Declare variables
        var margin = {top: 20, right: 80, bottom: 40, left: 55};
        var width = document.getElementById('line-chart').offsetWidth -
          margin.left - margin.right;
        this.height = window.innerHeight * 0.4 - margin.top - margin.bottom;

        // Set attributes to svg
        this.svg = d3.select('#line-chart-svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', this.height + margin.top + margin.bottom);

        // Append g to svg
        this.g = this.svg.append('g')
          .attr('transform', 'translate(' + margin.left +
               ',' + margin.top + ')');

        // Add scales
        this.xScale = d3.scaleTime()
          .rangeRound([0, width])
          .domain(d3.extent(data, function(d) {
            return d.date;
          }));

        this.yScale = d3.scaleLinear()
            .rangeRound([this.height, 0])
            .domain([0, d3.max(data, function(d) {
              return d.calories;
            })]);

        // Define area
        this.areaScale = d3.area()
          .x(function(d) {
            return self.xScale(d.date);
          })
          .y0(this.height)
          .y1(function(d) {
            return self.yScale(d.calories);
          });

        // Draw area
        this.area = this.g.append('path')
          .data([data])
          .attr('class', 'area')
          .attr('d', this.areaScale);

        // Append x axis
        this.g.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + this.height + ')')
          .call(d3.axisBottom(self.xScale));

        // Append y axis
        this.g.append('g')
          .attr('class', 'axis axis--y')
          .call(d3.axisLeft(self.yScale))
          .append('text')
          .attr('fill', '#000')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '0.71em')
          .style('text-anchor', 'end')
          .text('Calories');
      },

      updateChart: function() {
        var self = this;

        // Get data
        var data = this.getChartData();

        // There is a small programming error somewhere
        // in my app. This is just a workaround that gets the
        // app working. Not recommended for production
        if (!data[0].date) {
          data = data.slice(1, data.length);
        }

        // Update dominas of scales
        var myxScale = this.xScale.domain(d3.extent(data, function(d) {
          return d.date;
        }));
        var myyScale = this.yScale.domain([0, d3.max(data, function(d) {
          return d.calories;
        })]);

        // Update axises
        var transition = this.svg.transition().duration(750);

        // Change axises
        transition.select('.axis--x')
          .call(d3.axisBottom(self.xScale));

        transition.select('.axis--y')
          .call(d3.axisLeft(self.yScale));

        // Update area
        var myAreaScale = this.areaScale = d3.area()
          .x(function(d) {
            return myxScale(d.date);
          })
          .y0(this.height)
          .y1(function(d) {
            return myyScale(d.calories);
          });

        this.svg.selectAll('path')
          .data([data])
          .transition()
          .duration(750)
          .attr('d', myAreaScale);
      },

      getNutritionDay: function(date, data) {
        var result = $.grep(data, function(e) {
          var aDate = moment(new Date(e.date)).format('YYYY-MM-DD');
          return aDate === date;
        })[0];
        return result;
      },

      /**
       * Draws a pie that shows the amout of fat
       * in all the calories
       * @param {Number} id the id of the pie container
       * @param {String} macronutrient the name of the macronutrient
       * @param {Number} arcId the id of the svg holding the pie
       */
      drawPie: function(id, macronutrient, arcId) {
        var self = this;

        // Init variables
        var width = 200;
        var height = 200;
        var tau = 2 * Math.PI;

        // Get data
        var data = this.getChartData();

        // Get current day
        var date = this.day.format('YYYY-MM-DD');

        // Get data for specific day
        var result = this.getNutritionDay(date, data);

        // Grab svg
        this.fatSvg = d3.select(id)
          .attr('width', width)
          .attr('height', height);

        // Append g to middle of svg
        var g = this.fatSvg.append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        // Make arc
        this.arc = d3.arc()
          .innerRadius(70)
          .outerRadius(85)
          .startAngle(0);

        // Background
        g.append('path')
          .datum({endAngle: tau})
          .style('fill', '#ddd')
          .attr('d', self.arc);

        d3.select(id).append('text')
          .attr('x', (width / 2) - 40)
          .attr('y', height / 2)
          .attr('dy', '.35em')
          .style('font-family', 'Inconsolata')
          .text(function() {
            return macronutrient;
          });

        if (result) {
          // Foreground
          this.fatForeground = g.append('path')
            .attr('id', arcId)
            .datum({endAngle: result.macronutrient * tau})
            .style('fill', '#26a69a')
            .attr('d', self.arc);
        } else {
          // Foreground
          this.fatForeground = g.append('path')
            .attr('id', arcId)
            .datum({endAngle: 0 * tau})
            .style('fill', '#26a69a')
            .attr('d', self.arc);
        }
      },

      updatePie: function(id, macronutrient) {
        var tau = 2 * Math.PI;

        // Get data
        var data = this.getChartData();

        // Get current day
        var date = this.day.format('YYYY-MM-DD');

        // Get data for specific day
        var result = this.getNutritionDay(date, data);

        // Select arc
        var fatArc = d3.select(id);

        // Change display
        if (result) {
          fatArc.datum({endAngle: result[macronutrient] * tau})
          // .transition().duration(750)
          .attr('d', this.arc);
        } else {
          fatArc.datum({endAngle: 0 * tau})
          // .transition().duration(750)
          .attr('d', this.arc);
        }
      },

      /**
       * Change date in heading
       */
      changeHeading: function() {
        // Grab heading
        var heading = $('#today');

        // Change html of heading
        heading.html(this.day.format('MMMM DD YYYY'));
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
        var foods = $.grep(foodStorage, function(e) {
          return e.dateAdded === day;
        });

        return foods;
      },

      /**
       * Render list of all items
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
      }
    });

    // Create appview
    var AppView = Backbone.View.extend({

      el: 'main',

      events: {
        'click #food-search-button': 'searchFood',
        'click #previous-day': 'previousDay',
        'click #next-day': 'nextDay'
      },

      initialize: function() {
        // Init date for data
        this.currDate = moment();

        // Init models and collections
        this.foodModel = new FoodModel();
        this.foodCollection = new FoodCollection();
        this.foodView = new FoodView(this.currDate);

        // Render food
        this.foodView.renderFoods(this.currDate);

        // Add current date to heading
        $('#today').html(moment().format('MMMM DD YYYY'));
      },

      // Set curr day to day before current day
      previousDay: function() {
        this.currDate.subtract(1, 'days');
        this.foodView.renderFoods(this.currDate);
      },

      // Add a day to current day
      nextDay: function() {
        this.currDate.add(1, 'days');
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
            fields: 'item_name,brand_name,item_description,nf_serving_weight' +
                    '_grams,nf_calories,nf_total_fat,nf_total_carbohydrate,'  +
                    'nf_protein,nf_sugars',
            appKey: '05fb77c91338716322dfed86dc63eabc'}),

          success: function() {
            self.renderSearch();
          },

          error: function() {
            console.log('error');
          }
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
        var interpolationGreenRed = d3.interpolate('#26a69a', '#D7756B');

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
          .on('click', function(food) {
            self.foodSelected(food, self);
          });
      },

      /**
       * Add selected food to database for
       * this day
       * @param  {Object} food food that is chosen
       * @param  {Object} self the object itself
       */
      foodSelected: function(food, self) {
        // Store food in localstorage

        // Get today's date
        var date = this.currDate.format('YYYY-MM-DD');

        // Add id to storedFood
        food.foodId = 'food_' + Math.floor((Math.random() * 1e+20) + 1);

        // Add date added to storedFood
        food.dateAdded = date;

        // Turn localStorage to JSON object
        var storedFood = JSON.parse(localStorage.getItem('myFoods'));

        // Push new food to stored foods
        storedFood.push(food);

        // Update local storage for specific date
        localStorage.myFoods = JSON.stringify(storedFood);

        // Add food to foodTracker list

        // Get trackedFood
        var trackedFood = JSON.parse(localStorage.getItem('foodTracker'));

        // Check if food for this day exists and add calories
        if (trackedFood.date === null) {
          trackedFood.date = food.nf_calories;
        }

        // Add calories to current day
        trackedFood.date += food.nf_calories;

        // Save added calories for this day
        localStorage.setItem('foodTracker', JSON.stringify(trackedFood));

        // Render foods with added item
        self.foodView.renderFoods(self.currDate);
      }
    });

    return AppView;
  });
