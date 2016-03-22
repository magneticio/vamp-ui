System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var Store, BlueprintStore, GatewayStore;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            Store = (function () {
                // On initialization of the Store the following parameters are expected:
                // 1. an API coupling with the correct method names. (private)
                // 2. the name and/or interface of the VAMP artifact onto which this
                //    store will be modelled.
                function Store() {
                }
                // 1. This adds an artifact of the initialized type to the store
                // 2. It communicates the newly added artifact to the API
                // 3. The Store publishes the newly added artifact to the observer
                Store.prototype.add = function () {
                    // if ( capabilites.indexOf( 'POST' ) !== -1 )
                    //   return null;
                };
                // 1. This removes an artifact of the initialized type from the store
                // 2. It communicates the newly deleted artifact to the API
                // 3. The Store notifes the observer of the remvoval
                Store.prototype.delete = function () { };
                // 1. Retrieve a single artifact from the store
                // 2. (optionally) GET's the single artifact from the API
                // Q:
                Store.prototype.get = function () { };
                // 1. Updates an existing artifact in the store
                // 2. Communicates the udpated artifact to the API service
                Store.prototype.update = function () { };
                Store = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], Store);
                return Store;
            }());
            exports_1("Store", Store);
            // We add custom functions to each of the artifact types based on extending the
            // Store class like so:
            BlueprintStore = (function (_super) {
                __extends(BlueprintStore, _super);
                // Add requirements specific to Blueprints here.
                function BlueprintStore() {
                    _super.call(this);
                    this.capabilites = ['GET', 'POST', 'PUT', 'DELETE'];
                    //api.capabilites( this.capabilites );
                }
                // This could add a cluster by providing a name and a JSON object.
                BlueprintStore.prototype.addCluster = function (name, data) { };
                return BlueprintStore;
            }(Store));
            exports_1("BlueprintStore", BlueprintStore);
            GatewayStore = (function (_super) {
                __extends(GatewayStore, _super);
                function GatewayStore() {
                    _super.apply(this, arguments);
                }
                return GatewayStore;
            }(Store));
            exports_1("GatewayStore", GatewayStore); //etc.
        }
    }
});
// Ideally we put all these classes in their own files, regardless of size, for
// better code organization.
//# sourceMappingURL=../../../../../app/services/store/store.js.map