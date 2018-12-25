var data = [
  { x: 23, y: 10, text: 'begun' },
  { x: 30, y: 40, text: 'today' },
  { x: 40, y: 80, text: 'plan1' },
  { x: 65, y: 160, text: 'retired' },
  { x: 80, y: 0, text: 'die' }
];

var margin = { top: 40, right: 20, bottom: 30, left: 20 };
var width = $('#chart').width() - margin.right - margin.left;
var height = $('#chart').width() / 3 - margin.top - margin.bottom;
var color = d3.scaleOrdinal(d3.schemeCategory10);
var icon = { margin: 5, height: margin.top - 5, width: margin.top - 5 };

// set svg tag
var svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

//set g tag
var g = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//set x scale
var xScale = d3.scaleLinear()
  .domain([
    d3.min(data, function (d) { return d.x }),
    d3.max(data, function (d) { return d.x })
  ])
  .range([0, width]);

//set y scale
var yScale = d3.scaleLinear()
  .domain([0, d3.max(data, function (d) { return d.y })])
  .range([height, 0]);

//set x axis
var axisX = d3.axisBottom(xScale)
  .tickValues(getXValue())
  .tickSize(-height, 0)
  .tickFormat(function (d) { return changeXFormat(d); });

//set y axis
var axisY = d3.axisLeft(yScale)
  .tickSize(-width, 0)
  .tickValues([30, 70, 130]);

//let other data don't show
function getXValue() {
  var Xarray = [];
  $.each(data, function () {
    Xarray.push(this.x);
  })
  return Xarray;
};

//change format to custom
function changeXFormat(d) {
  for (i = 0; i < data.length; i++) {
    switch (d) {
      case data[i].x:
        return data[i].text;
    }
  }
};

//set line

// var linePath = d3.line()
//   .x(function (d) { return xScale(d.x); })
//   .y(function (d) { return yScale(d.y); })
//   .curve(d3.curveMonotoneX);

//set area
var area1 = d3.area()
  .x(function (d) { return xScale(d.x); })
  .y0(height)
  .y1(function (d) { return yScale(d.y); })
  .curve(d3.curveMonotoneX);

//set defs
var defs = svg.append('defs');

//create mask
defs.append('clipPath')
  .attr('id', 'clip-area')
  .append('rect')
  .attr('height', height)
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', 0);

// create mask form data

// defs.selectAll('clipPath')
//   .data(data).enter()
//   .append('clipPath')
//   .attr('id', function (d, i) {
//     console.log(d.x, i);
//     return 'clip-area-' + i;
//   })
//   .append('rect')
//   .attr('height', height)
//   .attr('width', function (d, i) { return cilpAreaWidth(d, i); })
//   .attr('x', function (d, i) { return cilpAreaPosition(d, i); })
//   .attr('y', 0);

// set mask width

// function cilpAreaWidth(d, i) {
//   switch (i) {
//     case 0:
//       break;
//     default:
//       return xScale(d.x) - xScale(data[i - 1].x);
//       break;
//   }
// }

//set mask position

// function cilpAreaPosition(d, i) {
//   switch (i) {
//     case 0:
//       break;
//     default:
//       return xScale(data[i - 1].x);
//       break;
//   }
// }

//create line

// g.append("path")
//   .attr('class','line')
//   .attr("d",linePath(data))
//   .attr("stroke","black")
//   .attr("fill","none");

//create area
g.append('g')
  .attr('class', 'areas')
  .append('path')
  .attr('class', 'area')
  .attr('d', area1(data))
  .attr('fill', 'rgba(150,150,255,0.3)')
  .clone()
  .attr('id', 'area-transition')
  .attr('fill', 'rgba(150,150,255,1)')
  .attr('clip-path', 'url(#clip-area)');

//create area form data

// g.append('g')
//   .attr('class', 'areas')
//   .selectAll('path')
//   .data(data).enter()
//   .append('path')
//   .attr('class', function (d, i) { return 'area' + i; })
//   .attr('d', area1(data))
//   .attr('clip-path', function (d, i) {
//     return 'url(#clip-area-' + i + ')';
//   })
//   .attr('fill', 'rgba(150,150,255,0.3)');

// d3.select('.area0')
//   .remove();
// d3.select('#clip-area-0')
//   .remove();


//create points on line
g.append('g')
  .attr('class', 'circle')
  .selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('r', 5)
  .attr('cx', function (d) { return xScale(d.x); })
  .attr('cy', function (d) { return yScale(d.y); })
  .attr('fill', function (d, i) { return color(i); });

// remove first&last point

// d3.selectAll('circle')
//   .filter(':first-child')
//   .remove();
// d3.selectAll('circle')
//   .filter(':last-child')
//   .remove();

//create icon from points
g.append('g')
  .attr('class', 'icon')
  .selectAll('image')
  .data(data)
  .enter()
  .append('image')
  .attr('width', icon.width)
  .attr('height', icon.height)
  .attr('xlink:href', 'https://roboadvisor.asuscomm.com/Financial_Robots/images/QReadyIMG2.png')
  .attr('x', function (d) { return xScale(d.x) - icon.width / 2; })
  .attr('y', function (d) { return yScale(d.y) - icon.height - icon.margin; });

//remove first&last img
d3.selectAll('image')
  .filter(':first-child')
  .remove();
d3.selectAll('image')
  .filter(':last-child')
  .remove();

//create x axix
g.append('g')
  .attr('class', 'axisX')
  .attr('transform', 'translate(0, ' + height + ')')
  .call(axisX);

//create y axix
g.append('g')
  .attr('class', 'axisY')
  .call(axisY)
  .selectAll('text')
  .attr('text-anchor', 'start')
  .attr('x', '3')
  .attr('dy', '-5');

//remove border
d3.selectAll('.domain')
  .remove();

//legend
function tabulate(data, columns) {
  var table = d3.select('#chart')
    .append('table')
    .attr('class', 'table');
  var thead = table.append('thead');
  var tbody = table.append('tbody');
  var theadRow = thead.append('tr');

  //create table head
  theadRow.selectAll('th')
    .data(columns).enter()
    .append('th')
    .attr('scope', 'col')
    .text(function (d, i) { return changeTableHead(d); })

  //create table head color
  theadRow.append('th')
    .attr('scope', 'col')
    .lower();

  //change table head format
  function changeTableHead(d) {
    switch (d) {
      case 'x':
        return '年紀';
      case 'y':
        return '錢';
      case 'text':
        return '階段'
    }
  }

  // create row
  var rows = tbody.selectAll('tr')
    .data(data).enter()
    .append('tr')
    .attr('data-hover', function (d, i) { return d.x })
    .attr('class', function (d, i) { return 'tr tr' + i });

  //create colorblock
  var colorBlock = rows.append('th')
    .attr('scope', 'row')
    .append('div')
    .attr('class', 'colorBlock')
    .style('background-color', function (d, i) { return color(i); })

  //create table content
  var cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {
        return { column: column, value: row[column] };
      });
    })
    .enter()
    .append('td')
    .text(function (d, i) { return changeTableFormat(d); });

  //change table content format
  function changeTableFormat(d) {
    switch (d.column) {
      case 'x':
        return d.value + '歲'
      case 'y':
        return d.value + '萬'
      default:
        return d.value
    }
  }
}
tabulate(data, ['x', 'y', 'text'])

$('.tr').hover(function () {
  //over
  var target = $(this).attr('data-hover');
  d3.select('#clip-area rect')
    .transition()
    .duration(1000)
    .attr('width', xScale(target))
}, function () {
  // out
  d3.select('#clip-area rect')
    .transition()
    .duration(1000)
    .attr('width', 0)
}
);