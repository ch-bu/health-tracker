define(['handlebars'], function(Handlebars) {

  this["MyApp"] = this["MyApp"] || {};
  this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
  this["MyApp"]["templates"]["foods"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
      var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

    return "      <li class=\"collection-item\">"
      + alias4(((helper = (helper = helpers.item_name || (depth0 != null ? depth0.item_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"item_name","hash":{},"data":data}) : helper)))
      + " - <span>"
      + alias4(((helper = (helper = helpers.nf_calories || (depth0 != null ? depth0.nf_calories : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"nf_calories","hash":{},"data":data}) : helper)))
      + "</span></li>\n";
  },"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
      var stack1;

    return "<ul class=\"collection\">\n"
      + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.food : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
      + "</ul>\n";
  },"useData":true});

  return this.MyApp.templates;

});
