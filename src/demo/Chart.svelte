<!-- ⭐ Write an interactive DEMO of your chart in this component.
Follow the notes below! -->
<script>
  export let responsive; // eslint-disable-line
  import { afterUpdate, onMount } from 'svelte';
  import Docs from './App/Docs.svelte';
  import Explorer from './App/Explorer.svelte';
  import MyChartModule from '../js/index';
  import sampleData from '../js/india-sample.json';
  import * as d3 from 'd3';

  let chart = new MyChartModule();
  let chartContainer;

  // 🎈 Tie your custom props back together into one chartProps object.
  $: chartProps = {};

  afterUpdate(() => {
    // 💪 Create a new chart instance of your module.
    chart = new MyChartModule();
    // ⚡ And let's use your chart!
    chart
      .selection(chartContainer)
      .data(sampleData) // Pass your chartData
      .props(chartProps) // Pass your chartProps
      .draw(); // 🚀 DRAW IT!
  });

  onMount(() => {
    clicked('cats', chart.defaultProps.cat);
    clicked('scales', chart.defaultProps.scaleType);
  });

  const clicked = (grp, val) => {
    d3.selectAll(`.btn-group.${grp} button`).classed('active', false);
    d3.selectAll(`.btn-group.${grp} button.${val}`).classed('active', true);
  };
</script>

<div id="my-chart-module-container" bind:this={chartContainer} />

<div class="chart-options">
  <!-- ✏️ Create buttons that update your data/props variables when they're clicked! -->

  <div class="btn-group cats">
    <button
      class="cases"
      on:click={() => {
        chartProps.cat = 'cases';
        clicked('cats', 'cases');
      }}
      >Cases
    </button>
    <button
      class="deaths"
      on:click={() => {
        chartProps.cat = 'deaths';
        clicked('cats', 'deaths');
      }}
      >Deaths
    </button>
  </div>

  <div class="btn-group scales">
    <button
      class="adjusted"
      on:click={() => {
        chartProps.lineVar = 'avg7day';
        chartProps.scaleType = 'adjusted';
        clicked('scales', 'adjusted');
      }}
      >Adjusted scale
    </button>
    <button
      class="uniform"
      on:click={() => {
        chartProps.lineVar = 'avg7day';
        chartProps.scaleType = 'uniform';
        clicked('scales', 'uniform');
      }}
      >Uniform scale
    </button>
    <button
      class="per100k"
      on:click={() => {
        chartProps.lineVar = 'per100k';
        chartProps.scaleType = 'uniform';
        clicked('scales', 'per100k');
      }}
      >Per 100K
    </button>
  </div>
</div>

<!-- ⚙️ These components will automatically create interactive documentation for you chart! -->
<Docs />
<Explorer title="Data" data={chart.data()} />
<Explorer title="Props" data={chart.props()} />

<!-- 🖌️ Style your demo page here -->
<style lang="scss">
  .chart-options {
    button {
      padding: 5px 15px;
    }
  }
</style>
