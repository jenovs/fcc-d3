const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
const data = [];

d3.json(url, (err, json) => {
  if (err) return console.log(err);
  data.push(...json);
  drawChart();
});

function drawChart() {
  // console.log('drawing...');
  console.table(data)

  // Height and width of graph
  const h = 500;
  const w = 800;
  // Margins
  const margin = {
    top: 60,
    right: 30,
    bottom: 30,
    left: 50
  }

  const maxX = d3.max(data, d => d.Year);
  const minX = d3.min(data, d => d.Year);
  const maxY = d3.extent(data, d => d.Time);

  const xScale = d3.scaleLinear()
    .domain([minX-1, maxX+1])
    .range([margin.left, w-margin.right]);

  const yScale = d3.scaleTime()
    .domain([d3.timeParse('%M:%S')(maxY[0]), d3.timeParse('%M:%S')(maxY[1])])
    // set start of y-axis to be the top side of the graph
    // and length to be the height of the graph
    .range([margin.top, h]);

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format('d'));

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat('%M:%S'));

  const svg = d3
    .select('#app')
    .append('svg')
    // Set width and height of the svg element
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .attr('class', 'graph')


  const tooltip = d3
    .select('#app')
    .append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')



  // Chart title
  svg.append('text')
    .attr('id', 'title')
    .attr('x', w/2)
    .attr('y', margin.top)
    .style('font-size', '2rem')
    .style('text-anchor', 'middle')
    .text('Doping in Professional Bicycle Racing')

  // Legend
  const legend = svg.selectAll('.legend')
    .data([['No doping allegations', 'green'], ['Riders with doping allegations', 'red']])
    .enter()
    .append('g')
    .attr('id', 'legend')
    .attr('class', 'legend')
    .attr('transform', (d, i) => {
      return `translate(${w-margin.right*3}, ${200 + i * 25 + 10})`
    })

  legend.append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .attr('y', 2)
    .style('fill', d => d[1])

  legend.append('text')
    .attr('x', -250)
    .attr('y', 15)
    .text(d => d[0])

  // x-axis
  svg.append('g')
    // Move x-axis down to graph's bottom
    .attr('transform', `translate(${0}, ${h + margin.top})`)
    .attr('id', 'x-axis')
    .call(xAxis);

  // y-axis
  svg.append('g')
    // Move y-axis right and down so starting point is top left of the graph
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('id', 'y-axis')
    .call(yAxis);



    // Dots
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    // Apply top margin
    .style('transform', `translateY(${margin.top}px)`)
    .attr('class', 'dot')
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => d3.timeParse("%M:%S")(d.Time))
    .attr('cx', d => xScale(d.Year))
    .attr('cy', d => yScale(d3.timeParse("%M:%S")(d.Time)))
    .attr('r', '7')
    .style('fill', d => d.Doping ? 'red' : 'green')
    .on('mouseover', d => {
      tooltip
        .transition()
          .duration(300)
          .style('opacity', 0.9)
      tooltip
        .attr('data-year', d.Year)
        .html(`
          ${d.Name}: ${d.Nationality}<br/>
          Time: ${d.Time}<br/>
          ${d.Doping && '<br/>'}
          ${d.Doping}`)
        .style('left', () => d3.event.pageX + 20 + 'px')
        .style('top', (d3.event.pageY - margin.top) + 'px')
        // .style('display', 'inherit')
    })
    .on('mouseout', d => {
      tooltip
      .transition()
        .duration(200)
        .style('opacity', 0)
    })
}
