'use strict';

angular.module('inspinia')
    .directive('barchart', function () {
      var dData = function() {
        return Math.round(Math.random() * 90) + 10;
      };


      


      var barchart = {
          template: '<canvas id="barchart"></canvas>',
          replace: true,
          link: function($scope, element, attributes ) {
            var barData = {
              labels: ['dD 1', 'dD 2', 'dD 3', 'dD 4',
                       'dD 5', 'dD 6', 'dD 7', 'dD 8'],
              datasets: [{
                fillColor: 'rgba(0,60,100,1)',
                strokeColor: 'black',
                data: [dData(), dData(), dData(), dData(),
                       dData(), dData(), dData(), dData()]
              }]
            }

            var options = {
              responsive: true,
              maintainAspectRatio: false
            }
            var ctx = document.getElementById("barchart").getContext('2d');

            var barDemo = new Chart(ctx).Bar(barData, options);

            var index = 9;
            setInterval(function() {
              barDemo.removeData();
              barDemo.addData([dData()], "dD " + index);
              index++;
            }, 3000);
          }
      }
    
        return barchart;
    });
