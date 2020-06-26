// @TODO: YOUR CODE HERE!
var svgWidth = 950;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    
    return circlesGroup;
    }

function xScale(censusData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(censusData))
        .range([0, width]);
    
        return xLinearScale;
}

d3.csv("assets/data/data.csv").then(function(data) {
    console.log(data);
    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(data))
        .range([0,height]);

    var chosenXAxis = "healthcare";
    var chosenYAxis = "poverty";
    var chosenXAxisList = [];
    var chosenYAxisList = [];
    for (var i = 0; i < data.length; i++) {
        chosenYAxisList.push(parseInt(data[i][`${chosenXAxis}`]));
        chosenXAxisList.push(parseInt(parseInt(data[i][`${chosenYAxis}`])));
    };
    // data[0].forEach(function(dataPoint) {
    //     console.log(typeof dataPoint);
    // })

    xLinearScale = xScale(data, chosenXAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(parseInt(d.healthcare)))
        .attr("cy", d => yLinearScale(parseInt(d.poverty)))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");

    var stateLabels = chartGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("cx", d => xLinearScale(parseInt(d.healthcare)))
        .attr("cy", d => yLinearScale(parseInt(d.poverty)))
        .text(d => d["abbr"])

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text(`${chosenYAxis}`)

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", `${chosenYAxis}`)
        .text(`${chosenXAxis}`);

    

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis);
});
