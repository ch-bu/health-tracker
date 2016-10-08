this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
this["MyApp"]["templates"]["food-search-button"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<a id=\"food-search-button\" class=\"waves-effect waves-light btn\">Search Food</a>\n";
},"useData":true});
this["MyApp"]["templates"]["loading-ring"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"progress\" id=\"loading-ring\">\n    <div class=\"indeterminate\"></div>\n</div>\n";
},"useData":true});