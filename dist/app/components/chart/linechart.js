System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var LineChart;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            LineChart = (function () {
                function LineChart(el, differs) {
                    this.el = el;
                    this.animation = true;
                    this.animationSteps = 60;
                    this.animationEasing = "easeOutQuart";
                    this.showScale = true;
                    this.scaleOverride = false;
                    this.scaleSteps = null;
                    this.scaleStepWidth = null;
                    this.scaleStartValue = null;
                    this.scaleLineColor = 'rgba(0,0,0,.1)';
                    this.scaleLineWidth = 1;
                    this.scaleShowLabels = true;
                    this.scaleLabel = '<%=value%>';
                    this.scaleIntegersOnly = true;
                    this.scaleBeginAtZero = true;
                    this.scaleFontFamily = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
                    this.scaleFontSize = 12;
                    this.scaleFontStyle = 'normal';
                    this.scaleFontColor = '#666';
                    this.responsive = false;
                    this.maintainAspectRatio = true;
                    this.showTooltips = true;
                    this.tooltipFillColor = 'rgba(0,0,0,0.8)';
                    this.tooltipFontFamily = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
                    this.tooltipFontSize = 14;
                    this.tooltipFontStyle = 'normal';
                    this.tooltipFontColor = '#fff';
                    this.tooltipTitleFontFamily = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
                    this.tooltipTitleFontSize = 14;
                    this.tooltipTitleFontStyle = 'bold';
                    this.tooltipTitleFontColor = '#fff';
                    this.tooltipYPadding = 6;
                    this.tooltipXPadding = 6;
                    this.tooltipCaretSize = 8;
                    this.tooltipCornerRadius = 6;
                    this.tooltipXOffset = 10;
                    this.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= value %>";
                    this.multiTooltipTemplate = "<%= value %>";
                    this.scaleShowGridLines = true;
                    this.scaleGridLineColor = "rgba(0,0,0,.05)";
                    this.scaleGridLineWidth = 1;
                    this.scaleShowHorizontalLines = true;
                    this.scaleShowVerticalLines = true;
                    this.bezierCurve = true;
                    this.bezierCurveTension = 0.4;
                    this.pointDot = true;
                    this.pointDotRadius = 4;
                    this.pointDotStrokeWidth = 1;
                    this.pointHitDetectionRadius = 20;
                    this.datasetStroke = true;
                    this.datasetStrokeWidth = 2;
                    this.datasetFill = true;
                    this.legendTemplate = "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>";
                    this.onPointsSelect = new core_1.EventEmitter();
                    this.differ = differs.find([]).create(null);
                }
                LineChart.prototype.ngAfterViewInit = function () {
                    this.initChart();
                    this.initialized = true;
                };
                LineChart.prototype.ngDoCheck = function () {
                    var changes = null;
                    try {
                        changes = this.differ.diff(this.value);
                    }
                    catch (e) {
                        if (this.value) {
                            changes = this.differ.diff(this.value.datasets);
                        }
                    }
                    if (changes && this.initialized) {
                        if (this.chart) {
                            this.chart.destroy();
                        }
                        this.initChart();
                    }
                };
                LineChart.prototype.ngOnDestroy = function () {
                    if (this.chart) {
                        this.chart.destroy();
                        this.initialized = false;
                        this.chart = null;
                    }
                };
                LineChart.prototype.onCanvasClick = function (event) {
                    if (this.chart) {
                        var activePoints = this.chart.getPointsAtEvent(event);
                        if (activePoints) {
                            this.onPointsSelect.next({ originalEvent: event, points: activePoints });
                        }
                    }
                };
                LineChart.prototype.initChart = function () {
                    if (this.value) {
                        this.chart = new Chart(this.el.nativeElement.children[0].getContext("2d")).Line(this.value, {
                            animation: this.animation,
                            animationSteps: this.animationSteps,
                            animationEasing: this.animationEasing,
                            showScale: this.showScale,
                            scaleOverride: this.scaleOverride,
                            scaleSteps: this.scaleSteps,
                            scaleStepWidth: this.scaleStepWidth,
                            scaleStartValue: this.scaleStartValue,
                            scaleLineColor: this.scaleLineColor,
                            scaleLineWidth: this.scaleLineWidth,
                            scaleLabel: this.scaleLabel,
                            scaleShowLabels: this.scaleShowLabels,
                            scaleIntegersOnly: this.scaleIntegersOnly,
                            scaleBeginAtZero: this.scaleBeginAtZero,
                            scaleFontFamily: this.scaleFontFamily,
                            scaleFontSize: this.scaleFontSize,
                            scaleFontStyle: this.scaleFontStyle,
                            scaleFontColor: this.scaleFontColor,
                            responsive: this.responsive,
                            maintainAspectRatio: this.maintainAspectRatio,
                            showTooltips: this.showTooltips,
                            tooltipFillColor: this.tooltipFillColor,
                            tooltipFontFamily: this.tooltipFontFamily,
                            tooltipFontSize: this.tooltipFontSize,
                            tooltipFontStyle: this.tooltipFontStyle,
                            tooltipFontColor: this.tooltipFontColor,
                            tooltipTitleFontFamily: this.tooltipTitleFontFamily,
                            tooltipTitleFontSize: this.tooltipTitleFontSize,
                            tooltipTitleFontStyle: this.tooltipTitleFontStyle,
                            tooltipTitleFontColor: this.tooltipTitleFontColor,
                            tooltipYPadding: this.tooltipYPadding,
                            tooltipXPadding: this.tooltipXPadding,
                            tooltipCaretSize: this.tooltipCaretSize,
                            tooltipCornerRadius: this.tooltipCornerRadius,
                            tooltipXOffset: this.tooltipXOffset,
                            tooltipTemplate: this.tooltipTemplate,
                            multiTooltipTemplate: this.multiTooltipTemplate,
                            scaleShowGridLines: this.scaleShowGridLines,
                            scaleGridLineColor: this.scaleGridLineColor,
                            scaleGridLineWidth: this.scaleGridLineWidth,
                            scaleShowHorizontalLines: this.scaleShowHorizontalLines,
                            scaleShowVerticalLines: this.scaleShowVerticalLines,
                            bezierCurve: this.bezierCurve,
                            bezierCurveTension: this.bezierCurveTension,
                            pointDot: this.pointDot,
                            pointDotRadius: this.pointDotRadius,
                            pointDotStrokeWidth: this.pointDotStrokeWidth,
                            pointHitDetectionRadius: this.pointHitDetectionRadius,
                            datasetStroke: this.datasetStroke,
                            datasetStrokeWidth: this.datasetStrokeWidth,
                            datasetFill: this.datasetFill
                        });
                        if (this.legend) {
                            this.legend.innerHTML = this.chart.generateLegend();
                        }
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "animation", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "animationSteps", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "animationEasing", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "showScale", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "scaleOverride", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "scaleSteps", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "scaleStepWidth", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "scaleStartValue", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "scaleLineColor", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "scaleLineWidth", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "scaleShowLabels", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "scaleLabel", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "scaleIntegersOnly", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "scaleBeginAtZero", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "scaleFontFamily", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "scaleFontSize", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "scaleFontStyle", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "scaleFontColor", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "responsive", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "maintainAspectRatio", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "showTooltips", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "tooltipFillColor", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "tooltipFontFamily", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "tooltipFontSize", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "tooltipFontStyle", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "tooltipFontColor", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "tooltipTitleFontFamily", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "tooltipTitleFontSize", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "tooltipTitleFontStyle", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "tooltipTitleFontColor", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "tooltipYPadding", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "tooltipXPadding", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "tooltipCaretSize", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "tooltipCornerRadius", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "tooltipXOffset", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "tooltipTemplate", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "multiTooltipTemplate", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], LineChart.prototype, "value", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "width", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "height", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "scaleShowGridLines", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "scaleGridLineColor", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "scaleGridLineWidth", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "scaleShowHorizontalLines", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "scaleShowVerticalLines", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "bezierCurve", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "bezierCurveTension", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "pointDot", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "pointDotRadius", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "pointDotStrokeWidth", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "pointHitDetectionRadius", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "datasetStroke", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], LineChart.prototype, "datasetStrokeWidth", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], LineChart.prototype, "datasetFill", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], LineChart.prototype, "legend", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], LineChart.prototype, "legendTemplate", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], LineChart.prototype, "onPointsSelect", void 0);
                LineChart = __decorate([
                    core_1.Component({
                        selector: 'linechart',
                        template: "\n        <canvas [attr.width]=\"width\" [attr.height]=\"height\" (click)=\"onCanvasClick($event)\"></canvas>\n    "
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.IterableDiffers])
                ], LineChart);
                return LineChart;
            }());
            exports_1("LineChart", LineChart);
        }
    }
});
//# sourceMappingURL=../../../../../app/components/chart/linechart.js.map