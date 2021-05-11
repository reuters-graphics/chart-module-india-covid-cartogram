import * as d3 from 'd3';
import * as utils from './utils.js';
import { appendSelect } from 'd3-appendselect';
import merge from 'lodash/merge';
import pop from '../data/india_states_meta.json';
import D3Locale from '@reuters-graphics/d3-locale';

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
    //Create empty array to return at the end of this function.
    let statesArray = [];

    //Default to a simple grid.
    //Use rowIndex and colIndex to keep track of rows and columns.
    let rowIndex = 0;
    let colIndex = 0;
    Object.keys(data.states).forEach((key, i) => {
      //If index is divisible by the number of columns
      //Start a new row and reset the column to 0.
      if (i % props.cols == 0 && i > 2) {
        rowIndex++;
        colIndex = 0;
      }

      //Format our data to include per 100K and 7day average.
      let pop2020 = pop[key].pop_2020;
      let series = [];
      data.states[key].reported[props.cat].forEach((d, index) => {
        let lastWeek = data.states[key].reported[props.cat]
          .slice(index - 6, index + 1)
          .filter((d) => d != null);

        let obj = {
          val: d,
          avg7day: lastWeek.length == 7 ? d3.mean(lastWeek) : null,
          //per100k: d ? ((d / pop2020) * 100000)
        };

        series.push(obj);
      });

      let obj = {
        row: rowIndex,
        col: colIndex,
        key: key,
        name: data.states[key].name,
        series: series,
        max: d3.max(series, (d) => d[props.lineVar]),
      };

      statesArray.push(obj);
      colIndex++; //Tick up column index
    });

    props.uniformMax = d3.max(statesArray, (d) => d.max);

    return statesArray;
  }

  getArrow(numbers) {
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
    aspectHeight: 0.7,
    cols: 8,
    rows: 8,
    cat: 'cases',
    lineVar: 'avg7day',
    scaleType: 'adjusted',
    stroke: '#888',
    strokeWidth: 1.5,
    margin: {
      top: 20,
      right: 20,
      bottom: 25,
      left: 30,
    },
    innerMargin: {
      top: 10,
      right: 10,
      bottom: 20,
      left: 10,
    },
    fill: 'grey',
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
    const height =
      containerWidth * props.aspectHeight - margin.top - margin.bottom;

    let wh = width / props.cols;

    let xGridDom = d3.range(0, props.cols);
    let yGridDom = d3.range(0, props.rows);

    let statesArray = this.getStatesArray(data, props);

    const xGridScale = d3
      .scaleBand()
      .rangeRound([0, wh * props.cols])
      .padding(0.05)
      .domain(xGridDom);

    const yGridScale = d3
      .scaleBand()
      .rangeRound([0, wh * props.rows])
      .padding(0.05)
      .domain(yGridDom);

    const xScale = d3
      .scaleLinear()
      .range([0, wh - innerMargin.left - innerMargin.right])
      .domain([0, data.series.length - 1]);

    const inverseX = d3
      .scaleLinear()
      .domain([0, wh - innerMargin.left - innerMargin.right]);

    const scaleXTime = d3
      .scaleTime()
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

    let stateGroup = plot
      .selectAll('.state-g')
      .data(statesArray)
      .join('g')
      .attr('class', 'state-g')
      .attr('transform', (d) => {
        let xPos = xGridScale(d.col);
        let yPos = yGridScale(d.row);
        return `translate(${xPos},${yPos})`;
      });

    this.selection()
      .selectAll('div.state-name')
      .data(statesArray, (d) => d.key)
      .join('div')
      .attr('class', 'state-name')
      //.html(d=> d.key)
      .html((d) => {
        return `${this.getArrow(d.series)} <p>${d.key}</p>`;
      })
      .style('left', (d) => {
        let xPos = xGridScale(d.col) + margin.left;
        return `${xPos}px`;
      })
      .style('top', (d) => {
        let yPos = yGridScale(d.row) + margin.top;
        return `${yPos}px`;
      });

    let statePlot = stateGroup
      .appendSelect('g.state-plot')
      .attr('transform', `translate(${innerMargin.left},${innerMargin.top})`);

    statePlot
      .appendSelect('path.line')
      .style('stroke', props.stroke)
      .style('stroke-width', props.strokeWidth)
      .transition()
      .attr('d', (d) => makeLine(d));

    function makeLine(datum) {
      let yMax = props.scaleType == 'adjusted' ? datum.max : props.uniformMax;

      datum.yScale = d3
        .scaleLinear()
        .range([wh - innerMargin.top - innerMargin.bottom, 0])
        .domain([0, yMax]);

      let line = d3
        .line()
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
        let mx =
          event.pageX - parent.getBoundingClientRect().left - innerMargin.left;
        inverseX.range([0, data.series.length]);

        let index = Math.round(inverseX(mx));

        index =
          index < 0
            ? 0
            : index >= data.series.length
            ? data.series.length - 2
            : index;

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
          .text(numberFormat(utils.round(datum[props.lineVar], 0)));

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
