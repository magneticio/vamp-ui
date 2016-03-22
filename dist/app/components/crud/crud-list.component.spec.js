System.register(['angular2/testing', './crud-list.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, crud_list_component_1;
    var MockCrudService;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (crud_list_component_1_1) {
                crud_list_component_1 = crud_list_component_1_1;
            }],
        execute: function() {
            MockCrudService = (function () {
                function MockCrudService() {
                }
                return MockCrudService;
            }());
            testing_1.describe('CrudListComponent', function () {
                testing_1.beforeEachProviders(function () { return []; });
                testing_1.it('should ...', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb.createAsync(crud_list_component_1.CrudListComponent).then(function (fixture) {
                        fixture.detectChanges();
                    });
                }));
            });
        }
    }
});
//# sourceMappingURL=../../../../../app/components/crud/crud-list.component.spec.js.map