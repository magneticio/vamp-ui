System.register(['angular2/core', 'angular2/http', 'rxjs/Observable', 'rxjs/add/operator/share', 'rxjs/add/operator/map'], function(exports_1, context_1) {
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
    var serializeParams, deserializeResponse, Api, ApiService;
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
            },
            function (_1) {},
            function (_2) {}],
        execute: function() {
            serializeParams = function (params) {
                if (params === void 0) { params = {}; }
                if (!params.headers)
                    params.headers = new http_1.Headers({ 'Content-Type': 'applications/json' });
                return params;
            };
            deserializeResponse = function (resp) {
                var contentType = resp && resp.headers && (resp.headers.get('content-type') || resp.headers.get('Content-Type'));
                if (!contentType)
                    return resp;
                if (/json/.test(contentType))
                    return resp.json();
                else if (/text/.test(contentType))
                    return resp.text();
                else if (/blob/.test(contentType))
                    return resp.blob();
                else
                    return resp;
            };
            Api = (function () {
                function Api(name) {
                    this.name = name;
                }
                return Api;
            }());
            exports_1("Api", Api);
            ApiService = (function () {
                function ApiService(_http) {
                    var _this = this;
                    this._http = _http;
                    this._endpoint = 'http://192.168.99.100:8080/api/v1/';
                    this.items$ = new Observable_1.Observable(function (observer) { return _this._itemsObserver = observer; }).share();
                    this._dataStore = { items: [] };
                }
                ApiService.prototype.getAll = function (resource) {
                    var _this = this;
                    return this._http.get(this._endpoint + resource)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (data) {
                        // Update data store
                        _this._dataStore.items = data;
                        // Push new items into the Observable stream
                        _this._itemsObserver.next(_this._dataStore.items);
                    }, function (error) { return _this.handleError(error); }, function () { return console.log('GetAll complete', resource, _this._dataStore.items); });
                };
                ApiService.prototype.get = function (resource, name) {
                    /*this._http.get( this._endpoint + resource + '/' + name).subscribe(
                      response => {
                          this._dataStore.items.forEach((t, index) => {
                              console.log(t);
                              if (t.name === name) { console.log('Found!'); this._dataStore.item = this._dataStore.items[index]; }
                          });
                      },
                      error => this.handleError(error),
                      () => console.log('Get complete', resource, this._dataStore.item)
                    )*/
                };
                ApiService.prototype.post = function (resource, req) {
                    return this._http.post(this._endpoint + resource, req)
                        .map(function (res) { return res.json(); });
                };
                ApiService.prototype.put = function (resource, req) {
                    return this._http.put(this._endpoint + resource, req)
                        .map(function (res) { return res.json(); });
                };
                /*delete( resource:string ) {
                  return this._http.delete( this._endpoint + resource )
                    .map( res => res.json() )
                }*/
                ApiService.prototype.delete = function (resource, id) {
                    var _this = this;
                    this._http.delete(this._endpoint + resource + '/' + id).subscribe(function (response) {
                        _this._dataStore.items.forEach(function (t, index) {
                            if (t.name === id) {
                                _this._dataStore.items.splice(index, 1);
                            }
                        });
                        _this._itemsObserver.next(_this._dataStore.items);
                    }, function (error) { return _this.handleError(error); }, function () { return console.log('Delete complete', resource, id); });
                };
                ApiService.prototype.handleError = function (error) {
                    console.log('Error', error);
                };
                ApiService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ApiService);
                return ApiService;
            }());
            exports_1("ApiService", ApiService);
        }
    }
});
//# sourceMappingURL=../../../../../app/services/api/api.js.map