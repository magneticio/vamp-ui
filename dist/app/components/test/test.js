System.register(['angular2/core', '../../components/editor/editor', '../../components/chart/linechart', '../../services/api/api', '../../services/event-stream/event-stream'], function(exports_1, context_1) {
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
    var core_1, editor_1, linechart_1, api_1, event_stream_1;
    var Test;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (editor_1_1) {
                editor_1 = editor_1_1;
            },
            function (linechart_1_1) {
                linechart_1 = linechart_1_1;
            },
            function (api_1_1) {
                api_1 = api_1_1;
            },
            function (event_stream_1_1) {
                event_stream_1 = event_stream_1_1;
            }],
        execute: function() {
            Test = (function () {
                function Test(_service, _stream) {
                    this._service = _service;
                    this._stream = _stream;
                    this._events = [];
                    this._metrics = [];
                    this.welcome = "name: sava:1.0\n  gateways:\n    '9050':\n      sticky: none\n      routes:\n        sava/port:\n          weight: null\n          filters: []\n          rewrites: []\n  clusters:\n    sava:\n      services:\n      - breed:\n          name: sava:1.0.0\n          deployable: docker://magneticio/sava:1.0.0\n          ports:\n            port: 80/http\n          environment_variables: {}\n          constants: {}\n          arguments: []\n          dependencies: {}\n        environment_variables: {}\n        scale:\n          cpu: 0.5\n          memory: 512.0MB\n          instances: 1\n        arguments: []\n        dialects: {}\n      routing: {}\n      dialects: {}\n  environment_variables: {}\n  ";
                    this.data = {
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                        datasets: [
                            {
                                label: 'My First dataset',
                                fillColor: 'rgba(52, 152, 219,0.2)',
                                strokeColor: 'rgba(52, 152, 219,1)',
                                pointColor: 'rgba(52, 152, 219,1)',
                                pointStrokeColor: '#fff',
                                pointHighlightFill: 'rgba(255, 64, 129,1)',
                                pointHighlightStroke: '#fff',
                                data: [65, 59, 80, 81, 56, 55, 40]
                            }
                        ]
                    };
                }
                Test.prototype.ngOnInit = function () {
                    var _this = this;
                    this._stream.listen();
                    this._stream.events$
                        .subscribe(function (updatedItems) { return _this._events = updatedItems; });
                    this._stream.metrics$
                        .subscribe(function (updatedItems) { return _this._metrics = updatedItems; });
                };
                Test = __decorate([
                    core_1.Component({
                        selector: 'test',
                        templateUrl: 'app///components/test/test.html',
                        styleUrls: ['app///components/test/test.css'],
                        providers: [api_1.ApiService, event_stream_1.EventStream],
                        directives: [editor_1.Editor, linechart_1.LineChart],
                        pipes: []
                    }), 
                    __metadata('design:paramtypes', [api_1.ApiService, event_stream_1.EventStream])
                ], Test);
                return Test;
            }());
            exports_1("Test", Test);
        }
    }
});
//# sourceMappingURL=../../../../../app/components/test/test.js.map