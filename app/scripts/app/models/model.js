/* global define: false */

define(['underscore', 'backbone'], function(_, Backbone) {
  var SearchModel = Backbone.Model.extend({
    initialize: function() {
      console.log('serachmodel');
    }
  });

  return SearchModel;
});
