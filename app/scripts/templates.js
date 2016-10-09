this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
this["MyApp"]["templates"]["food-list"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "      <tr>\n        <td>"
    + alias4(((helper = (helper = helpers.item_name || (depth0 != null ? depth0.item_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"item_name","hash":{},"data":data}) : helper)))
    + "</td>\n        <td><i class=\"material-icons\" id=\""
    + alias4(((helper = (helper = helpers.foodId || (depth0 != null ? depth0.foodId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"foodId","hash":{},"data":data}) : helper)))
    + "\">delete</i></td>\n      </tr>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n<table class=\"highlight\">\n\n\n  <tbody>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.item : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </tbody>\n</table>\n\n";
},"useData":true});
this["MyApp"]["templates"]["food-search-button"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<a id=\"food-search-button\" class=\"waves-effect waves-light btn\">Search Food</a>\n";
},"useData":true});
this["MyApp"]["templates"]["loading-ring"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"progress\" id=\"loading-ring\">\n    <div class=\"indeterminate\"></div>\n</div>\n";
},"useData":true});