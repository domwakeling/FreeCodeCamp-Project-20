// var url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};

var width = 1000 - margin.left - margin.right; // base number needs to match wrapper
var height = 700 - margin.top - margin.bottom;


//     //   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// var flags = d3.select(".flag-holder")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// var projection = d3.geoAlbers()
var projection = d3.geoAzimuthalEqualArea()
    .scale(500)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

// var zoom = d3.behaviour.zoom()
var zoom = d3.zoom()
    // .translate(projection.translate())
    // .scale(projection.scale())
    // .scaleExtent([height, 8 * height])
    .scaleExtent([1, 8])
    .on("zoom", zoomFunc);

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = chart.append("g");


// this URL is for a 110-m map stored in GoogleDrive; unable to store locally due to JSON/Chrome issues
var url1 = "https://www.dropbox.com/s/p4sa1icaez8h5eo/world-110m.json?dl=0";
// var url1 = "https://doc-0k-cc-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/o3as7at4ktbu9m0ihfif2jh2vt3mc3dh/1483804800000/01571833550273622618/*/0BwlT0RUM_dmvb3ZEYThmX2lMMTg";
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
        .data(topojson.feature(topology, topology.objects.countries)
            .features)
        .enter()
        .append("path")
        .attr("d", path);

    chart
        .call(zoom);
        // .call(zoom.event);

    console.log(meteors);
}
// });

function zoomFunc() {
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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
