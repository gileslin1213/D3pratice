var data = [
  { x: 23, y: 10, text: 'begun' },
  { x: 30, y: 40, text: 'today' },
  { x: 40, y: 80, text: 'plan1' },
  { x: 65, y: 160, text: 'retired' },
  { x: 80, y: 0, text: 'die' }
];

var margin = { top: 40, right: 20, bottom: 30, left: 20 };
var width = $('#chart').width() - margin.right - margin.left;
var height = 400 - margin.top - margin.bottom;


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

defs.append('clipPath')
  .attr('id', 'clip-retired-area')
  .append('rect')
  .attr('height', height)
  .attr('width', xScale(80) - xScale(65))
  .attr('x', xScale(65))
  .attr('y', 0);

defs.append('clipPath')
  .attr('id', 'clip-retire-area')
  .append('rect')
  .attr('height', height)
  .attr('width', xScale(65))
  .attr('x', 0)
  .attr('y', 0);

// g.append("path")
//   .attr('class','line')
//   .attr("d",linePath(data))
//   .attr("stroke","black")
//   .attr("fill","none");

g.append('path')
  .attr('class', 'area')
  .attr('d', area1(data))
  .attr('clip-path', 'url(#clip-retire-area)')
  .attr('fill', 'rgba(150,150,255,0.3)')
  .clone()
  .attr('fill', 'rgba(0,150,255,0.3)')
  .attr('clip-path', 'url(#clip-retired-area)');

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

d3.selectAll('circle')
  .filter(':first-child')
  .remove();
d3.selectAll('circle')
  .filter(':last-child')
  .remove();

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
    .attr('class','table');
  var thead = table.append('thead');
  var tbody = table.append('tbody');

  thead.append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
    .attr('scope','col')
    .text(function (column) { return column; })

  var rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')
    .attr('class', function (d, i) { return i });

  var cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {
        return { column: column, value: row[column] };
      });
    })
    .enter()
    .append('td')
    .text(function (d, i) { return d.value; });

  return table;
}
tabulate(data, ['color', 'x', 'y', 'text'])


// var linePath2 = d3.line()
//   .x(function(d){return xScale(d.x);})
//   .y(function(d){return yScale(d.y - 20);})
//   .curve(d3.curveMonotoneX);
// g.append("path")
//   .attr("d",linePath2(data))
//   .attr("stroke","black")
//   .attr("fill","none");