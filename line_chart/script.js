const dataset = data.dataset.data;

const w = 1000;
const h = 500;
const padding = 50;

// let offset = 1;
// const colors = "1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5"
// function handleClick() {
//   console.log('click');
//   let x = Math.random() > 0.5 ? -1 : 1;
//   offset = x * Math.random();
//   console.log(x, offset);
//   document.getElementById('app').innerHTML = '';
//   drawChart();
// }

const parseTime = d3.timeParse('%Y-%m-%d');

// const color = d3.scaleOrdinal(d3.schemeCategory20);

// const dataset2 = dataset.map(data => {
//   let temp = [];
//   temp.push(parseTime(data[0]))
//   temp.push(data[4] - 100 * offset);
//   return temp;
// })

// console.log(dataset);

function drawChart() {

  const dataset2 = dataset.map(data => {
    let temp = [];
    temp.push(parseTime(data[0]))
    temp.push(data[4] - 500 * offset);
    return temp;
  })


  const svg = d3
    .select('#app')
    .append('svg')
    .attr('width', w)
    .attr('height', h);


  const cleanData = [];
  dataset.forEach(d => {
    const temp = [];
    temp.push(parseTime(d[0]));
    temp.push(+d[4]);
    cleanData.push(temp);
  });

  const xScale = d3.scaleTime()
    .range([0, w])
    .domain(d3.extent(cleanData, d => d[0]))


  // console.log(d3.extent(cleanData, d => d[0]));
  const max = (d3.max(cleanData, d => d[1]));
  const min = (d3.min(cleanData, d => d[1]));
  const max2 = (d3.max(dataset2, d => d[1]));
  console.log(min, max, max2);

  const allMax = Math.max(max, max2)
  console.log(allMax);

  const yScale = d3.scaleLinear()
    .range([0, h])
    .domain([allMax + allMax * 0.1, 0])

  const drawLine = d3.line()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]))

  svg
    // .append('g')
    // .attr('transform', `translate(${0}, ${-200})`)
    .append('path')
    // .attr('transform', `translate(${0}, ${0})`)
    .datum(cleanData)
    .attr('fill', 'none')
    .attr('stroke', `#${colors.substr(25, 6)}`)
    .attr('stroke-width', 5)
    .attr('d', drawLine)

  svg
  .append('path')
  .datum(dataset2)
  .attr('fill', 'none')
  .attr('stroke', color())
  .attr('stroke-width', 2)
  .attr('d', drawLine)
}

drawChart();
