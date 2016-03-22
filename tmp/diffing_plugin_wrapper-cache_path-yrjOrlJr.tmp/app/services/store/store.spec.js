System.register(['angular2/testing', './store'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, store_1;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (store_1_1) {
                store_1 = store_1_1;
            }],
        execute: function() {
            testing_1.describe('Store Service', function () {
                testing_1.beforeEachProviders(function () { return [store_1.Store]; });
                testing_1.it('should ...', testing_1.inject([store_1.Store], function (service) {
                }));
            });
        }
    }
});
//# sourceMappingURL=../../../../../app/services/store/store.spec.js.map