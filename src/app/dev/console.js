System.register(['angular2/core', '../lib/api', 'rxjs/Rx'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, api_1, Rx_1, core_2;
    var ValuesPipe, ConsoleComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (api_1_1) {
                api_1 = api_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            // import 'rxjs/add/operator'
            ValuesPipe = (function () {
                function ValuesPipe() {
                }
                ValuesPipe.prototype.transform = function (value, args) {
                    if (args === void 0) { args = null; }
                    return Object.keys(value).map(function (key) { return value[key]; });
                };
                ValuesPipe = __decorate([
                    core_2.Pipe({ name: 'values', pure: false }), 
                    __metadata('design:paramtypes', [])
                ], ValuesPipe);
                return ValuesPipe;
            })();
            exports_1("ValuesPipe", ValuesPipe);
            ConsoleComponent = (function () {
                function ConsoleComponent(api) {
                    this.api = api;
                }
                ConsoleComponent.prototype.initPolling = function (type) {
                    var _this = this;
                    return Rx_1.Observable.interval(1000)
                        .flatMap(function () {
                        return _this.api.get(type);
                    })
                        .subscribe(function (data) { return _this[type] = data; }, function (error) { return console.log('Errorred with', error); });
                };
                ConsoleComponent.prototype.ngOnInit = function () {
                    this.initPolling('gateways');
                    this.initPolling('deployments');
                };
                ConsoleComponent = __decorate([
                    core_1.Component({
                        pipes: [ValuesPipe],
                        providers: [api_1.Api],
                        selector: 'vamp-console',
                        templateUrl: 'src/app/templates/console.html'
                    }), 
                    __metadata('design:paramtypes', [api_1.Api])
                ], ConsoleComponent);
                return ConsoleComponent;
            })();
            exports_1("ConsoleComponent", ConsoleComponent);
        }
    }
});
//# sourceMappingURL=console.js.map