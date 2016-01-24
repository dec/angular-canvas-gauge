/**!
 * AngularJS 1.x directive for excelent Mikhus's HTML5 Canvas Gauge
 *
 * https://github.com/Mikhus/canv-gauge
 * https://github.com/dec/angular-canvas-gauge
 *
 * This code is subject to MIT license.
 *
 * Copyright (c) 2016 David Esperalta - http://www.davidesperalta.com/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
angular.module('angular-canvas-gauge', []).directive('canvasGauge', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      var
        options = {
          renderTo: attributes.id,
          value: 0,
          width: 200,
          height: 200,
          title: false,
          maxValue: 100,
          minValue: 0,
          majorTicks: [],
          minorTicks: 10,
          strokeTicks: true,
          units: false,
          valueFormat: {
            'int': 3,
            'dec': 2
          },
          majorTicksFormat: {
            'int': 1,
            'dec': 0
          },
          glow: true,
          animation: {
            delay: 10,
            duration: 250,
            fn: 'cycle'
          },
          colors: {
            plate: '#fff',
            majorTicks: '#444',
            minorTicks: '#666',
            title: '#888',
            units: '#888',
            numbers: '#444',
            needle: {
              start: 'rgba(240, 128, 128, 1)',
              end: 'rgba(255, 160, 122, .9)',
              circle: {
                outerStart: '#f0f0f0',
                outerEnd: '#ccc',
                innerStart: '#e8e8e8',
                innerEnd: '#f5f5f5'
              },
              shadowUp: 'rgba(2, 255, 255, 0.2)',
              shadowDown: 'rgba(188, 143, 143, 0.45)'
            },
            valueBox: {
              rectStart: '#888',
              rectEnd: '#666',
              background: '#babab2',
              shadow: 'rgba(0, 0, 0, 1)'
            },
            valueText: {
              foreground: '#444',
              shadow: 'rgba(0, 0, 0, 0.3)'
            },
            circle: {
              shadow: 'rgba(0, 0, 0, 0.5)',
              outerStart: '#ddd',
              outerEnd: '#aaa',
              middleStart: '#eee',
              middleEnd: '#f0f0f0',
              innerStart: '#fafafa',
              innerEnd: '#ccc'
            }
          },
          circles: {
            outerVisible: true,
            middleVisible: true,
            innerVisible: true
          },
          valueBox: {
            visible: true
          },
          valueText: {
            visible: true
          },
          highlights: [{
            from: 20,
            to: 60,
            color: '#eee'
          }, {
            from: 60,
            to: 80,
            color: '#ccc'
          }, {
            from: 80,
            to: 100,
            color: '#999'
          }]
        };

      var
        gauge = new Gauge(options);
      gauge.draw();

      var
        parseHightlights = function(value) {
          var
            result = [];

          if (value === '') {
            return result;
          }

          var
            hls = value.match(/(?:(?:-?\d*\.)?(-?\d+){1,2} ){2}(?:(?:#|0x)?(?:[0-9A-F|a-f]){3,8}|rgba?\(.*?\))/g);

          if (hls === null) {
            return result;
          }

          for (var j = 0, l = hls.length; j < l; j++) {
            var
              cfg = hls[j].trim().split(/\s+/),
              hlCfg = {};

            if (cfg[0] && cfg[0] != '') {
              hlCfg.from = cfg[0];
            }

            if (cfg[1] && cfg[1] != '') {
              hlCfg.to = cfg[1];
            }

            if (cfg[2] && cfg[2] != '') {
              hlCfg.color = cfg[2];
            }

            result.push(hlCfg);
          }
          return result;
        };

      attributes.$observe('glow', function(value) {
        gauge.updateConfig({
          glow: value === 'true'
        });
      });

      attributes.$observe('value', function(value) {
        gauge.setValue(value);
      });

      attributes.$observe('title', function(value) {
        gauge.updateConfig({
          title: value
        });
      });

      attributes.$observe('units', function(value) {
        gauge.updateConfig({
          units: value
        });
      });

      attributes.$observe('width', function(value) {
        gauge.updateConfig({
          width: value
        });
      });

      attributes.$observe('height', function(value) {
        gauge.updateConfig({
          height: value
        });
      });

      attributes.$observe('minValue', function(value) {
        gauge.updateConfig({
          minValue: value
        });
      });

      attributes.$observe('maxValue', function(value) {
        gauge.updateConfig({
          maxValue: parseFloat(value)
        });
      });

      attributes.$observe('minorTicks', function(value) {
        gauge.updateConfig({
          minorTicks: parseFloat(value)
        });
      });

      attributes.$observe('majorTicks', function(value) {
        gauge.updateConfig({
          majorTicks: value.split(' ')
        });
      });

      attributes.$observe('highlights', function(value) {
        gauge.updateConfig({
          highlights: parseHightlights(value)
        });
      });

      attributes.$observe('strokeTicks', function(value) {
        gauge.updateConfig({
          strokeTicks: value
        });
      });

      attributes.$observe('animationFn', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.animation.fn = value;
        gauge.updateConfig(config);
      });

      attributes.$observe('colorsPlate', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.colors.plate = value;
        gauge.updateConfig(config);
      });

      attributes.$observe('colorsUnits', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.colors.units = value;
        gauge.updateConfig(config);
      });

      attributes.$observe('colorsTitle', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.colors.title = value;
        gauge.updateConfig(config);
      });

      attributes.$observe('colorsNeedleStart', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.colors.needle.start = value;
        gauge.updateConfig(config);
      });

      attributes.$observe('colorsNeedleEnd', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.colors.needle.end = value;
        gauge.updateConfig(config);
      });

      attributes.$observe('colorsMinorTicks', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.colors.minorTicks = value;
        gauge.updateConfig(config);
      });

      attributes.$observe('colorsMajorTicks', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.colors.majorTicks = value;
        gauge.updateConfig(config);
      });

      attributes.$observe('valueboxVisible', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.valueBox.visible = value;
        gauge.updateConfig(config);
      });

      attributes.$observe('valuetextVisible', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.valueText.visible = value;
        gauge.updateConfig(config);
      });

      attributes.$observe('circleOuterVisible', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.circles.outerVisible = value === 'true';
        gauge.updateConfig(config);
      });

      attributes.$observe('circleMiddleVisible', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.circles.middleVisible = value === 'true';
        gauge.updateConfig(config);
      });

      attributes.$observe('circleInnerVisible', function(value) {
        var
          config = gauge.updateConfig({}).config;
        config.circles.innerVisible = value === 'true';
        gauge.updateConfig(config);
      });
    }
  }
});