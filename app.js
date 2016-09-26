var bigRadius=10;
var smallRadius=5



function createRounds(){
	var diameter = 700,
    format = d3.format(",d");

var pack = d3.layout.pack()
    .size([diameter - 4, diameter - 4])
    .value(function(d) { return d.size; })
     
function sortItems(){}
var svg = d3.select("#clusters").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
  .append("g")
    .attr("transform", "translate(2,2)");
color = d3.scale.category20c();
d3.json("germ_clustering2_new.json", function(error, root) {
  if (error) throw error;

  var node = svg.datum(root).selectAll(".node")
      .data(pack.nodes)
    .enter().append("g")
      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })


  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) {
    	  if(d.parent)
    	  return color(d.parent.name);
    	  })
       .attr("class",function(d){
    	   return d.children?"cluster-node":""
       })
      .on("mouseover",highlightCircle)
      .on("mouseout",unhighlightCircle)
      .on("click",showCircleDetail);
  
  svg.datum(root).selectAll(".text")
	  .data(pack.nodes)
	  .enter().append("g")
	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	  .filter(function(d){return d.children })
	  .append("text")
      .attr("dy", ".4em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name; })
      .call(wrap);

});

function highlightCircle(d){
		
	if(d.children){
		return;
	}
	$("#clusterName").html(d.parent.name.split(" ").join("<br>"));
	  d3.select(d3.event.target)
	  .classed("highlight", true)
	  .attr("r",d.r*2)
}

function unhighlightCircle(d){
	if(d.children){
		return;
	}
	$("#clusterName").html("&nbsp");
	 d3.select(d3.event.target)
	 .classed("highlight", false)
	 .attr("r",d.r); 
}

function showCircleDetail(docu){
	
	
	if(docu.children){
		return;
	}
	var doc=allData['docs'][docu.name]
	setContent(doc)
	
	d3.selectAll("circle")
	  .classed("highlightonClick", false)
	 
	  
	 d3.select(d3.event.target)
	  .classed("highlightonClick", true)
	  .attr("r",docu.r*2)
	 
	  d3.selectAll(".yearly-bars")
	  .classed("highlight-rects", false)
		  
	 var rects = d3.selectAll(".yearly-bars")
	  .filter(function(d){
		  docs=d.docs;
		  return docs.indexOf(docu.name) > -1;
	  })
	  .classed("highlight-rects", true)
	 
	
}

function setContent(doc){
	var content='<div id="date">Date: '+doc.date+'</div>'+
	'<div id="summary"><strong>Summary:</strong> '+doc.sum.join("<br><br>")+'</div>'+
	'<div id="place"><strong>Place: </strong>'+doc.country+'</div><br>'+
	'<div id="url"><a href="http://chroniclingamerica.loc.gov/'+doc.id+'"><strong>Visit URL</strong></a</div>'
	d3.select("#information").html(content)
}

function wrap(text ) {
	width=50
	i=0
	  text.each(function() {
		  i++;
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 0.5, // ems
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
	    while (word = words.pop()) {
	    	lineNumber++
	    	if((lineNumber)/(i)>1)
	    		break;
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
	      }
	    }
	  });
	}

d3.select(self.frameElement).style("height", diameter + "px");
}


function createDateTime(){
	var margin = {top: 20, right: 20, bottom: 70, left: 40},
	    width = 700 - margin.left - margin.right,
	    height = 150 - margin.top - margin.bottom;
	
	// Parse the date / time
	var	parseDate = d3.time.format("%Y-%m-%d").parse;
	
	var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
	
	var y = d3.scale.sqrt().range([height, 0]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .ticks(4)
	    .tickFormat(d3.time.format("%b-%y"))
	    
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(3);
	
	var svg = d3.select("#timeseries").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("class","time_svg")
	    .attr("transform", 
	          "translate(" + margin.left + "," + margin.top + ")");
	
	d3.json("germ_datesfile.json", function(error, data) {
		
		
	
	    data.forEach(function(d) {
	        d.date = parseDate(d.date);
	        d.value = +d.length;
	    });
	    data.sort(function(b,a){
	    	  return new Date(b.date) - new Date(a.date);
	    	});
	    
	  x.domain(data.map(function(d) { return d.date; }));
	  y.domain([0, d3.max(data, function(d) { return d.value; })]);
	
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .selectAll("text")
	      .style("text-anchor", "end")
	      .attr("dx", "-.8em")
	      .attr("dy", "-.55em")
	      .attr("transform", "rotate(-90)" );
	
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 0)
	      .attr("dy", ".71em")
	
	  svg.selectAll("bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class","yearly-bars")
	      .style("fill", "steelblue")
	      .attr("x", function(d) { return x(d.date) ; })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.value); })
	      .attr("height", function(d) { return height - y(d.value); })
	      .on("click",highlightCircles)
	  
	    function highlightCircles(d){
		  
		  
		  d3.selectAll(".yearly-bars")
		  .classed("highlightRectDate", false)
		  
		  d3.select(d3.event.target)
		  .classed("highlightRectDate", true)
		  
		  
		  d3.selectAll(".leaf")
		  .classed("highlightByDate", false)
		   .classed("fill-opacity-less",true)
		  
		  docs=d.docs;
		  
		  d3.selectAll(".leaf")
		  .filter(function(d){
			  return docs.indexOf(d["name"]) > -1;
		  })
		  .classed("highlightByDate", true)
	  }
	
	});
}


function createWordCloud(){
	var size=100;
	var fill = d3.scale.category20();
	d3.json("germ_cloud.json", function(error, data) {
		
	for (var index in data){
		var w=data[index]["text"].split(" ")
		drawOne(w,index);
	}
	
	function drawOne(words,index){
		d3.layout.cloud().size([size, size])
	      .words(words.map(function(d,i) {
	        return {text: d, size: Math.sqrt((10-i/2)*20),"index":index};
	      }))
	      .font("Impact")
	       .rotate(function(d,i) { return -(i%2) *90 ; })
	      .fontSize(function(d) { return d.size; })
	      .on("end", draw)
	      .start();

	  function draw(words) {
	    d3.select("#wordCloud"+index).append("svg")
	        .attr("width", size)
	        .attr("height", size)
	       .on("click",function() { highlightTopics(index); })
	      .append("g")
	        .attr("transform", "translate(50,50)")
	      .selectAll("text")
	        .data(words)
	      .enter().append("text")
	        .style("font-size", function(d) { return d.size + "px"; })
	        .style("font-family", "Impact")
	        .style("fill", function(d, i) { return fill(i); })
	        .attr("text-anchor", "middle")
	        .attr("transform", function(d) {
	          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	        })
	        .text(function(d) { return d.text; });
	  }
	  
	  function highlightTopics(d){
		  clearAll();
		  
		  $("#wordCloud"+index).addClass("highlightwords");
		  d3.selectAll(".leaf")
		  .classed("highlightByDate", false)
		   .classed("fill-opacity-less",true)
		  
		  docs=data[index].docs;
		  
		  d3.selectAll(".leaf")
		  .filter(function(d){
			  return docs.indexOf(d["name"]) > -1;
		  })
		  .classed("highlightByDate", true)
	  }
		
	}
	  
	});
}





$(document).ready(function(){
	info=$("#information").html()
	createDateTime()
//	createClusterPlot()
	createRounds()
	createWordCloud()
	d3.json("germ_clusterfile.json", function(error, data) {
		allData=data;
	});
	
	$('#sentimentCheckbox').on('change', function() { 
	    // From the other examples
	    if (this.checked) {
			  
			  d3.selectAll(".leaf")
			  .attr("class",function(d){
				  var p=allData["docs"][d["name"]].polarity
				  if(p<-0.01)
				     p=0
				  else if (p<0.15)
				   	 p=1;
				   else 
					  p=2
				    
				 return d3.select(this).attr("class") +  " col"+p
			  })
	       
	    }
	    else{
	    	d3.selectAll(".leaf")
			  .classed("col0", false)
			  .classed("col1", false)
			  .classed("col2", false)
	    	
	    }
	});
	
	$("#clear").on("click",function(){
		clearAll();
	});
})

function clearAll(){
	$("#information").html(info)
	d3.selectAll("*")
	.classed("highlightRectDate", false)
	.classed("highlightByDate", false)
	.classed("highlightonClick", false)
	.classed("fill-opacity-less",false)
	.classed("highlight-rects",false)
	$(".wordCloud").removeClass("highlightwords");
}