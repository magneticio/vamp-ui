System.register(['angular2/testing', './event-stream'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, event_stream_1;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (event_stream_1_1) {
                event_stream_1 = event_stream_1_1;
            }],
        execute: function() {
            testing_1.describe('EventStream Service', function () {
                testing_1.beforeEachProviders(function () { return [event_stream_1.EventStream]; });
                testing_1.it('should ...', testing_1.inject([event_stream_1.EventStream], function (service) {
                }));
            });
        }
    }
});
//# sourceMappingURL=../../../../../app/services/event-stream/event-stream.spec.js.map