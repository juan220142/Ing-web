let body2 = d3.select("#body2")
let container2 = d3.select("#container2")
let lim_inf1;
let lim_sup1;
let lim_inf2;
let lim_sup2;
let dato1;
let elegido1
let dato2
let elegido2

function clear4(){
  body2.selectAll("*").remove()
}

function elegir4() {

  dato1 = document.getElementById('var2')  //peso
  elegido1 = dato1.options[dato1.selectedIndex].value
  dato2 = document.getElementById('var1')  //talla
  elegido2 = dato2.options[dato2.selectedIndex].value

  if (elegido1 == 1) {
    lim_inf1 = 7000;
    lim_sup1 = 8000;
  } else if (elegido1 == 2) {
    lim_inf1 = 8500;
    lim_sup1 = 10000;
  } else {
    lim_inf1 = 0;
    lim_sup1 = 12000;
  }
  if (elegido2 == 1) {
    lim_inf2 = 62;
    lim_sup2 = 70;
  } else if (elegido2 == 2) {
    lim_inf2 = 71;
    lim_sup2 = 86;
  } else {
    lim_inf2 = 0;
    lim_sup2 = 100;
  }
  console.log(lim_sup1)
  console.log(lim_sup2)
}

function gen4() {
  clear4()
  elegir4()
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
    let xExtent = d3.extent(clients, d => +d.FOLL12M_peso12)
    let xScale = d3.scaleLinear().range([0, bodyWidth])
      .domain([0, xExtent[1] + 100])


    let yExtent = d3.extent(clients, d => +d.FOLL12M_talla12)
    let yScale = d3.scaleLinear().range([bodyHeight, 0])
      .domain([0, yExtent[1] + 30])

    let joinCircle = body2.selectAll("circle")
      .data(clients.filter(d => d.Pretermino == 0 && d.FOLL12M_peso12 >= lim_inf1 && d.FOLL12M_peso12 <= lim_sup1 && d.FOLL12M_talla12 >= lim_inf2 && d.FOLL12M_talla12 <= lim_sup2))

    let newelementsCircle = joinCircle.enter()
      .append("circle")
      .attr("class", function(d) { return "pt" + d.id; })
      .style("fill", "blue")
      .style("opacity", "0.5")
      .style("r", "3")


    let joinRect = body2.selectAll("rect")
      .data(clients.filter(d => (d.Pretermino == 1 && d.FOLL12M_peso12 >= lim_inf1 && d.FOLL12M_peso12 <= lim_sup1 && d.FOLL12M_talla12 >= lim_inf2 && d.FOLL12M_talla12 <= lim_sup2)))

    let newelementsRect = joinRect.enter()
      .append('rect')
      .attr("class", function(d) { return "sq" + d.id; })
      .attr('width', 5)
      .attr('height', 5)
      .style("opacity", "0.5")
      .attr('fill', 'red')

    joinRect.merge(newelementsRect)
      .transition()
      .attr("x", d => xScale(+d.FOLL12M_peso12))
      .attr("y", d => yScale(+d.FOLL12M_talla12))


    joinCircle.merge(newelementsCircle)
      .transition()
      .attr("cx", d => xScale(+d.FOLL12M_peso12))
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
        .attr("cx", d => newXScale(+d.FOLL12M_peso12))
        .attr("cy", d => newYScale(+d.FOLL12M_talla12))
        .on("mouseenter", (d) => {
          d3.selectAll("circle.pt" + d.id)
            .style("fill", "black")
            .style("opacity", "1")
            .style("r", "10")
          let dat = "parto por cesarea"
          if (d.BIRTH_cesarea == 0) {
            dat = "parto natural";
          }
          showTooltip2(dat, [d3.event.clientX, d3.event.clientY])
        })
        .on("mousemove", (d) => {   
          d3.selectAll("circle.pt" + d.id)
            .style("fill", "black")
            .style("opacity", "1")
            .style("r", "10")         
          let dat = "parto por cesarea"
          if (d.BIRTH_cesarea == 0) {
            dat = "parto natural";
          }
          showTooltip2(dat, [d3.event.clientX, d3.event.clientY + 30])
        })
        .on("mouseleave", (d) => {
          d3.selectAll("circle.pt" + d.id)
            .style("fill", "blue")
            .style("opacity", "0.5")
            .style("r", "3")
          d3.select("#tooltip2").style("display", "none")
        })
  

      joinRect.merge(newelementsRect)
        .attr("x", d => newXScale(+d.FOLL12M_peso12))
        .attr("y", d => newYScale(+d.FOLL12M_talla12))
        .on("mouseenter", (d) => {
          console.log(d.id)

          d3.selectAll("rect.sq" + d.id)
            .attr('width', 15)
            .attr('height', 15)
            .style("opacity", "1")
            .attr('fill', 'black')
          let dat = "parto por cesarea"
          if (d.BIRTH_cesarea == 0) {
            dat = "parto natural";
          }
          showTooltip2(dat, [d3.event.clientX, d3.event.clientY])
        })
        .on("mousemove", (d) => {
          d3.selectAll("rect.sq" + d.id)
            .attr('width', 15)
            .attr('height', 15)
            .style("opacity", "1")
            .attr('fill', 'black')
          let dat = "parto por cesarea"
          if (d.BIRTH_cesarea == 0) {
            dat = "parto natural";
          }
          showTooltip2(dat, [d3.event.clientX, d3.event.clientY + 30])
        })
        .on("mouseleave", (d) => {
          d3.selectAll("rect.sq" + d.id)
            .attr('width', 5)
            .attr('height', 5)
            .style("opacity", "0.5")
            .attr('fill', 'red')
          d3.select("#tooltip2").style("display", "none")
        })

    });
    container2.call(zoom)
  }
}
