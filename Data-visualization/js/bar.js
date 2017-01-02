/**
 * Created by Administrator on 1/2/2017.
 */
$(document).ready(function () {
    d3.csv("./data/import-season.csv", function (error, data) {
        if (error) {
            console.log(error);
        }
        else {
            data.forEach(function (d) {
                d.Imports = parseFloat(d.Imports);
            });
            dataset = data;
            barChart(dataset);
        }
    });
})

var dataset;

//Define bar chart function
function barChart(dataset) {

    //Set width and height as fixed variables
    var padding = 25;

    //To format axis as a percent
    var formatPercent = d3.format("%1");


    //
    //Define key function
    var key = function (d) {
        return d.time
    };


    //Define tooltip for hover-over info windows
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //Create svg element
    var chart = d3.select("#bar");
    var margin = {top: 120, right: 50, bottom: 80, left: 50},//改图的大小
        width = +chart.attr("width") - margin.left - margin.right,
        height = +chart.attr("height") - margin.top - margin.bottom,
        svg = chart.append("g").attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

      //Scale function for axes and radius
    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function (d) {
            return d.Imports;
        })])
        .range([height, 0]);

    var xScale = d3.scale.ordinal()
        .domain(dataset.map(function (d) {
            return d.time;
        }))
        .rangeRoundBands([0, width], .5);

    //Create y axis
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(4);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    //Create barchart
    svg.selectAll("rect")
        .data(dataset, key)
        .enter()
        .append("rect")
        .attr("class", "negative")
        .attr({
            x: function (d) {
                return xScale(d.time);
            },
            y: function (d) {
                return yScale(d.Imports);
            },
            width: xScale.rangeBand(),
            height: function (d) {
                return height - yScale(d.Imports);
            }
        })

        .on('mouseover', function (d) {
            d3.select(this)
                .style("opacity", 0.2)
                .style("stroke", "black");

            var info = div
                .style("opacity", 1)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 30) + "px")
                .text(d.time);


            info.append("p").text(d.Imports);

        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style({'stroke-opacity': 0.5, 'stroke': '#a8a8a8'})
                .style("opacity", 1);

            div
                .style("opacity", 0);
        });


    //Add y-axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis)
        .append("text")
        // .attr("transform", "rotate(-90)")
            .attr("y", -20)
            .attr("x", -10)
            .attr("dy", "2.5em")
            .attr("dx", ".90em")
            .style("text-anchor", "end")
            .text("£ billion");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,300)")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-1em")
        .attr("dy", ".20em")
        .style("text-anchor", "end")
        .style("font-size", "10px")
        .style("font-weight", "bold");


};

//Load data and call bar chart function
