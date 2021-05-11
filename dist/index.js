'use strict';

var d3 = require('d3');
var d3Format = require('d3-format');
var d3Appendselect = require('d3-appendselect');
var merge = require('lodash/merge');
var D3Locale = require('@reuters-graphics/d3-locale');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);
var D3Locale__default = /*#__PURE__*/_interopDefaultLegacy(D3Locale);

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
d3Format.formatLocale({
  shortMonths: ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
});

var AN = {
	name: "Andaman and Nicobar Islands",
	" pop_2020 ": 417036,
	col: 7,
	row: 7
};
var AP = {
	name: "Andhra Pradesh",
	" pop_2020 ": 53903393,
	col: 5,
	row: 5
};
var AR = {
	name: "Arunachal Pradesh",
	" pop_2020 ": 1570458,
	col: 9,
	row: 2
};
var AS = {
	name: "Assam",
	" pop_2020 ": 35607039,
	col: 7,
	row: 2
};
var BR = {
	name: "Bihar",
	" pop_2020 ": 124799926,
	col: 6,
	row: 3
};
var CH = {
	name: "Chandigarh",
	" pop_2020 ": 1158473,
	col: 3,
	row: 3
};
var CT = {
	name: "Chhattisgarh",
	" pop_2020 ": 29436231,
	col: 5,
	row: 4
};
var DN = {
	name: "Dadra and Nagar Haveli and Daman and Diu",
	" pop_2020 ": 615724,
	col: 2,
	row: 5
};
var DL = {
	name: "Delhi",
	" pop_2020 ": 18710922,
	col: 3,
	row: 4
};
var GA = {
	name: "Goa",
	" pop_2020 ": 1586250,
	col: 3,
	row: 6
};
var GJ = {
	name: "Gujarat",
	" pop_2020 ": 63872399,
	col: 1,
	row: 4
};
var HR = {
	name: "Haryana",
	" pop_2020 ": 28204692,
	col: 2,
	row: 3
};
var HP = {
	name: "Himachal Pradesh",
	" pop_2020 ": 7451955,
	col: 4,
	row: 2
};
var JK = {
	name: "Jammu and Kashmir",
	" pop_2020 ": 13606320,
	col: 3,
	row: 1
};
var JH = {
	name: "Jharkhand",
	" pop_2020 ": 38593948,
	col: 6,
	row: 4
};
var KA = {
	name: "Karnataka",
	" pop_2020 ": 67562686,
	col: 4,
	row: 6
};
var KL = {
	name: "Kerala",
	" pop_2020 ": 35699443,
	col: 4,
	row: 7
};
var LA = {
	name: "Ladakh",
	" pop_2020 ": 289023,
	col: 4,
	row: 1
};
var LD = {
	name: "Lakshadweep",
	" pop_2020 ": 73183,
	col: 3,
	row: 7
};
var MP = {
	name: "Madhya Pradesh",
	" pop_2020 ": 85358965,
	col: 4,
	row: 4
};
var MH = {
	name: "Maharashtra",
	" pop_2020 ": 123144223,
	col: 3,
	row: 5
};
var MN = {
	name: "Manipur",
	" pop_2020 ": 3091545,
	col: 9,
	row: 3
};
var ML = {
	name: "Meghalaya",
	" pop_2020 ": 3366710,
	col: 8,
	row: 3
};
var MZ = {
	name: "Mizoram",
	" pop_2020 ": 1239244,
	col: 9,
	row: 4
};
var NL = {
	name: "Nagaland",
	" pop_2020 ": 2249695,
	col: 8,
	row: 2
};
var OR = {
	name: "Odisha",
	" pop_2020 ": 46356334,
	col: 6,
	row: 5
};
var PY = {
	name: "Puducherry",
	" pop_2020 ": 1413542,
	col: 5,
	row: 6
};
var PB = {
	name: "Punjab",
	" pop_2020 ": 30141373,
	col: 3,
	row: 2
};
var RJ = {
	name: "Rajasthan",
	" pop_2020 ": 81032689,
	col: 2,
	row: 4
};
var SK = {
	name: "Sikkim",
	" pop_2020 ": 690251,
	col: 7,
	row: 3
};
var TN = {
	name: "Tamil Nadu",
	" pop_2020 ": 77841267,
	col: 4,
	row: 8
};
var TG = {
	name: "Telangana",
	" pop_2020 ": 38510982,
	col: 4,
	row: 5
};
var TR = {
	name: "Tripura",
	" pop_2020 ": 4169794,
	col: 8,
	row: 4
};
var UP = {
	name: "Uttar Pradesh",
	" pop_2020 ": 237882725,
	col: 5,
	row: 3
};
var UT = {
	name: "Uttarakhand",
	" pop_2020 ": 11250858,
	col: 4,
	row: 3
};
var WB = {
	name: "West Bengal",
	" pop_2020 ": 99609303,
	col: 7,
	row: 4
};
var meta = {
	AN: AN,
	AP: AP,
	AR: AR,
	AS: AS,
	BR: BR,
	CH: CH,
	CT: CT,
	DN: DN,
	DL: DL,
	GA: GA,
	GJ: GJ,
	HR: HR,
	HP: HP,
	JK: JK,
	JH: JH,
	KA: KA,
	KL: KL,
	LA: LA,
	LD: LD,
	MP: MP,
	MH: MH,
	MN: MN,
	ML: ML,
	MZ: MZ,
	NL: NL,
	OR: OR,
	PY: PY,
	PB: PB,
	RJ: RJ,
	SK: SK,
	TN: TN,
	TG: TG,
	TR: TR,
	UP: UP,
	UT: UT,
	WB: WB
};

d3.selection.prototype.appendSelect = d3Appendselect.appendSelect;
/**
 * Write your chart as a class with a single draw method that draws
 * your chart! This component inherits from a base class you can
 * see and customize in the baseClasses folder.
 */

var MyChartModule = /*#__PURE__*/function () {
  function MyChartModule() {
    _classCallCheck(this, MyChartModule);

    _defineProperty(this, "defaultProps", {
      cols: 9,
      rows: 8,
      cat: 'cases',
      lineVar: 'avg7day',
      scaleType: 'adjusted',
      stroke: '#888',
      strokeWidth: 1.5,
      margin: {
        top: 10,
        right: 10,
        bottom: 15,
        left: 10
      },
      innerMargin: {
        top: 10,
        right: 10,
        bottom: 20,
        left: 10
      },
      chart_formats: {
        // Format number for axis
        number: '~s',
        // Format number for tooltip
        number_tooltip: ', ',
        // Date on tooltip
        date_tooltip: '%B %e',
        // Date format for the x axis
        date: '%b %e'
      }
    });
  }

  _createClass(MyChartModule, [{
    key: "selection",
    value: function selection(selector) {
      if (!selector) return this._selection;
      this._selection = d3.select(selector);
      return this;
    }
  }, {
    key: "data",
    value: function data(newData) {
      if (!newData) return this._data || this.defaultData;
      this._data = newData;
      return this;
    }
  }, {
    key: "props",
    value: function props(newProps) {
      if (!newProps) return this._props || this.defaultProps;
      this._props = merge__default['default'](this._props || this.defaultProps, newProps);
      return this;
    }
  }, {
    key: "getStatesArray",
    value: function getStatesArray(data, props) {
      /*  THIS IS WHERE WE FORMAT OUR DATA TO DRAW THE CHARTS
          1) CREATE AN OBJECT FOR EACH STATE
          2) GET THE COL AND ROW FOR EACH STATE FROM `meta` LOOKUP
          3) IF MOBILE, CALCULATE GRID PLACEMENT BASED ON SCREEN WIDTH
          4) CREATE SERIES FOR EACH STATE BASED ON VALUE OF `props.cat` ('deaths' OR 'cases')
      */
      //Create empty array to return at the end of this function.
      var statesArray = []; //Default to a 6 column grid (not a cartogram)
      //Use rowIndex and colIndex to keep track of rows and columns.

      var rowIndex = 1;
      var colIndex = 1;
      Object.keys(data.states).forEach(function (key, i) {
        //If index is divisible by the number of columns
        //Start a new row and reset the column to 0.
        if (i % props.cols == 0 && i > 2) {
          rowIndex++;
          colIndex = 1;
        } //Format our data to include 7day average.


        meta[key].pop_2020;
        var series = [];
        data.states[key].reported[props.cat].forEach(function (d, index) {
          var lastWeek = data.states[key].reported[props.cat].slice(index - 6, index + 1).filter(function (d) {
            return d != null;
          });
          var obj = {
            val: d,
            avg7day: lastWeek.length == 7 ? d3.mean(lastWeek) : null
          };
          series.push(obj);
        }); //Package each state as an object.

        var obj = {
          row: rowIndex,
          col: colIndex,
          key: key,
          name: data.states[key].name,
          max: d3.max(series, function (d) {
            return d[props.lineVar];
          }),
          series: series
        }; //If not mobile, pull the rows and column assignments from the metadata

        if (!props.isMobile) {
          obj.col = meta[key].col;
          obj.row = meta[key].row;
        }

        statesArray.push(obj);
        colIndex++; //Tick up column index
      }); //Get the max value of all max values for the uniform scale version.

      props.uniformMax = d3.max(statesArray, function (d) {
        return d.max;
      }); //Return our formatted data as an array.

      return statesArray;
    }
  }, {
    key: "getArrow",
    value: function getArrow(numbers) {
      /* LOGIC TAKEN FROM GURMAN'S US CARTOGRAM ARROWS */
      var downArrow = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" class="svg-inline--fa fa-caret-down fa-w-10 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>';
      var upArrow = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-up" class="svg-inline--fa fa-caret-up fa-w-10 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z"></path></svg>';
      var latest = numbers[numbers.length - 2].val;
      var previousWeek = numbers[numbers.length - 8].val;
      var weekBefore = numbers[numbers.length - 15].val;

      if (latest > previousWeek && previousWeek > weekBefore) {
        return upArrow;
      } else if (latest < previousWeek && previousWeek < weekBefore) {
        return downArrow;
      } else {
        return '';
      }
    }
  }, {
    key: "draw",

    /**
     * Write all your code to draw your chart in this function!
     * Remember to use appendSelect!
     */
    value: function draw() {
      var _this = this;

      var data = this.data(); // Data passed to your chart

      var props = this.props(); // Props passed to your chart

      var locale = new D3Locale__default['default'](props.locale);
      var dateFormat = locale.formatTime('%b. %d');
      var numberFormat = locale.format(',');
      var margin = props.margin,
          innerMargin = props.innerMargin;
      var container = this.selection().node();

      var _container$getBoundin = container.getBoundingClientRect(),
          containerWidth = _container$getBoundin.width; // Respect the width of your container!


      var width = containerWidth - margin.left - margin.right;
      props.isMobile = width < 500;

      if (props.isMobile) {
        props.cols = 6;
        props.rows = Object.keys(data.states).length / 6;
        props.innerMargin.top = 5;
        props.innerMargin.right = 5;
        props.innerMargin.bottom = 10;
        props.innerMargin.left = 5;
      }

      var wh = width / props.cols; //width and height of squares for our grid.

      var height = wh * props.rows;
      var xGridDom = d3.range(1, props.cols + 1);
      var yGridDom = d3.range(1, props.rows + 1);
      var statesArray = this.getStatesArray(data, props);
      var xGridScale = d3.scaleBand().rangeRound([0, wh * props.cols]).padding(0.05).domain(xGridDom);
      var yGridScale = d3.scaleBand().rangeRound([0, wh * props.rows]).padding(0.05).domain(yGridDom);
      var xScale = d3.scaleLinear().range([0, wh - innerMargin.left - innerMargin.right]).domain([0, data.series.length - 1]);
      var inverseX = d3.scaleLinear().domain([0, wh - innerMargin.left - innerMargin.right]);
      var scaleXTime = d3.scaleTime().domain([new Date(data.series[0]), new Date(data.series[data.series.length - 1])]).range([0, wh - innerMargin.left - innerMargin.right]);
      var plot = this.selection().appendSelect('svg') // 👈 Use appendSelect instead of append for non-data-bound elements!
      .attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).appendSelect('g.plot').attr('transform', "translate(".concat(margin.left, ",").concat(margin.top, ")"));
      var stateGroup = plot.selectAll('.state-g').data(statesArray).join('g').attr('class', 'state-g').attr('transform', function (d) {
        var xPos = xGridScale(d.col);
        var yPos = yGridScale(d.row);
        return "translate(".concat(xPos, ",").concat(yPos, ")");
      });
      this.selection().selectAll('div.state-name').data(statesArray, function (d) {
        return d.key;
      }).join('div').attr('class', 'state-name').html(function (d) {
        return "".concat(_this.getArrow(d.series), " <p>").concat(d.key, "</p>");
      }).style('left', function (d) {
        var xPos = xGridScale(d.col) + margin.left;
        return "".concat(xPos, "px");
      }).style('top', function (d) {
        var yPos = yGridScale(d.row) + margin.top;
        return "".concat(yPos, "px");
      });
      var statePlot = stateGroup.appendSelect('g.state-plot').attr('transform', "translate(".concat(innerMargin.left, ",").concat(innerMargin.top, ")"));
      statePlot.appendSelect('path.line').style('stroke', props.stroke).style('stroke-width', props.strokeWidth).transition().attr('d', function (d) {
        return makeLine(d);
      });

      function makeLine(datum) {
        var yMax = props.scaleType == 'adjusted' ? datum.max : props.uniformMax;
        datum.yScale = d3.scaleLinear().range([wh - innerMargin.top - innerMargin.bottom, 0]).domain([0, yMax]);
        var line = d3.line().defined(function (d) {
          return d[props.lineVar] !== null;
        }).x(function (d, i) {
          return xScale(i);
        }).y(function (d, i) {
          return datum.yScale(d[props.lineVar]);
        });
        return line(datum.series);
      }

      var touchBox = stateGroup.appendSelect('g.dummy-container').appendSelect('rect').attr('height', wh).attr('width', wh).style('cursor', 'crosshair').style('opacity', 0);
      touchBox.on('mouseover mousemove touchenter touchstart touchmove', function (event, d) {
        if (!event) return;

        _this.selection().selectAll('.tooltip').remove();

        var parent = event.srcElement.parentNode;
        var mx = event.pageX - parent.getBoundingClientRect().left - innerMargin.left;
        inverseX.range([0, data.series.length]);
        var index = Math.round(inverseX(mx));
        index = index < 0 ? 0 : index >= data.series.length ? data.series.length - 2 : index;
        var datum = d.series[index];
        var datumY = datum[props.lineVar];
        var date = new Date(data.series[index]);

        if (datum[props.lineVar] == null) {
          d3.selectAll('.tooltip').remove();
          return true;
        } // Hacky way to ensure date stays in US timezones


        date.setHours(date.getHours() + 6);
        var x = scaleXTime(date);
        var y = d.yScale(datumY);
        d3.select(parent).appendSelect('circle.tooltip').attr('r', 3).attr('cx', x + innerMargin.left).attr('cy', y + innerMargin.top).style('fill', 'white').style('stroke', 'white').style('stroke-width', 1);
        d3.select(parent).appendSelect('text.tooltip.datum').attr('x', x).attr('y', y < d.yScale.range()[1] / 2 ? y + 20 : y - 7).style('text-align', 'center').style('text-anchor', x > wh / 2 ? 'end' : 'start').text(numberFormat(round(datum[props.lineVar], 0)));
        d3.select(parent).appendSelect('text.tooltip.date').attr('x', x).attr('y', d.yScale.range()[0] + 5 + innerMargin.bottom).text(dateFormat(date)).style('text-anchor', x > wh / 2 ? 'end' : 'start');
      });
      touchBox.on('mouseout touchleave touchcancel', function (d, i, nodes) {
        d3.selectAll('.tooltip').remove();
      });
      return this; // Generally, always return the chart class from draw!
    }
  }]);

  return MyChartModule;
}();

module.exports = MyChartModule;