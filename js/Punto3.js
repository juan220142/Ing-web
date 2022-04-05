height = screen.height * 0.5
width = screen .width * 0.4
gap = 50

let lim_inf1;
let lim_sup1;
let lim_inf2;
let lim_sup2;
let lim_inf3;
let lim_sup3;
let lim_inf4;
let lim_sup4;

// overall svg
svg = d3.select("body")
    .append("svg")
    .attr("transform", "translate(-50%,-50%)")
    .attr("id", "mainsvg")
    .attr("height", height)
    .attr("width", width*2 + gap)

// first svg
svg1 = d3.select("svg#mainsvg")
    .append("svg")
    .attr("id", "svg1")
    .attr("height", height)
    .attr("width", width)
svg2 = d3.select("svg#mainsvg")
    .append("g") // group to move svg sideways
      .attr("transform", "translate(" + (width+gap) + ")")
      .append("svg")
      .attr("id", "svg2")
      .attr("height", height)
      .attr("width", width)

// add a box around each SVG
svg1.append("rect")
    .attr("height", height)
    .attr("width", width)
    .attr("stroke", "black")
    .attr("fill", "#ffffff")
    .attr("stroke-width", 2)
svg2.append("rect")
    .attr("height", height)
    .attr("width", width)
    .attr("stroke", "black")
    .attr("fill", "#ffffff")
    .attr("stroke-width", 2)

// simulate some data
//n_pts = 20
//index = d3.range(n_pts)
/*data = index.map(function(i) {
    x = Math.random()*(width-10)+5;
    y = x*0.3 + Math.random()*height/2;
    z = x*0.4 + Math.random()*height/2;
    return {x:x, y:y, z:z};
})*/

function clear(){
    svg.selectAll("*").remove()
}

function elegir() {

    dato1 = document.getElementById('var1')  //talla 12 meses
    elegido1 = dato1.options[dato1.selectedIndex].value
    dato2 = document.getElementById('var2')  //peso 12 meses
    elegido2 = dato2.options[dato2.selectedIndex].value
    dato3 = document.getElementById('var3')  //talla 0 meses
    elegido3 = dato3.options[dato3.selectedIndex].value
    dato4 = document.getElementById('var4')  //peso 0 meses
    elegido4 = dato4.options[dato4.selectedIndex].value
  
    if (elegido1 == 1) {
        lim_inf1 = 62;
        lim_sup1 = 70;
    } else if (elegido1 == 2) {
        lim_inf1 = 71;
        lim_sup1 = 86;
    } else {
        lim_inf1 = 62;
        lim_sup1 = 86;
    }

    if (elegido2 == 1) {
        lim_inf2 = 7000;
        lim_sup2 = 8000;
    } else if (elegido2 == 2) {
        lim_inf2 = 8500;
        lim_sup2 = 10000;
    } else {
        lim_inf2 = 7000;
        lim_sup2 = 12000;
    }

    if (elegido3 == 1) {
        lim_inf3 = 34;
        lim_sup3 = 37;
    } else if (elegido3 == 2) {
        lim_inf3 = 38;
        lim_sup3 = 45;
    } else {
        lim_inf3 = 28;
        lim_sup3 = 60;
    }

    if (elegido4 == 1) {
        lim_inf4 = 1100;
        lim_sup4 = 1300;
    } else if (elegido4 == 2) {
        lim_inf4 = 1400;
        lim_sup4 = 1600;
    } else {
        lim_inf4 = 1100;
        lim_sup4 = 3250;
    }

    console.log(lim_sup1)
    console.log(lim_sup2)
    console.log(lim_sup3)
    console.log(lim_sup4)
}








function gen() {
    console.log("hola")
    clear()
    elegir()
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
  
        let bodyWidth = width - 10;
        let bodyHeight =  height - 10;
        let xExtent = d3.extent(clients, d => +d.FOLL12M_peso12)
        let xScale = d3.scaleLinear().range([0, bodyWidth])
            .domain([0, xExtent[1] + 100])
    
    
        let yExtent = d3.extent(clients, d => +d.FOLL12M_talla12)
        let yScale = d3.scaleLinear().range([bodyHeight, 0])
            .domain([0, yExtent[1] + 30])
        
        svg1.selectAll("empty")
            .data(clients.filter(d => d.Pretermino == 0 && d.FOLL12M_peso12 >= lim_inf1 && d.FOLL12M_peso12 <= lim_sup1 && d.FOLL12M_talla12 >= lim_inf2 && d.FOLL12M_talla12 <= lim_sup2))
            .enter()
            .append("circle")
            .attr("cx", function(d) { return d.FOLL12M_peso12; })
            .attr("cy", function(d) { return height-d.FOLL12M_talla12+10; })
            .attr("class", function(d,i) { return "pt" + i; })
            .attr("r", 5)
            .attr("stroke", "black")
            .attr("fill", "slateblue")
            .on("mouseover", function(d, i) {
                console.log(i)
                d3.selectAll("circle.pt" + i)
                .attr("fill", "Orchid")
                .attr("r", 10)
            })
            .on("mouseout", function(d, i) {
                d3.selectAll("circle.pt" + i)
                .attr("fill", "slateblue")
                .attr("r", 5)
            })
  
    }
}
  










/*
// plot y vs x in first plot
svg1.selectAll("empty")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return d.FOLL12M_peso12; })
    .attr("cy", function(d) { return height-d.FOLL12M_talla12+10; })
    .attr("class", function(d,i) { return "pt" + i; })
    .attr("r", 5)
    .attr("stroke", "black")
    .attr("fill", "slateblue")
    .on("mouseover", function(d, i) {
        console.log(i)
        d3.selectAll("circle.pt" + i)
          .attr("fill", "Orchid")
          .attr("r", 10)
    })
    .on("mouseout", function(d, i) {
        d3.selectAll("circle.pt" + i)
          .attr("fill", "slateblue")
          .attr("r", 5)
    })

// plot z vs x in 2nd plot
svg2.selectAll("empty")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return height-d.z+10; })
    .attr("class", function(d,i) { return "pt" + i; })
    .attr("r", 5)
    .attr("stroke", "black")
    .attr("fill", "slateblue")
    .on("mouseover", function(d, i) {
        console.log(i)
        d3.selectAll("circle.pt" + i)
          .attr("fill", "Orchid")
          .attr("r", 10)
    })
    .on("mouseout", function(d, i) {
        d3.selectAll("circle.pt" + i)
          .attr("fill", "slateblue")
          .attr("r", 5)
    })
*/