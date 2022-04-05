let body = d3.select("#body")
let container = d3.select("#container")
let lim_infe1;
let lim_supe1;
let lim_infe2;
let lim_supe2;
let datos1;
let elegidos1
let datos2
let elegidos2
function clear2(){
  body.selectAll("*").remove()
}
function elegir2() {

  datos1 = document.getElementById('var4')
  elegidos1 = datos1.options[datos1.selectedIndex].value
  datos2 = document.getElementById('var3')
  elegidos2 = datos2.options[datos2.selectedIndex].value

  if (elegidos1 == 1) {
    lim_infe1 = 28;
    lim_supe1 = 30;
  } else if (elegidos1 == 2) {
    lim_infe1 = 31;
    lim_supe1 = 35;
  } else {
    lim_infe1 = 28;
    lim_supe1 = 40;
  }
  if (elegidos2 == 1) {
    lim_infe2 = 34;
    lim_supe2 = 37;
  } else if (elegidos2 == 2) {
    lim_infe2 = 38;
    lim_supe2 = 45;
  } else {
    lim_infe2 = 28;
    lim_supe2 = 60;
  }
  console.log(lim_supe1)
  console.log(lim_supe2)
}

function gen2() {
  clear2()
  elegir2()
  d3.csv("./doc/data3.csv").then((data) => {
    showData(data);
  })

  function showTooltip(text, coords) {
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip")
      .style("display", "block")
      .style("top", y)
      .style("left", x)
      .text(text)
  }

  function showData(clients) {


    let bodyWidth = 450;
    let bodyHeight = 450;
    let xExtent = d3.extent(clients, d => +d.BIRTH_pc5)
    let xScale = d3.scaleLinear().range([0, bodyWidth])
      .domain([0, xExtent[1] + 30])


    let yExtent = d3.extent(clients, d => +d.BIRTH_talla5)
    let yScale = d3.scaleLinear().range([bodyHeight, 0])
      .domain([0, yExtent[1] + 30])

    let joinCircle = body.selectAll("circle")
      .data(clients.filter(d => d.Pretermino == 0 && d.BIRTH_pc5 >= lim_infe1 && d.BIRTH_pc5 <= lim_supe1 && d.BIRTH_talla5 >= lim_infe2 && d.BIRTH_talla5 <= lim_supe2))

    let newelementsCircle = joinCircle.enter()
      .append("circle")
      .attr("class", function(d) { return "pt" + d.BIRTH_sexo5; })
      .style("fill", "green")
      .style("opacity", "0.5")
      .style("r", "3")


    let joinRect = body.selectAll("rect")
      .data(clients.filter(d => (d.Pretermino == 1 && d.BIRTH_pc5 >= lim_infe1 && d.BIRTH_pc5 <= lim_supe1 && d.BIRTH_talla5 >= lim_infe2 && d.BIRTH_talla5 <= lim_supe2)))

    let newelementsRect = joinRect.enter()
      .append('rect')
      .attr("class", function(d) { return "pt" + d.BIRTH_sexo5; })
      .attr('width', 5)
      .attr('height', 5)
      .style("opacity", "0.5")
      .attr('fill', 'gray')

    joinRect.merge(newelementsRect)
      .transition()
      .attr("x", d => xScale(+d.BIRTH_pc5))
      .attr("y", d => yScale(+d.BIRTH_talla5))


    joinCircle.merge(newelementsCircle)
      .transition()
      .attr("cx", d => xScale(+d.BIRTH_pc5))
      .attr("cy", d => yScale(+d.BIRTH_talla5))


    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = d3.select("#yAxis")
      .style("transform", "translate(40px, 10px)")
      .call(yAxis)

    let xAxis = d3.axisBottom(xScale)
    let xAxisGroup = d3.select("#xAxis")
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
        .attr("cx", d => newXScale(+d.BIRTH_pc5))
        .attr("cy", d => newYScale(+d.BIRTH_talla5))
        .on("mouseenter", (d) => {
          d3.selectAll("circle.pt" + d.BIRTH_sexo5)
            .style("fill", "black")
            .style("opacity", "1")
            .style("r", "10")
          d3.selectAll("rect.pt" + d.BIRTH_sexo5)
            .attr('width', 15)
            .attr('height', 15)
            .style("opacity", "1")
            .attr('fill', 'black')
          let dat = "Hombre"
          if (d.BIRTH_sexo5 == 2) {
            dat = "Mujer";
          }
          showTooltip(dat, [d3.event.clientX, d3.event.clientY])
        })
        .on("mousemove", (d) => {
          d3.selectAll("circle.pt" + d.BIRTH_sexo5)
            .style("fill", "black")
            .style("opacity", "0.5")
            .style("r", "10")
          d3.selectAll("rect.pt" + d.BIRTH_sexo5)
            .attr('width', 15)
            .attr('height', 15)
            .style("opacity", "0.5")
            .attr('fill', 'black')
          let dat = "Hombre"
          if (d.BIRTH_sexo5 == 2) {
            dat = "Mujer";
          }
          showTooltip(dat, [d3.event.clientX, d3.event.clientY + 30])
        })
        .on("mouseleave", (d) => {
          d3.selectAll("circle.pt" + d.BIRTH_sexo5)
            .style("fill", "blue")
            .style("opacity", "0.5")
            .style("r", "3")
          d3.selectAll("rect.pt" + d.BIRTH_sexo5)
            .attr('width', 5)
            .attr('height', 5)
            .style("opacity", "0.5")
            .attr('fill', 'red')
          d3.select("#tooltip").style("display", "none")
        })

      joinRect.merge(newelementsRect)
        .attr("x", d => newXScale(+d.BIRTH_pc5))
        .attr("y", d => newYScale(+d.BIRTH_talla5))
        .on("mouseenter", (d) => {
          d3.selectAll("circle.pt" + d.BIRTH_sexo5)
            .style("fill", "black")
            .style("opacity", "0.5")
            .style("r", "10")
          d3.selectAll("rect.pt" + d.BIRTH_sexo5)
            .attr('width', 15)
            .attr('height', 15)
            .style("opacity", "0.5")
            .attr('fill', 'black')
          let dat = "Hombre"
          if (d.BIRTH_sexo5 == 2) {
            dat = "Mujer";
          }
          showTooltip(dat, [d3.event.clientX, d3.event.clientY])
        })
        .on("mousemove", (d) => {
          d3.selectAll("circle.pt" + d.BIRTH_sexo5)
            .style("fill", "black")
            .style("opacity", "0.5")
            .style("r", "10")
          d3.selectAll("rect.pt" + d.BIRTH_sexo5)
            .attr('width', 15)
            .attr('height', 15)
            .style("opacity", "0.5")
            .attr('fill', 'black')
          let dat = "Hombre"
          if (d.BIRTH_sexo5 == 2) {
            dat = "Mujer";
          }
          showTooltip(dat, [d3.event.clientX, d3.event.clientY + 30])
        })
        .on("mouseleave", (d) => {
          d3.selectAll("circle.pt" + d.BIRTH_sexo5)
            .style("fill", "blue")
            .style("opacity", "0.5")
            .style("r", "3")
          d3.selectAll("rect.pt" + d.BIRTH_sexo5)
            .attr('width', 5)
            .attr('height', 5)
            .style("opacity", "0.5")
            .attr('fill', 'red')
          d3.select("#tooltip").style("display", "none")
        })

    });
    container.call(zoom)

  }
}
