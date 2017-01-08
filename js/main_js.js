var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};

var mouseOrig;
var anglesOrig = [0, 0];
var anglesCurr = [0, 0];
var zoomCurr = 300;
var zoomMin = 30;
var zoomMax = 2500;
var mSc = 8; // mouse scale for rotations
var zoomFac = 150; // factor for zoom sensitivity (higher = less sensitive)

var width = 1000 - margin.left - margin.right; // base number needs to match wrapper
var height = 700 - margin.top - margin.bottom;

var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

var projection = d3.geoOrthographic()
    .scale(zoomCurr)
    .clipAngle(90)
    .translate([width / 2, height / 2])
    .rotate(anglesCurr);

var path = d3.geoPath()
    .projection(projection);

var circle = d3.geoCircle();

var graticule = d3.geoGraticule();

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = chart.append("g");

// define tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// URLs for [1] a 110-m map stored in a GitHub repo and [2] the meterorite strike data
var url1 = "https://raw.githubusercontent.com/domwakeling/FreeCodeCamp-Project-20/master/data/world-110m.json";
var url2 = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";

d3.queue(2)
    .defer(d3.json, url1)
    .defer(d3.json, url2)
    .await(function(error, topology, meteors) {
        if (error) throw error;
        renderMap(topology, meteors);
    });

function renderMap(topology, meteors) {

    g.selectAll("path.country")
        .data(topojson.feature(topology, topology.objects.countries)
            .features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path);

    chart.on("mousedown", mouseDown)
        .on("mousewheel", zoomed);

    d3.select(window)
        .on("mousemove", mouseMoved)
        .on("mouseup", mouseUp);

    renderMeteors(meteors);
}

function renderMeteors(meteors) {

    var meteorsFixed = meteors.features.filter(function(d) {
        return d.geometry != null
    }); // remove anything with no coordinates

    g.selectAll("path.meteors")
        .data(meteorsFixed)
        .enter()
        .append("path")
        .datum(function(d) {
            var meteorObj = circle.radius(radiusForMass(d.properties.mass)).center(d.geometry.coordinates)();
            meteorObj.year = d.properties.year;
            meteorObj.mass = d.properties.mass;
            return meteorObj;
        })
        .attr("class", "meteors")
        .attr("d", path)
        .on("mouseover", function(d) {
            var date = d.year;
            var dateArr = date != null ? date.split("-") : ["Unknown"];
            var str = dateArr.length > 1 ? months[parseInt(dateArr[1]) - 1] + " " + dateArr[0] : dateArr[0];
            str = str + "<br/>" + (d.mass != null ? d3.format(",d")(d.mass) + " kg" : "Mass unkown");
            div.transition()
                .duration(200)
                .style("opacity", 1.0);
            div.html(str)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        }).on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });
}


function zoomed() {
    zoomCurr *= (zoomFac + d3.event.deltaY) / zoomFac;
    zoomCurr = Math.min(zoomMax, Math.max(zoomMin, zoomCurr));
    projection.scale(zoomCurr);
    refresh();
    d3.event.preventDefault;
}

function mouseDown() {
    mouseOrig = [d3.event.pageX, d3.event.pageY];
    console.log("orig:", anglesOrig, "curr:", anglesCurr)
    anglesOrig = [anglesCurr[0], anglesCurr[1]];
    d3.event.preventDefault();
}

function mouseMoved() {
    if (mouseOrig) {
        var mouseCurr = [d3.event.pageX, d3.event.pageY];
        anglesCurr = [anglesOrig[0] - (mouseOrig[0] - mouseCurr[0]) / mSc, anglesOrig[1] - (mouseCurr[1] - mouseOrig[1]) / mSc];
        projection.rotate(anglesCurr);
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
    chart.selectAll("path").attr("d", path);
}

function radiusForMass(m) {
    if (!m) return 0.1;
    return Math.max(1, Math.floor(Math.log10(parseInt(m)))) * 0.25;
}
