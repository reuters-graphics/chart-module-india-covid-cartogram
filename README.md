![](./badge.svg)

# The India COVID cartogram module

See the [demo page](https://reuters-graphics.github.io/chart-module-india-covid-cartogram/).

### Install

```
$ yarn add https://github.com/reuters-graphics/chart-module-india-covid-cartogram.git
```

### Use

```javascript
import MyChartModule from '@reuters-graphics/chart-module-india-covid-cartogram';

const chart = new MyChartModule();

let myProps = {
  cat: 'cases', // `cases` or `deaths`
  lineVar: 'avg7day', //`avg7day` or `per100k`*
  scaleType: 'adjusted' //`adjusted`, `uniform`
}

//* Note: if `lineVar` is set to `per100k`,  `scaleType` should also be set to `uniform`.

// To create your chart, pass a selector string to the chart's selection method,
// as well as any props or data to their respective methods. Then call draw.
chart
  .selection('#chart')
  .data([1, 2, 3])
  .props({ stroke: 'orange' })
  .draw();

// You can call any method again to update the chart.
chart
  .data([3, 4, 5])
  .draw();

// Or just call the draw function alone, which is useful for resizing the chart.
chart.draw();
```

To apply this chart's default styles when using SCSS, simply define the variable `$MyChartModule-container` to represent the ID or class of the chart's container(s) and import the `_chart.scss` partial.

```CSS
$MyChartModule-container: '#chart';

@import '~@reuters-graphics/chart-module-india-covid-cartogram/src/scss/chart';
```

## Developing chart modules

Read more in the [DEVELOPING docs](./DEVELOPING.md) about how to write your chart module.