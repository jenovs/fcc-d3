
let data = [];
const w = 900;
const h = 500;
const padding = 50;
let barWidth = 0;

fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(res => res.json())
  .then(json => data = json.data)
  .then(() => {
    barWidth = w / data.length;
    drawChart();
  })
  .catch(err => console.log(err));

function drawChart() {

  const maxY = d3.max(data, d => d[1]);

  const yScale = d3.scaleLinear()
    .domain([0, maxY])
    .range([h, 0+padding]);

  const xScale = d3.scaleTime()
    .domain([new Date(data[0][0]), new Date(data[data.length-1][0])])
    .range([0, w]);

  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale);

  const tooltip = d3
    .select('#app')
    .append('div')
    .attr('id', 'tooltip')
    .attr('class', 'tooltip')
    .style('opacity', 0 )
    .style('background-color', 'gray')
    .style('position', 'absolute')
    .style('transform', 'translateY(200px)')

  const svg = d3
    .select('#app')
    .append('svg')
    .attr('width', "100%")
    .attr('height', h);

  svg.selectAll('rect')
    .data(data)
    .enter()
    // Bar
    .append('rect')
    .attr('class', 'bar')
    .attr('width', barWidth)
    .attr('height', d => h - yScale(d[1]))
    .attr('data-gdp', d => d[1])
    .attr('data-date', d => d[0])
    .attr('x', (d, i) => padding + i * barWidth)
    .attr('y', (d, i) => yScale(d[1]) - padding)
    // Tooltip
    .on('mouseover', d => {
      tooltip
        .transition()
          .duration(100)
          .style('opacity', 0.95)
      tooltip
        .attr('data-date', d[0])
        .html(`${d[0]}<br>$${d[1]} Billion`)
        .style('left', () => {
          let pageX = d3.event.pageX;
          return pageX > 950 ? (pageX-160) + 'px' : (pageX+20) + 'px'
        })
        .style('top', (d3.event.pageY - padding - 150) + 'px')
    })
    .on('mouseout', d => {
      tooltip
      .transition()
        .duration(200)
        .style('opacity', 0)
    })

  // x-axis
  svg.append('g')
    .attr('transform', 'translate(' + padding + ',' + (h - padding) + ' )')
    .attr('id', 'x-axis')
    .call(xAxis)

  // y-axis
  svg.append('g')
    .attr("transform", "translate(50, " + (-padding) + ")")
    .attr('id', 'y-axis')
    .call(yAxis)

  // y-axis text
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -75)
    .attr('y', 55)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text('USD Billion')

  // Title
  svg.append('text')
    .attr('x', w/2)
    .attr('y', 30)
    .attr('class', 'title-text')
    .attr('id', 'title')
    .style("text-anchor", "middle")
    .text('US GDP')
}
