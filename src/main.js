System.register(['angular2/platform/browser', './component'], function(exports_1) {
    var browser_1, component_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (component_1_1) {
                component_1 = component_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(component_1.AppComponent);
        }
    }
});
//# sourceMappingURL=main.js.map