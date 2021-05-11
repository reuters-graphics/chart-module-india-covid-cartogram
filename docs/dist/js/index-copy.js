import * as d3 from '../../_snowpack/pkg/d3.js';
import { appendSelect } from '../../_snowpack/pkg/d3-appendselect.js';
import merge from '../../_snowpack/pkg/lodash/merge.js';
import pop from '../data/india_states_meta.json.proxy.js';

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
      console.log(`${key}***${data.states[key].name}`);

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
        d = d ? d : 0; //Change null to zero.
        let lastWeek = data.states[key].reported[props.cat].slice(
          index - 6,
          index + 1
        );

        let obj = {
          val: d ? d : 0,
          avg7day: +d3.format('.2f')(d3.mean(lastWeek)),
          per100k: +d3.format('.2f')((d / pop2020) * 100000),
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

    return statesArray;
  }

  defaultProps = {
    aspectHeight: 0.7,
    cols: 8,
    rows: 8,
    cat: 'cases',
    lineVar: 'avg7day',
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
  };

  /**
   * Write all your code to draw your chart in this function!
   * Remember to use appendSelect!
   */
  draw() {
    const data = this.data(); // Data passed to your chart
    const props = this.props(); // Props passed to your chart

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

    //yScale defined within each state group.

    const plot = this.selection()
      .appendSelect('svg') // 👈 Use appendSelect instead of append for non-data-bound elements!
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .appendSelect('g.plot')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    let stateGroup = plot
      .selectAll('.state-g')
      .data(statesArray)
      .enter()
      .append('g')
      .attr('class', 'state-g')
      .attr('transform', (d) => {
        let xPos = xGridScale(d.col);
        let yPos = yGridScale(d.row);
        return `translate(${xPos},${yPos})`;
      });

    stateGroup
      .appendSelect('rect')
      .attr('class', 'state')
      .attr('width', xGridScale.bandwidth())
      .attr('height', yGridScale.bandwidth());

    stateGroup
      .appendSelect('text.abbr')
      .text((d) => d.key)
      .attr('text-anchor', 'middle')
      .attr('x', xGridScale.bandwidth() / 2)
      .attr('y', 20);

    let statePlot = stateGroup
      .appendSelect('g.state-plot')
      .attr('transform', `translate(${innerMargin.left},${innerMargin.top})`);

    statePlot.appendSelect('path').attr('d', (d) => makeLine(d));

    function makeLine(datum) {
      let max = d3.max(datum.series, (d) => d[props.lineVar]);

      let yScale = d3
        .scaleLinear()
        .range([wh - innerMargin.top - innerMargin.bottom, 0])
        .domain([0, max]);

      let line = d3
        .line()
        .defined((d) => !isNaN(d[props.lineVar]))
        .x((d, i) => xScale(i))
        .y((d, i) => {
          if (i == 0) {
            console.log(d[props.lineVar]);
          }

          return yScale(d[props.lineVar]);
        });

      return line(datum.series);
    }

    return this; // Generally, always return the chart class from draw!
  }
}

export default MyChartModule;
