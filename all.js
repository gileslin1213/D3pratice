var data = [
  { x: 23, y: 10, text: 'begun' },
  { x: 30, y: 40, text: 'today' },
  { x: 40, y: 80, text: 'plan1' },
  { x: 65, y: 160, text: 'retired' },
  { x: 80, y: 0, text: 'die' }
];

var margin = { top: 40, right: 20, bottom: 30, left: 20 };
var width = $('#chart').width() - margin.right - margin.left;
var height = $('#chart').width() / 2 - margin.top - margin.bottom;


var svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var g = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var xScale = d3.scaleLinear()
  .domain([
    d3.min(data, function (d) { return d.x }),
    d3.max(data, function (d) { return d.x })
  ])
  .range([0, width]);

var yScale = d3.scaleLinear()
  .domain([0, d3.max(data, function (d) { return d.y })])
  .range([height, 0]);

var axisX = d3.axisBottom(xScale)
  .tickValues(getXValue())
  .tickSize(-height, 0)
  .tickFormat(function (d) { return changeXFormat(d); });

var axisY = d3.axisLeft(yScale)
  .tickSize(-width, 0)
  .tickValues([30, 70, 130]);

function getXValue() {
  var Xarray = [];
  $.each(data, function () {
    Xarray.push(this.x);
  })
  return Xarray;
}
function changeXFormat(d) {
  for (i = 0; i < data.length; i++) {
    switch (d) {
      case data[i].x:
        return data[i].text;
        break;
    }
  }
}

var linePath = d3.line()
  .x(function (d) { return xScale(d.x); })
  .y(function (d) { return yScale(d.y); })
  .curve(d3.curveMonotoneX);

var area1 = d3.area()
  .x(function (d) { return xScale(d.x); })
  .y0(height)
  .y1(function (d) { return yScale(d.y); })
  .curve(d3.curveMonotoneX);

var defs = svg.append('defs');

defs.selectAll('clipPath')
  .data(data).enter()
  .append('clipPath')
  .attr('id', function (d, i) {
    console.log(d.x, i);
    return 'clip-area-' + i;
  })
  .append('rect')
  .attr('height', height)
  .attr('width', function (d, i) { return cilpAreaWidth(d, i); })
  .attr('x', function (d, i) { return cilpAreaPosition(d, i); })
  .attr('y', 0);

function cilpAreaWidth(d, i) {
  switch (i) {
    case 0:
      break;
    default:
      return xScale(d.x) - xScale(data[i - 1].x);
      break;
  }
}

function cilpAreaPosition(d, i) {
  switch (i) {
    case 0:
      break;
    default:
      return xScale(data[i - 1].x);
      break;
  }
}
// defs.append('clipPath')
//   .attr('id', 'clip-retired-area')
//   .append('rect')
//   .attr('height', height)
//   .attr('width', xScale(80) - xScale(65))
//   .attr('x', xScale(65))
//   .attr('y', 0);

// defs.append('clipPath')
//   .attr('id', 'clip-retire-area')
//   .append('rect')
//   .attr('height', height)
//   .attr('width', xScale(65))
//   .attr('x', 0)
//   .attr('y', 0);

// g.append("path")
//   .attr('class','line')
//   .attr("d",linePath(data))
//   .attr("stroke","black")
//   .attr("fill","none");

g.append('g')
  .attr('class', 'areas')
  .selectAll('path')
  .data(data).enter()
  .append('path')
  .attr('class', function (d, i) { return 'area' + i; })
  .attr('d', area1(data))
  .attr('clip-path', function (d, i) {
    return 'url(#clip-area-' + i + ')';
  })
  .attr('fill', 'rgba(150,150,255,0.3)');

d3.select('.area0')
  .remove();
d3.select('#clip-area-0')
  .remove();
var color = d3.scaleOrdinal(d3.schemeCategory10);

g.append('g')
  .attr('class', 'circle')
  .selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('r', 8)
  .attr('cx', function (d) { return xScale(d.x); })
  .attr('cy', function (d) { return yScale(d.y); })
  .attr('fill', function (d, i) { return color(i); });

// d3.selectAll('circle')
//   .filter(':first-child')
//   .remove();
// d3.selectAll('circle')
//   .filter(':last-child')
//   .remove();

var icon_width = 40;
var icon_height = margin.top - 10;

g.append('g')
  .attr('class', 'icon')
  .selectAll('image')
  .data(data)
  .enter()
  .append('image')
  .attr('width', icon_width)
  .attr('height', icon_height)
  .attr('xlink:href', 'https://roboadvisor.asuscomm.com/Financial_Robots/images/QReadyIMG2.png')
  .attr('x', function (d) { return xScale(d.x) - icon_width / 2; })
  .attr('y', function (d) { return yScale(d.y) - icon_height - 10; });

d3.selectAll('image')
  .filter(':first-child')
  .remove();
d3.selectAll('image')
  .filter(':last-child')
  .remove();

g.append('g')
  .attr('class', 'axisX')
  .attr('transform', 'translate(0, ' + height + ')')
  .call(axisX);

g.append('g')
  .attr('class', 'axisY')
  .call(axisY)
  .selectAll('text')
  .attr('text-anchor', 'start')
  .attr('x', '3')
  .attr('dy', '-5');

d3.selectAll('.domain')
  .remove();
//legend
function tabulate(data, columns) {
  var table = d3.select('#chart')
    .append('table')
    .attr('class', 'table');
  var thead = table.append('thead');
  var tbody = table.append('tbody');

  thead.append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
    .attr('scope', 'col')
    .text(function (d, i) { return changeTableHead(d); })

  function changeTableHead(d) {
    switch (d) {
      case 'x':
        return '年紀';
        break;
      case 'y':
        return '錢';
        break;
      case 'text':
        return '階段'
        break;
    }
  }
  var rows = tbody.selectAll('tr')
    .data(data).enter()
    .append('tr')
    .attr('data-hover', function (d, i) { return '.area' + i })
    .attr('class', function (d, i) { return 'tr tr' + i });

  var colorBlock = rows.append('th')
    .attr('scope', 'row')
    .append('div')
    .attr('class', 'colorBlock')
    .style('background-color', function (d, i) { return color(i); })

  var cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {
        return { column: column, value: row[column] };
      });
    })
    .enter()
    .append('td')
    .text(function (d) { return d.value; });

  d3.selectAll('td')
    .filter(':nth-child(2)')
    .remove();
}
tabulate(data, ['', 'x', 'y', 'text'])



$('.tr').hover(function () {
  var target = $(this).attr('data-hover');
  d3.select(target)
    .transition()
    .attr('fill', 'rgba(150,150,255,1)')
}, function () {
  // out
  var target = $(this).attr('data-hover');
  d3.select(target)
    .transition()
    .attr('fill', 'rgba(150,150,255,0.3)')
}
);