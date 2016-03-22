System.register(['angular2/core', '../../services/api/api', '../../components/editor/editor', 'angular2/router'], function(exports_1, context_1) {
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
    var core_1, api_1, editor_1, router_1, router_2, core_2;
    var KeyValuesPipe, CrudListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (api_1_1) {
                api_1 = api_1_1;
            },
            function (editor_1_1) {
                editor_1 = editor_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
                router_2 = router_1_1;
            }],
        execute: function() {
            /*
            Pipe keys and values for an Array
            */
            KeyValuesPipe = (function () {
                function KeyValuesPipe() {
                }
                KeyValuesPipe.prototype.transform = function (value, args) {
                    var keys = [];
                    for (var key in value) {
                        keys.push({ key: key, value: value[key] });
                    }
                    return keys;
                };
                KeyValuesPipe = __decorate([
                    core_2.Pipe({ name: 'keyValues' }), 
                    __metadata('design:paramtypes', [])
                ], KeyValuesPipe);
                return KeyValuesPipe;
            }());
            exports_1("KeyValuesPipe", KeyValuesPipe);
            CrudListComponent = (function () {
                function CrudListComponent(_routeParams, _service) {
                    this._routeParams = _routeParams;
                    this._service = _service;
                    this._items = [];
                    this.resource = '';
                }
                CrudListComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.resource = this._routeParams.get('resource') || 'deployments';
                    this._service.items$.subscribe(function (updatedItems) { return _this._items = updatedItems; });
                    this._service.getAll(this.resource);
                };
                CrudListComponent.prototype.onSelect = function (item) { console.log('Selected', item); this.selectedItem = item; };
                CrudListComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/components/crud/crud-list.component.html',
                        styleUrls: ['app/components/crud/crud-list.component.css'],
                        directives: [router_2.RouterOutlet, router_2.ROUTER_DIRECTIVES, editor_1.Editor],
                        pipes: [KeyValuesPipe],
                        providers: [api_1.ApiService],
                    }), 
                    __metadata('design:paramtypes', [router_1.RouteParams, api_1.ApiService])
                ], CrudListComponent);
                return CrudListComponent;
            }());
            exports_1("CrudListComponent", CrudListComponent);
        }
    }
});
//# sourceMappingURL=../../../../../app/components/crud/crud-list.component.js.map