var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};

var mouseOrig;
var anglesOrig = [0,0];
var anglesCurr = [0,0];
var mSc = 8;                  // mouse scale for rotations
// var topog;
// var globeOrig;

var width = 1000 - margin.left - margin.right; // base number needs to match wrapper
var height = 700 - margin.top - margin.bottom;

// var projection = d3.geoAlbers()
// var projection = d3.geoAzimuthalEqualArea()
var projection = d3.geoOrthographic()
    // var projection = d3.geoEquirectangular()
    .scale(300)
    .clipAngle(90)
    .translate([width / 2, height / 2])
    .rotate(anglesCurr);

var path = d3.geoPath()
    .projection(projection);

var graticule = d3.geoGraticule();

var zoom = d3.zoom()
    // .translate(projection.translate())
    // .scale(projection.scale())
    // .scaleExtent([height, 8 * height])
    .scaleExtent([0.25, 8])
    .on("zoom", zoomFunc);

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = chart.append("g");


// this URL is for a 110-m map stored in a GitHub repo
var url1 = "https://raw.githubusercontent.com/domwakeling/FreeCodeCamp-Project-20/master/data/world-110m.json";
// and this one is to the meteor-strike data
var url2 = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";

d3.queue(2)
    .defer(d3.json, url1)
    .defer(d3.json, url2)
    .await(function(error, topology, meteors) {
        if (error) throw error;
        renderMap(topology, meteors);
    });


// d3.json(url, function(error, topology) {
function renderMap(topology, meteors) {
    // console.log(topology.objects.countries);
    // console.log(topojson.object(topology, topology.objects.countries));


    g.selectAll("path")
        .data(graticule.lines())
        .enter()
        .append("path")
        .attr("d", path);


    g.selectAll("path.country")
        .data(topojson.feature(topology, topology.objects.countries)
            .features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path);

        chart.on("mousedown", mouseDown);
        // .on("zoom", zoom);

        d3.select(window)
        .on("mousemove", mouseMoved)
        .on("mouseup", mouseUp);


    // chart
        // .call(d3.zoom().on("zoom", function() {
        //     g.attr("transform", d3.event.transform)
        // }));
        // .call(zoom);
    // .call(zoom.event);



    console.log("Need to send data to view meteors");
}
// });

function zoomFunc() {
    // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    console.log(d3.event);
    g.attr("transform", d3.event.transform);
}


// // define tooltip
// var div = d3.select("body").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);
//
// d3.json(url, function(error, data) {
//
//     if (error) throw error;
//
//     var links = data.links;
//     var nodes = data.nodes;
//
//     var link = chart.append("g")
//         .attr("class", "links")
//         .selectAll("line")
//         .data(links)
//         .enter().append("line");
//
//     // var node = chart.selectAll("g")
//
//     var node = chart.append("g")
//         .attr("class", "nodes")
//         // .selectAll("circle")
//         .selectAll("circle")
//         .data(nodes)
//         .enter().append("g");
//
//     var nodeFill = flags.selectAll(".nodes")
//         // .selectAll("img")
//         .data(nodes)
//         .enter().append("img")
//         .attr("class", function(d) {
//             return "flag flag-" + d.code;
//         })
//         .on("mouseover", function(d) {
//             div.transition()
//                 .duration(200)
//                 .style("opacity", 1.0);
//             div.html(d.country)
//                 .style("left", (d3.event.pageX) + "px")
//                 .style("top", (d3.event.pageY - 28) + "px");
//         })
//         .call(d3.drag()
//             .on("start", dragstarted)
//             .on("drag", dragged)
//             .on("end", dragended));;
//
//     simulation
//         .nodes(nodes)
//         .on("tick", ticked);
//
//     simulation.force("link")
//         .links(data.links);
//
//     function ticked() {
//         link
//             .attr("x1", function(d) {
//                 return d.source.x;
//             })
//             .attr("y1", function(d) {
//                 return d.source.y;
//             })
//             .attr("x2", function(d) {
//                 return d.target.x;
//             })
//             .attr("y2", function(d) {
//                 return d.target.y;
//             });
//
//         nodeFill
//             .style("left", function(d) {
//                 return d.x - (25 / 2) + "px";
//             })
//             .style("top", function(d) {
//                 return d.y - (15 / 2) + "px";
//             });
//     }
//
// });
//
// function dragstarted(d) {
//     if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//     d.fx = d.x;
//     d.fy = d.y;
// }
//
// function dragged(d) {
//     d.fx = d3.event.x;
//     d.fy = d3.event.y;
// }
//
// function dragended(d) {
//     if (!d3.event.active) simulation.alphaTarget(0);
//     d.fx = null;
//     d.fy = null;
// }

function mouseDown() {
  mouseOrig = [d3.event.pageX, d3.event.pageY];
  console.log("orig:", anglesOrig, "curr:",anglesCurr)
  anglesOrig = [anglesCurr[0], anglesCurr[1]];
  // o0 = projection.origin();
  d3.event.preventDefault();
}

function mouseMoved() {
  if (mouseOrig) {
    var mouseCurr = [d3.event.pageX, d3.event.pageY];
    anglesCurr = [anglesOrig[0] - (mouseOrig[0] - mouseCurr[0]) / mSc, anglesOrig[1] - (mouseCurr[1] - mouseOrig[1]) / mSc];
    projection.rotate(anglesCurr);
    // circle.origin(o1)
    refresh();
  }
}

function mouseUp() {
  if (mouseOrig) {
    mouseMoved();
    mouseOrig = null;
  }
}

function refresh() {

      // redraw land
      chart.selectAll("path").attr("d", path);

      // redraw circles
      // svg.selectAll(".point").attr("d", path.projection(proj));

      // redraw circles
      // svg.selectAll(".circles").attr("d", path.projection(proj));

    }
