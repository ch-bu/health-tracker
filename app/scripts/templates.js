define(['app/vendor/handlebars'], function(Handlebars) {

  this["MyApp"] = this["MyApp"] || {};
  this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
  this["MyApp"]["templates"]["foods"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      return "      <li class=\"collection-item\">Alvin</li>\n";
  },"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1;

    return "<ul class=\"collection\">\n"
      + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.food : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
      + "</ul>\n";
  },"useData":true});

});
