System.register(['angular2/core', '../../services/api/api', 'angular2/router'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, api_1, router_1;
    var CrudDetailComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (api_1_1) {
                api_1 = api_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            CrudDetailComponent = (function () {
                function CrudDetailComponent(_service, _router, _routeParams) {
                    this._service = _service;
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this._item = [];
                    this.resource = '';
                }
                CrudDetailComponent.prototype.ngOnInit = function () {
                    var name = this._routeParams.get('name');
                    this.resource = this._routeParams.get('resource');
                    this._service.get(this.resource, name);
                };
                CrudDetailComponent.prototype.routerCanDeactivate = function (next, prev) {
                    //if (!this.crud || this.crud.name === this.editName) {
                    //  return true;
                    //}
                    return new Promise(function (resolve, reject) { return resolve(window.confirm('Discard changes?')); });
                };
                CrudDetailComponent.prototype.cancel = function () {
                    //this.editName = this.crud.name;
                    this.gotoList();
                };
                CrudDetailComponent.prototype.save = function () {
                    //this.crud.name = this.editName;
                    this.gotoList();
                };
                CrudDetailComponent.prototype.gotoList = function () {
                    this._router.navigate(['CrudList']);
                };
                CrudDetailComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/components/crud/crud-detail.component.html',
                        styleUrls: ['app/components/crud/crud-detail.component.css']
                    }), 
                    __metadata('design:paramtypes', [api_1.ApiService, router_1.Router, router_1.RouteParams])
                ], CrudDetailComponent);
                return CrudDetailComponent;
            }());
            exports_1("CrudDetailComponent", CrudDetailComponent);
        }
    }
});
//# sourceMappingURL=../../../../../app/components/crud/crud-detail.component.js.map