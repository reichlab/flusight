<style lang="scss">
.axis {
    font: 10px sans-serif;
}

.axis path,
.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}

.line {
    fill: none;
    stroke: steelblue;
    stroke-width: 1.5px;
}

</style>

<template>
    <div class="column">
        <div id="chart">
        </div>
    </div>
</template>

<script>
  export default {
    ready() {
      // Use d3 v4 (vue-d3)
      const d3 = this.$d3
      // Get div dimensions
      let chartDiv = document.getElementById('chart'),
          divWidth = chartDiv.offsetWidth,
          divHeight = 300

      // Create blank chart
      let margin = {
        top: 10, right: 20, bottom: 30, left: 20
      },
          width = divWidth - margin.left - margin.right,
          height = divHeight - margin.top - margin.bottom

      let xScale = d3.scaleLinear().range([0, width]),
          yScale = d3.scaleLinear().range([height, 0])

      let line = d3.line()
          .x(d => xScale(d.week))
          .y(d => yScale(d.value))

      // Add svg
      let svg = d3.select('#chart').append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      let data = [
        {week: 1, value: 23},
        {week: 2, value: 43},
        {week: 6, value: 12}
      ]

      xScale.domain(d3.extent(data, d => d.week))
      yScale.domain(d3.extent(data, d => d.value))

      svg.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xScale))

      svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Weighted ILI (%)')

      svg.append('path')
        //.datum(data)
        .attr('class', 'line')
        .attr('d', line(data))
    }
  }
</script>
