System.register(['angular2/testing', 'angular2/core', './crud-detail.component', 'angular2/router'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, core_1, crud_detail_component_1, router_1;
    var MockCrudService, MockRouter, MockRouteParams;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (crud_detail_component_1_1) {
                crud_detail_component_1 = crud_detail_component_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            MockCrudService = (function () {
                function MockCrudService() {
                }
                return MockCrudService;
            }());
            MockRouter = (function () {
                function MockRouter() {
                }
                MockRouter.prototype.navigate = function () { };
                return MockRouter;
            }());
            MockRouteParams = (function () {
                function MockRouteParams() {
                }
                MockRouteParams.prototype.get = function () { return 1; };
                return MockRouteParams;
            }());
            testing_1.describe('CrudDetailComponent', function () {
                testing_1.beforeEachProviders(function () { return [
                    //provide(ApiService, {useClass: MockCrudService}),
                    core_1.provide(router_1.Router, { useClass: MockRouter }),
                    core_1.provide(router_1.RouteParams, { useClass: MockRouteParams }),
                ]; });
                testing_1.it('should ...', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb.createAsync(crud_detail_component_1.CrudDetailComponent).then(function (fixture) {
                        fixture.detectChanges();
                    });
                }));
            });
        }
    }
});
//# sourceMappingURL=../../../../../app/components/crud/crud-detail.component.spec.js.map