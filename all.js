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
var axisYValue = [30,70,130];
var color = d3.scaleOrdinal(d3.schemeCategory10);
var point = { r: 5, zoom: 8 };
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
  .tickValues(axisYValue);

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

var filter = defs.append('filter')
  .attr('id', 'shadow')
  .attr('x',-0.5)
  .attr('y', -0.5)
  .attr('width','200%')
  .attr('height','200%');

filter.append('feGaussianBlur')
  .attr('result','blurOut')
  .attr('in','SourceAlpha')
  .attr('stdDeviation','1');

filter.append('feBlend')
  .attr('in','SourceGraphic')
  .attr('in2','blurOut')
  .attr('mode','normal');


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

//create x axisx
g.append('g')
  .attr('class', 'axisX')
  .attr('transform', 'translate(0, ' + height + ')')
  .call(axisX);

//create y axisx
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
  .attr('class', 'points')
  .selectAll('circle')
  .data(data).enter()
  .append('circle')
  .attr('r', point.r)
  .attr('class', function (d, i) { return 'point point-' + i; })
  .attr('data-order', function (d, i) { return i })
  .attr('cx', function (d) { return xScale(d.x); })
  .attr('cy', function (d) { return yScale(d.y); })
  .attr('fill', function (d, i) { return color(i); });

// remove first&last point
d3.selectAll('#chart circle')
  .filter(':first-child')
  .remove();
d3.selectAll('#chart circle')
  .filter(':last-child')
  .remove();

//create icon from points
g.append('g')
  .attr('class', 'icons')
  .selectAll('image')
  .data(data)
  .enter()
  .append('image')
  .attr('width', icon.width)
  .attr('height', icon.height)
  .attr('class', function (d, i) { return 'icon-' + i })
  .attr('xlink:href', './icons8-bookmark.svg')
  .attr('x', function (d) { return xScale(d.x) - icon.width / 2; })
  .attr('y', function (d) { return yScale(d.y) - icon.height - icon.margin; });

//remove first&last img
d3.selectAll('#chart image')
  .filter(':first-child')
  .remove();
d3.selectAll('#chart image')
  .filter(':last-child')
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
    .attr('data-order', function (d, i) { return i })
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
    }).enter()
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

//tooltip
var tooltip = d3.select('#chart')
  .append('div')
  .attr('class', 'tooltip')
  .append('p')
  .attr('class', 'title')
  .clone()
  .attr('class', 'yearsOld')
  .text('0歲')
  .clone()
  .attr('class', 'money')
  .text('0萬');

//effect
$('#chart .tr').click(function () {
  //tr active effect
  if ($('#chart .tr.active').length == 0) {
    $(this).addClass('active');
  } else if ($('#chart .tr.active').length !== 0 && $(this).hasClass('active') == false) {
    $('#chart .tr.active').removeClass('active');
    $(this).addClass('active');
  }

  //points active effect
  var order = $(this).attr('data-order');
  var pointOrder = $('#chart .point[data-order=' + order + ']');
  var pointMethod = {
    addActive: function () {
      pointOrder.addClass('active');
      d3.select('#chart .point.active')
        .transition()
        .attr('filter','url("#shadow")')
        .attr('r', point.zoom);
        
    },
    removeActive: function () {
      d3.select('#chart .point.active')
        .transition()
        .attr('r', point.r)
        .attr('filter','')
        .attr('stroke-width', '')
        .attr('stroke', '')
      $('#chart .point.active').removeClass('active');
    }
  };
  if ($('#chart .point.active').length == 0) {
    pointMethod.addActive();
  } else if ($('#chart .point.active').length !== 0 && pointOrder.hasClass('active') == false) {
    pointMethod.removeActive();
    pointMethod.addActive();
  }

  var child = {
    child: $('.axisX .tick:nth-child(' + (JSON.parse(order) + 1) + ') line'),
    active: $('.axisX .tick line.active')
  }
  if (child.active.length == 0) {
    child.child.addClass('active');
  } else if (child.active.length !== 0 && child.child.hasClass('active') == false) {
    child.active.removeClass('active');
    child.child.addClass('active');
  }

  //tooltip effect
  d3.select('.tooltip')
    .transition()
    .duration(1000)
    .style('opacity', '1')
    .style('left', xScale(data[order].x) + margin.left - 5 + 'px')
    .style('top', yScale(data[order].y) + margin.top - 5 + 'px');

  d3.select('#chart .title')
    .transition()
    .duration(1000)
    .text(data[order].text);
  var format = d3.format(",d");
  d3.select('#chart .yearsOld')
    .transition()
    .duration(1000)
    .tween("text", function () {
      var content = $('#chart .yearsOld').text();
      var content = content.substring(0, content.length - 1);
      var i = d3.interpolateNumber(content, data[order].x);
      return function (t) {
        $('#chart .yearsOld').text(format(i(t)) + '歲');
      };
    });
  d3.select('#chart .money')
    .transition()
    .duration(1000)
    .tween("text", function () {
      var content = $('#chart .money').text();
      var content = content.substring(0, content.length - 1);
      var i = d3.interpolateNumber(content, data[order].y);
      return function (t) {
        $('#chart .money').text(format(i(t)) + '萬');
      };
    });

  //area effect
  d3.select('#clip-area rect')
    .transition()
    .duration(1000)
    .attr('width', xScale(data[order].x));
});

$('#chart .point').click(function () {
  if ($(this).hasClass('active') == false) {
    var order = $(this).attr('data-order');
    $('.tr[data-order=' + order + ']').trigger('click');
  }
});
// $('#chart .point,.tr').hover(function () {
//   if ($(this).hasClass('active') == false) {
//     var order = $(this).attr('data-order');
//     $('.tr[data-order=' + order + ']').trigger('click');
//   }
// });
//area double click transition




jQuery('image.svg').each(function(){
  var $img = jQuery(this);
  var imgID = $img.attr('id');
  var imgClass = $img.attr('class');
  var imgURL = $img.attr('src');

  jQuery.get(imgURL, function(data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');

      // Add replaced image's ID to the new SVG
      if(typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if(typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass+' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
      if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
          $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
      }

      // Replace image with new SVG
      $img.replaceWith($svg);

  }, 'xml');

});