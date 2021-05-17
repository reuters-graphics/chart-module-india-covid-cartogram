import 'd3-transition';

import * as d3 from 'd3-selection';

import { max, mean, range } from 'd3-array';
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale';

import D3Locale from '@reuters-graphics/d3-locale';
import { appendSelect } from 'd3-appendselect';
import { line as d3Line } from 'd3-shape';
import merge from 'lodash/merge';
import meta from '../data/india_states_meta.json';
import { round } from './utils.js';

d3.selection.prototype.appendSelect = appendSelect;

/**
 * Write your chart as a class with a single draw method that draws
 * your chart! This component inherits from a base class you can
 * see and customize in the baseClasses folder.
 */
class MyChartModule {
  selection(selector) {
    if (!selector) return this._selection;
    this._selection = d3.select(selector);
    return this;
  }

  data(newData) {
    if (!newData) return this._data || this.defaultData;
    this._data = newData;
    return this;
  }

  props(newProps) {
    if (!newProps) return this._props || this.defaultProps;
    this._props = merge(this._props || this.defaultProps, newProps);
    return this;
  }

  getStatesArray(data, props) {
    /*  THIS IS WHERE WE FORMAT OUR DATA TO DRAW THE CHARTS
        1) CREATE AN OBJECT FOR EACH STATE
        2) GET THE COL AND ROW FOR EACH STATE FROM `meta` LOOKUP
        3) IF MOBILE, CALCULATE GRID PLACEMENT BASED ON SCREEN WIDTH
        4) CREATE SERIES FOR EACH STATE BASED ON VALUE OF `props.cat` ('deaths' OR 'cases')
    */

    // Create empty array to return at the end of this function.
    const statesArray = [];

    // Default to a 6 column grid (not a cartogram)
    // Use rowIndex and colIndex to keep track of rows and columns.
    let rowIndex = 1;
    let colIndex = 1;
    Object.keys(data.states).forEach((key, i) => {
      // If index is divisible by the number of columns
      // Start a new row and reset the column to 0.
      if (i % props.cols === 0 && i > 2) {
        rowIndex++;
        colIndex = 1;
      }

      // Format our data to include 7day average.
      const pop2020 = meta[key].pop_2020;
      const series = [];
      data.states[key].reported[props.cat].forEach((d, index) => {
        const lastWeek = data.states[key].reported[props.cat]
          .slice(index - 6, index + 1)
          .filter((d) => d != null);

        const obj = {
          val: d,
          avg7day: lastWeek.length === 7 ? mean(lastWeek) : null,
        };

        obj.per100k =
          obj.avg7day === 0 ?
              0 :
            obj.avg7day > 0 ?
                (obj.avg7day / pop2020) * 100000 :
              null;

        series.push(obj);
      });

      // Package each state as an object.
      const obj = {
        row: rowIndex,
        col: colIndex,
        key: key,
        name: data.states[key].name,
        max: max(series, (d) => d[props.lineVar]),
        series: series,
      };

      // If not mobile, pull the rows and column assignments from the metadata
      if (!props.isMobile) {
        obj.col = meta[key].col;
        obj.row = meta[key].row;
      }

      statesArray.push(obj);
      colIndex++; // Tick up column index
    });

    // Get the max value of all max values for the uniform scale version.
    props.uniformMax = max(statesArray, (d) => d.max);

    // Return our formatted data as an array.
    return statesArray;
  }

  getArrow(numbers) {
    /* LOGIC TAKEN FROM GURMAN'S US CARTOGRAM ARROWS */
    const downArrow =
      '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" class="svg-inline--fa fa-caret-down fa-w-10 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>';
    const upArrow =
      '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-up" class="svg-inline--fa fa-caret-up fa-w-10 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z"></path></svg>';

    const latest = numbers[numbers.length - 2].val;
    const previousWeek = numbers[numbers.length - 8].val;
    const weekBefore = numbers[numbers.length - 15].val;

    if (latest > previousWeek && previousWeek > weekBefore) {
      return upArrow;
    } else if (latest < previousWeek && previousWeek < weekBefore) {
      return downArrow;
    } else {
      return '';
    }
  }

  defaultProps = {
    cols: 8,
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
      left: 10,
    },
    innerMargin: {
      top: 24,
      right: 10,
      bottom: 20,
      left: 10,
    },
    chart_formats: {
      // Format number for axis
      number: '~s',

      // Format number for tooltip
      number_tooltip: ', ',

      // Date on tooltip
      date_tooltip: '%B %e',

      // Date format for the x axis
      date: '%b %e',
    },
  };

  /**
   * Write all your code to draw your chart in this function!
   * Remember to use appendSelect!
   */
  draw() {
    const data = this.data(); // Data passed to your chart
    const props = this.props(); // Props passed to your chart

    const locale = new D3Locale(props.locale);
    const dateFormat = locale.formatTime('%b. %d');
    const numberFormat = locale.format(',');

    const { margin, innerMargin } = props;

    const container = this.selection().node();
    const { width: containerWidth } = container.getBoundingClientRect(); // Respect the width of your container!

    const width = containerWidth - margin.left - margin.right;

    // DEFAULT TO A SIMPLE GRID IF CONTAINER IS LESS THAN 500 PIXELS WIDE.
    props.isMobile = width < 500;

    if (props.isMobile) {
      props.cols = 4;
      props.rows = Object.keys(data.states).length / props.cols;

      // SMALLER INNER MARGINS.
      // props.innerMargin.top = 5;
      // props.innerMargin.right = 5;
      // props.innerMargin.bottom = 10;
      // props.innerMargin.left = 5;
    }

    const wh = width / props.cols; // width and height of squares for our grid.
    const height = wh * props.rows;

    // SET THE DOMAIN FOR THE SCALEBANDS THAT DETERMINE STATE PLACEMENT
    const xGridDom = range(1, props.cols + 1);
    const yGridDom = range(1, props.rows + 1);

    // Format the data (See function for documentation)
    const statesArray = this.getStatesArray(data, props);

    const xGridScale = scaleBand()
      .rangeRound([0, wh * props.cols])
      .padding(0.05)
      .domain(xGridDom);

    const yGridScale = scaleBand()
      .rangeRound([0, wh * props.rows])
      .padding(0.05)
      .domain(yGridDom);

    // Inner x scale for drawing lines along the date axis.
    const xScale = scaleLinear()
      .range([0, wh - innerMargin.left - innerMargin.right])
      .domain([0, data.series.length - 1]);

    // inverse scale for getting tooltip dates.
    const inverseX = scaleLinear().domain([
      0,
      wh - innerMargin.left - innerMargin.right,
    ]);

    // works with inverse scale for getting tooltip dates.
    const scaleXTime = scaleTime()
      .domain([
        new Date(data.series[0]),
        new Date(data.series[data.series.length - 1]),
      ])
      .range([0, wh - innerMargin.left - innerMargin.right]);

    const plot = this.selection()
      .appendSelect('svg') // 👈 Use appendSelect instead of append for non-data-bound elements!
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .appendSelect('g.plot')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const stateGroup = plot
      .selectAll('.state-g')
      .data(statesArray)
      .join('g')
      .attr('class', 'state-g')
      .attr('transform', (d) => {
        const xPos = xGridScale(d.col);
        const yPos = yGridScale(d.row);
        return `translate(${xPos},${yPos})`;
      });

    this.selection()
      .selectAll('div.state-name')
      .data(statesArray, (d) => d.key)
      .join('div')
      .attr('class', 'state-name')
      .html((d) => {
        let display = meta[d.key].short.replace('-', '-<br/>');

        display = display.replace('Kashmir', '<br/>Kashmir');

        return `${this.getArrow(
          d.series
        )}<span class='display'>${display}</span>`;
      })
      .style('width', `${wh - 10}px`)
      .style('left', (d) => {
        const xPos = xGridScale(d.col) + margin.left;
        return `${xPos}px`;
      })
      .style('top', (d) => {
        const yPos = yGridScale(d.row) + margin.top;
        return `${yPos}px`;
      });

    const statePlot = stateGroup
      .appendSelect('g.state-plot')
      .attr('transform', `translate(${innerMargin.left},${innerMargin.top})`);

    statePlot
      .appendSelect('path.line')
      .style('stroke', props.stroke)
      .style('stroke-width', props.strokeWidth)
      .transition()
      .attr('d', (d) => makeLine(d));

    function makeLine(datum) {
      const yMax =
        props.scaleType === 'adjusted' ? datum.max : props.uniformMax;

      console.log(yMax);

      datum.yScale = scaleLinear()
        .range([wh - innerMargin.top - innerMargin.bottom, 0])
        .domain([0, yMax]);

      const line = d3Line()
        .defined((d) => d[props.lineVar] !== null)
        .x((d, i) => xScale(i))
        .y((d, i) => {
          return datum.yScale(d[props.lineVar]);
        });

      return line(datum.series);
    }

    const touchBox = stateGroup
      .appendSelect('g.dummy-container')
      .appendSelect('rect')
      .attr('height', wh)
      .attr('width', wh)
      .style('cursor', 'crosshair')
      .style('opacity', 0);

    touchBox.on(
      'mouseover mousemove touchenter touchstart touchmove',
      (event, d) => {
        if (!event) return;
        this.selection().selectAll('.tooltip').remove();
        const parent = event.srcElement.parentNode;
        const mx =
          event.pageX - parent.getBoundingClientRect().left - innerMargin.left;
        inverseX.range([0, data.series.length]);

        let index = Math.round(inverseX(mx));

        index =
          index < 0 ?
              0 :
            index >= data.series.length ?
                data.series.length - 2 :
              index;

        const datum = d.series[index];
        const datumY = datum[props.lineVar];
        const date = new Date(data.series[index]);

        if (datum[props.lineVar] == null) {
          d3.selectAll('.tooltip').remove();
          return true;
        }

        // Hacky way to ensure date stays in US timezones
        date.setHours(date.getHours() + 6);

        const x = scaleXTime(date);
        const y = d.yScale(datumY);
        d3.select(parent)
          .appendSelect('circle.tooltip')
          .attr('r', 3)
          .attr('cx', x + innerMargin.left)
          .attr('cy', y + innerMargin.top)
          .style('fill', 'white')
          .style('stroke', 'white')
          .style('stroke-width', 1);

        d3.select(parent)
          .appendSelect('text.tooltip.datum')
          .attr('x', x)
          .attr('y', y < d.yScale.range()[1] / 2 ? y + 20 : y - 7)
          .style('text-align', 'center')
          .style('text-anchor', x > wh / 2 ? 'end' : 'start')
          .text(numberFormat(round(datum[props.lineVar], 0)));

        d3.select(parent)
          .appendSelect('text.tooltip.date')
          .attr('x', x)
          .attr('y', d.yScale.range()[0] + 5 + innerMargin.bottom)
          .text(dateFormat(date))
          .style('text-anchor', x > wh / 2 ? 'end' : 'start');
      }
    );

    touchBox.on('mouseout touchleave touchcancel', (d, i, nodes) => {
      d3.selectAll('.tooltip').remove();
    });

    return this; // Generally, always return the chart class from draw!
  }
}

export default MyChartModule;
