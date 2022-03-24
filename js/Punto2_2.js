let body2 = d3.select("#body2")
let container2 = d3.select("#container2")

d3.csv("./doc/data3.csv").then((data) => {
  showData2(data);
})
function showTooltip2(text, coords) {
  let x = coords[0];
  let y = coords[1];

  d3.select("#tooltip2")
    .style("display", "block")
    .style("top", y)
    .style("left", x)
    .text(text)
}
function showData2(clients) {


  let bodyWidth = 450;
  let bodyHeight = 450;
  let xExtent = d3.extent(clients, d => +d.FOLL12M_pc12)
  let xScale = d3.scaleLinear().range([0, bodyWidth])
    .domain([0, xExtent[1] + 30])


  let yExtent = d3.extent(clients, d => +d.FOLL12M_talla12)
  let yScale = d3.scaleLinear().range([bodyHeight, 0])
    .domain([0, yExtent[1] + 30])

  let joinCircle = body2.selectAll("circle")
    .data(clients.filter(d=>d.Pretermino == 0))

  let newelementsCircle = joinCircle.enter()
    .append("circle")
    .style("fill", "green")
    .style("opacity","0.5")
    .style("r", "3")


  let joinRect = body2.selectAll("rect")
    .data(clients.filter(d=>(d.Pretermino == 1)))

  let newelementsRect = joinRect.enter()
    .append('rect')
    .attr('width', 5)
    .attr('height', 5)
    .style("opacity","0.5")
    .attr('fill', 'gray')

  joinRect.merge(newelementsRect)
    .transition()
    .attr("x", d => xScale(+d.FOLL12M_pc12))
    .attr("y", d => yScale(+d.FOLL12M_talla12))


  joinCircle.merge(newelementsCircle)
    .transition()
    .attr("cx", d => xScale(+d.FOLL12M_pc12))
    .attr("cy", d => yScale(+d.FOLL12M_talla12))


  let yAxis = d3.axisLeft(yScale);
  let yAxisGroup = d3.select("#yAxis2")
    .style("transform", "translate(40px, 10px)")
    .call(yAxis)

  let xAxis = d3.axisBottom(xScale)
  let xAxisGroup = d3.select("#xAxis2")
    .style("transform", `translate(40px, ${bodyHeight + 10}px)`)
    .call(xAxis)

  let zoom = d3.zoom()
  zoom.on("zoom", function (a, b) {
    let newXScale = d3.event.transform.rescaleX(xScale);
    let newYScale = d3.event.transform.rescaleY(yScale);

    xAxis.scale(newXScale)
    xAxisGroup.call(xAxis)

    yAxis.scale(newYScale)
    yAxisGroup.call(yAxis)

    joinCircle.merge(newelementsCircle)
      .attr("cx", d => newXScale(+d.FOLL12M_pc12))
      .attr("cy", d => newYScale(+d.FOLL12M_talla12))
      .on("mouseenter", (d) => {
        let dat= "parto por cesarea"
        if(d.BIRTH_cesarea==0){
          dat="parto natural";
        }
        showTooltip2(dat, [d3.event.clientX, d3.event.clientY])
      })
      .on("mousemove", (d) => {
        let dat= "parto por cesarea"
        if(d.BIRTH_cesarea==0){
          dat="parto natural";
        }
        showTooltip2(dat, [d3.event.clientX, d3.event.clientY + 30])
      })
      .on("mouseleave", (d) => {
        d3.select("#tooltip2").style("display", "none")
      })

    joinRect.merge(newelementsRect)
      .attr("x", d => newXScale(+d.FOLL12M_pc12))
      .attr("y", d => newYScale(+d.FOLL12M_talla12))
      .on("mouseenter", (d) => {
        let dat= "parto por cesarea"
        if(d.BIRTH_cesarea==0){
          dat="parto natural";
        }
        showTooltip2(dat, [d3.event.clientX, d3.event.clientY])
      })
      .on("mousemove", (d) => {
        let dat= "parto por cesarea"
        if(d.BIRTH_cesarea==0){
          dat="parto natural";
        }
        showTooltip2(dat, [d3.event.clientX, d3.event.clientY + 30])
      })
      .on("mouseleave", (d) => {
        d3.select("#tooltip2").style("display", "none")
      })

  });
  container2.call(zoom)

}
