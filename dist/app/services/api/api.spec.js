System.register(['angular2/testing', './api'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, api_1;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (api_1_1) {
                api_1 = api_1_1;
            }],
        execute: function() {
            testing_1.describe('ApiService', function () {
                testing_1.beforeEachProviders(function () { return [api_1.ApiService]; });
                testing_1.it('should get all apis', testing_1.inject([api_1.ApiService], function (apiService) {
                    //apiService.getAll().then(apis => expect(apis.length).toBe(3));
                }));
                testing_1.it('should get one apis', testing_1.inject([api_1.ApiService], function (apiService) {
                    //apiService.get(1).then(api => expect(api.id).toBe(1));
                }));
            });
        }
    }
});
//# sourceMappingURL=../../../../../app/services/api/api.spec.js.map