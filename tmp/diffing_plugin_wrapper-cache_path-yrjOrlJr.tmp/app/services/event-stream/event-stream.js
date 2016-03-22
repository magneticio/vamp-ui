System.register(['angular2/core', 'angular2/http', 'rxjs/Observable'], function(exports_1, context_1) {
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
    var core_1, http_1, Observable_1;
    var EventStream;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            EventStream = (function () {
                function EventStream(_http) {
                    var _this = this;
                    this._http = _http;
                    this._endpoint = 'http://192.168.99.100:8080/api/v1/';
                    this.events$ = new Observable_1.Observable(function (observer) { return _this._eventObserver = observer; }).share();
                    this._eventStore = { items: [] };
                    this.metrics$ = new Observable_1.Observable(function (observer) { return _this._metricObserver = observer; }).share();
                    this._metricStore = { items: [] };
                }
                EventStream.prototype.listen = function () {
                    var _this = this;
                    var source = new EventSource(this._endpoint + 'events/stream');
                    source.addEventListener('event', function (e) {
                        // Deploying/undeploying
                        //console.log('eventStream:event', e.data);
                        _this._eventStore.items.push(JSON.parse(e.data));
                        _this._eventObserver.next(_this._eventStore.items);
                    }, false);
                    source.addEventListener('gateway-metrics', function (e) {
                        // Metrics
                        //console.log('eventStream:metric', e.data);
                        _this._metricStore.items.push(JSON.parse(e.data));
                        _this._metricObserver.next(_this._metricStore.items);
                    }, false);
                    source.addEventListener('open', function (e) {
                        //console.log('eventStream opened…');
                    }, false);
                    source.addEventListener('error', function (e) {
                        //console.log('eventStream errored…');
                        if (e.readyState == EventSource.CLOSED) {
                        }
                    }, false);
                };
                EventStream = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], EventStream);
                return EventStream;
            }());
            exports_1("EventStream", EventStream);
        }
    }
});
//# sourceMappingURL=../../../../../app/services/event-stream/event-stream.js.map