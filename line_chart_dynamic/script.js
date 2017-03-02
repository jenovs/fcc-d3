const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const dataObj = {};

dataObj.FB = formatData(FB.dataset.data);
dataObj.AAPL = formatData(AAPL.dataset.data);
dataObj.GOOG = formatData(GOOG.dataset.data);

const w1 = document.getElementById('app').clientWidth;
const h1 = document.getElementById('app').clientHeight;
console.log('w1, h1', w1, h1, window.innerWidth);
const w = window.innerWidth;
const h = 500;
const padding = 50;

let count = 0;

const svg = d3
  .select('#app')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

function changeScale() {
  console.log('= changeScale');
  const x = document.getElementById('app2')
  console.log(x.clientWidth);

  window.addEventListener('resize', changeColor)
  // x.addEventListener('click', () => console.log('click'))
  // .style.width = 300 + 'px';
  // console.log(x.offsetHeight);

}

function changeColor() {
  console.log('= changeColor');
  const x = document.getElementById('app2')
  console.log(x.clientWidth);
  if (x.clientWidth < 200)
  x.setAttribute('class', 'changed')
  if (x.clientWidth > 200)
  x.removeAttribute('class', '')
}

const Graph = {
  init() {
    this.currMax = 0;
    this.currMin = 0;
    this.period = []
  },

  // drawAxis() {
  //   const scales = getScales(this.currMin, this.currMax)
  //   const xAxis = d3.axisBottom(scales[0])
  //   const yAxis = d3.axisLeft(scales[1])
  // },

  drawChart(data, xScale, yScale, id) {
    console.log(data.length);
    // console.log(data, xScale, yScale, id);
    const t = d3.transition()
      .duration(1000)

    const drawLine = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))

    console.log('drawLine', drawLine);

    const chartLayer = svg.append('g')

    chartLayer.selectAll('.line')
      .data([data])
      .enter()
      .append('path')
      .attr('id', id)
      .attr('d', drawLine)
      .attr('fill', 'none')
      .attr('stroke', colorScale(Math.floor(Math.random() * 10)))
      .attr('stroke-width', 5)
      .attr("stroke-dasharray", function(d) {
        console.log(this);
        return this.getTotalLength()}
      )
      .attr("stroke-dashoffset", function(d) {return this.getTotalLength() * (-1)})
      .transition(t)
      .attr("stroke-dashoffset", 0)
  },

  getScales(min, max, time) {
    const xScale = d3.scaleTime()
      .range([0, w])
      .domain(time)

    const yScale = d3.scaleLinear()
      .range([padding, h-padding])
      .domain([max, 0])

    return [xScale, yScale];
  },

  redrawAll(count = 0) {
    // const max = currentMax
    console.log('redrawAll');
    console.log('currMax', this.currMax);

    const t = d3.transition()
      .duration(200);

    svg.selectAll('path')
      .transition(t)
      .style('opacity', 0)
      .remove();

    const keys = Object.keys(dataObj)
    for (let i = 0; i <= count; i++) {

      const time = d3.extent(dataObj[keys[i]], d => d[0])
      scales = this.getScales(this.currMin, this.currMax, time);
      this.drawChart(dataObj[keys[i]], scales[0], scales[1], i)
    }
  }
}

function formatData(arr) {
  const parseTime = d3.timeParse('%Y-%m-%d');
  const data = [];
  arr.forEach(d => {
    const temp = [];
    temp.push(parseTime(d[0]));
    temp.push(+d[4]);
    data.push(temp);
  });
  return data;
}

function getMax(arr) {
  let max = 0;
  arr.forEach(d => {
    if (d[1] > max) max = d[1];
  });
  return max;
}

function addGraph() {
  console.log('count', count);
  const keys = Object.keys(dataObj);

  const time = d3.extent(dataObj[keys[count]], d => d[0])
  let max = getMax(dataObj[keys[count]]);
  if (max > Graph.currMax) {
    Graph.currMax = max
    Graph.redrawAll(count)
  }
  scales = Graph.getScales(0 , Graph.currMax, time);
  Graph.drawChart(dataObj[keys[count]], scales[0], scales[1], keys[count])
  count++;
  console.log(count);
  if (count >= keys.length) count = 0;
}

function main() {
  let max = Graph.currMax;
  let newMax = Graph.currMax;

  for (let i in dataObj) {
    let tempMax = 0;
    dataObj[i].forEach(d => {
      if (d[1] > tempMax) {
        tempMax = d[1]
      }
    })

    if (tempMax > max) {
      newMax = tempMax;
      Graph.currMax = newMax;
      Graph.redrawAll()
      max = newMax;
    } else {
      const time = d3.extent(dataObj[i], d => d[0])
      scales = this.getScales(this.currMin, this.currMax, time);
      this.drawChart(dataObj[i], scales[0], scales[1], i)
    }
  }
}

Graph.init();
// Graph.redrawAll();
// main();
