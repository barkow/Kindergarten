// require.js looks for the following global when initializing
var require = {
    baseUrl: ".",
    paths: {
        "bootstrap":            "bower_modules/components-bootstrap/js/bootstrap.min",
        "crossroads":           "bower_modules/crossroads/dist/crossroads.min",
        "hasher":               "bower_modules/hasher/dist/js/hasher.min",
        "jquery":               "bower_modules/jquery/dist/jquery",
        "jquery-validation":    "bower_modules/jquery-validation/dist/jquery.validate.min",
        "knockout":             "bower_modules/knockout/dist/knockout",
        "knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
        "signals":              "bower_modules/js-signals/dist/signals.min",
        "text":                 "bower_modules/requirejs-text/text",
        "select2":              "bower_modules/select2/select2.min",
        "x-editable":           "bower_modules/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.min",
        "knockout-x-editable":  "bower_modules/knockout-x-editable/knockout.x-editable.min",
        "select2-ko-binding":   "app/select2-ko-binding"
    },
    shim: {
        "bootstrap":            { deps: ["jquery"] },
        "jquery-validation":    { deps: ["jquery"] },
        "select2":              { deps: ["jquery"] },
        "x-editable":           { deps: ["jquery"] },
        "knockout-x-editable":  { deps: ["x-editable"] }
    }
};
