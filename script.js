$(function(){
	var collegeVisible=false;
	var mapUnColoredData={}
	var statesData;
	var individualColleges;
	var populationData={};
	var onlyPopulationData={}
	var literacy={}
	var budget={}
	var countyData=[]
	var individualSizedColleges=[];
	var studentData;
	var fill1= {
			0: "#f0f9e8",
	    	1: "#f0f9e8",
	    	2: "#ccebc5",
	    	3: "#a8ddb5",
	    	4: "#7bccc4",
	    	5: "#4eb3d3",
	    	6: "#2b8cbe",
	    	7: "#08589e",
	    	8: "#081d58",
	    	12:"red",
	    	defaultFill: "rgba(128, 128, 128, 0.59)",
		}
	var fill3= {
	    	0: "#08589e",
	    	1: "#08589e",
	    	2: "#08589e",
	    	3: "#08589e",
	    	4: "#08589e",
	    	5: "#08589e",
	    	6: "#08589e",
	    	7: "#08589e",
	    	8: "#081d58",
	    	9: "#081d58",
	    	12:"red",
	    	defaultFill: "rgba(128, 128, 128, 0.29)",
		}
	var instSize={
			1:'Under 1,000' ,
			2:'1,000 - 4,999' ,
			3:'5,000 - 9,999' ,
			4:'10,000 - 19,999' ,
			5:'20,000 and above' 
	}
	
	var legendinstSize=['Under 1,000','1,000 - 4,999','5,000 - 9,999','10,000 - 19,999','20,000 and above' ]
	var legendState=["Less than 100","100-200","200-300","300-400","400-500","500-600","600-700",">700"]
	var legendCounty=["Less than 10","10-20","20-30","30-40","40-50","50-60","60-70",">70"]
	var legendPopulation=["Less than 1000000","1000000-2000000","2000000-3000000","3000000-4000000","4000000-5000000","5000000-6000000","6000000-7000000",">7000000"]
	var legendPopulationCollege=["Less than 28","28-35","35-42","42-49","49-56","56-63"]
	var legendLiteracy=["Less than 19","19-21","21-23","23-25","25-27","27-29","29-31",">=31"]
	var legendBudget=["Less than $5 bln","5-10","10-15","15-20","20-25","25-30","30-35",">=35"]
	
	
	d3.csv("statesdata.csv", function (error, data) {
		statesData=data
		statesData = statesData.reduce(function(o, v, i) {
			  o[v['Abbr.']] = v;
			  return o;
			}, {});
	});
	
	d3.csv("data2.csv", function (error, data) {
		individualColleges=data.slice();
		 var stateData = d3.nest()
		  .key(function(d) { return d.STABBR;})
		  .rollup(function(d) { 
		   return d3.sum(d, function(g) {return 1; });
		  }).entries(data.slice());
		 
		 mapColoredData = stateData.reduce(function(o, v, i) {
			  v.fillKey=getColor(v['values']);
			  mapUnColoredData['key']={'fillKey':100, 'values': v['values']};
			  o[v['key']] = v;
			  return o;
			}, {});
		 
		 studentData = d3.nest()
		  .key(function(d) { return d.STABBR;})
		  .rollup(function(d) { 
		   return d3.sum(d, function(g) {return g.INSTSIZE; });
		  }).entries(data.slice());
		 
		 studentData = studentData.reduce(function(o, v, i) {
			  v.fillKey=getColor(v['values']);
			  if(v.fillKey>8){
				  v.fillKey=8;
				 }
			  v['students']=v['values'];
			  o[v['key']] = v;
			  return o;
			}, {});
		 
		 initialCollegeLoad(mapUnColoredData,individualColleges,[],fill3);
		 showLegend("",fill1,2,true); 
		 createBudgetVColleges(studentData,"students","#budgetvpopulation","#sort")
		 createbudgetVliteracy()
		 
			 var CountyDetails = d3.nest()
			  .key(function(d) { return d.COUNTYNM+","+d.STABBR;})
			  .entries(data.slice());
			 
			 for (key in CountyDetails){
				 var colleges=parseInt(CountyDetails[key]["values"].length)
				 CountyDetails[key]["values"][0].values=colleges
				 colleges=parseInt(colleges/10)+1
				 if(colleges>7){
					 colleges=8;
				 }
				 CountyDetails[key]["values"][0].fillKey=colleges
				 countyData.push(CountyDetails[key]["values"][0])
			 }
			
	});
	
	function initialCollegeLoad(stateData,individualColleges,countyData,fill){
		$("#container").html("");
		 map = new Datamap({
		    element: document.getElementById('container'),
		    scope: 'usa',
		    fills:fill,
			bubblesConfig:{
				radius:3,
				borderOpacity: 0,
				borderWidth: 0,
			},
			geographyConfig: {
				popupTemplate: function(geography, data) { //this function should just return a string
					if(data.students){
						var str='<div class="hoverinfo"><strong>' + geography.properties.name +'</strong><br>'+
				         'Students : '+data.values*10000
					}
					else{
						var str='<div class="hoverinfo"><strong>' + geography.properties.name +'</strong><br>'+
				         'Colleges : '+data.values
					}
			         if(data.population){
			        	 str+='<br> Population Value : '+data.population+
			        	 "<br> Population rank: "+data.populationRanks+
			        	 "<br> Student /Population: "+data.populationCollege+"%"+
			        	 "<br> Literacy: "+data.literacy+"%"+
			        	 "<br> Budget: $"+data.budget+"bn"
			        	 
			         }
			         str=str+' </div>'
			          return str;
			        },
			  },
			data:stateData
		});
		 if(countyData.length>1){
			 map.bubbles(countyData, {
				    popupTemplate: function (geo, data) {
				            return ['<div class="hoverinfo">' ,
				            'County: ' +  data.COUNTYNM,
				            '<br/>Total Colleges : '+data.values,
				            '<br/>State: ' +  data.STABBR,
				            '</div>'].join('');
				    	}
					});
			 
		 }
		 if(individualColleges.length>1){
			 map.bubbles(individualColleges, {
				    popupTemplate: function (geo, data) {
				            return ['<div class="hoverinfo">' +  data.INSTNM,
				            '<br/>Institute Size: ' + instSize[data.INSTSIZE]||"Not reported",
				            '<br/>City: ' +  data.CITY,
				            '<br/>State: ' +  data.STABBR,
				            '</div>'].join('');
				    	}
					});
			
			 
		 }
			map.labels()
			map.svg.selectAll('.datamaps-bubble').on('click', function(e) {
				var props=["INSTNM","ADDR","F1SYSNAM","INSTSIZE","CITY","STABBR","WEBADDR"]
				var propsName=["Name","Address","Main University","Size","CITY","State","Web Address"]
					e['INSTSIZE']=instSize[e['INSTSIZE']]
					if( $('#radio_button').is(':checked')){
						str="<ul>"
							var c=0
						for (i in props){
							str+="<li>"+propsName[i]+":" + e[props[i]]+ "</li>"
							c++;
							}
						str+="</ul>"
					}
				$("#showInfo").html(str);
							
						
			});
		
		
	}
		 
	
	
	$("input[name=college]:radio").change(function () 
	{
		$("#collegeSizes").hide();
		$("#showInfo").html("");
		$('#sizeCheckBox').prop('checked', false);
		
		if($(this).attr("value")=="population")
		{
			
			if(populationData.length==undefined){
				for(var key in mapColoredData){
					if(statesData[key]){
						populationData[key]={'fillKey':parseInt(((studentData[key]['values']*100000)/(statesData[key]["Population est."])-1.4)/.7),
								 'values': mapColoredData[key]['values'],
								 'students':studentData[key]['values'],
								 'population':statesData[key]["Population est."],
								 'populationCollege':Math.round(studentData[key]['values']*1000000/statesData[key]["Population est."]),
								 'populationRanks':statesData[key]["Population rank"],
								 'literacy':statesData[key]['education'],
								 'budget':statesData[key]['budget']
								 };
					}
				 }
			}
			
			initialCollegeLoad(populationData,[],[],fill1);
			showLegend(legendPopulationCollege,fill1,1); 
			
		}
		
		else if($(this).attr("value")=="onlypopulation"){
			if(onlyPopulationData.length==undefined){
				for(var key in mapColoredData){
					if(statesData[key]){
						var fillKey=parseInt(statesData[key]["Population est."]/1000000)+1
						 if(fillKey>7){
							 fillKey=8;
						 }
						
						onlyPopulationData[key]={
								'fillKey':fillKey,
								 'values': mapColoredData[key]['values'],
								 'population':statesData[key]["Population est."],
								 'populationCollege':Math.round(studentData[key]['values']*1000000/statesData[key]["Population est."]),
								 'populationRanks':statesData[key]["Population rank"],
								 'literacy':statesData[key]['education'],
								 'budget':statesData[key]['budget']
								 };
					}
				 }
				initialCollegeLoad(onlyPopulationData,[],[],fill1);
				showLegend(legendPopulation,fill1,1); 
				
				
			}
		}
		else if($(this).attr("value")=="literacyRate"){
			if(literacy.length==undefined){
				for(var key in mapColoredData){
					if(statesData[key]){
						var fillKey=parseInt((statesData[key]["education"]-17)/2)+1
						 if(fillKey>7){
							 fillKey=8;
						 }
						
						literacy[key]={
								'fillKey':fillKey,
								 'values': mapColoredData[key]['values'],
								 'population':statesData[key]["Population est."],
								 'populationCollege':Math.round(studentData[key]['values']*1000000/statesData[key]["Population est."]),
								 'populationRanks':statesData[key]["Population rank"],
								 'literacy':statesData[key]['education'],
								 'budget':statesData[key]['budget']
								 };
					}
				 }
				initialCollegeLoad(literacy,[],[],fill1);
				showLegend(legendLiteracy,fill1,1); 
			}
		}
		else if($(this).attr("value")=="budget"){
			if(budget.length==undefined){
				for(var key in mapColoredData){
					if(statesData[key]){
						var fillKey=parseInt(statesData[key]["budget"]/5)+1
						 if(fillKey>7){
							 fillKey=8;
						 }
						
						budget[key]={
								'fillKey':fillKey,
								 'values': mapColoredData[key]['values'],
								 'population':statesData[key]["Population est."],
								 'populationCollege':parseInt(statesData[key]["Population est."]/mapColoredData[key]['values']),
								 'populationRanks':statesData[key]["Population rank"],
								 'literacy':statesData[key]['education'],
								 'budget':statesData[key]['budget']
								 };
					}
				 }
				initialCollegeLoad(budget,[],[],fill1);
				showLegend(legendBudget,fill1,1); 
			}
		}
		else if($(this).attr("value")=="individualColleges"){
			initialCollegeLoad(mapUnColoredData,individualColleges,[],fill3);
			showLegend("",fill1,2,true); 
			
			$("#collegeSizes").show();
				
		}
		else if($(this).attr("value")=="individualCounties"){
			if(mapUnColoredData.length==undefined){
				for(var key in mapColoredData){
					 mapUnColoredData[key]={'fillKey':100, 'values': mapColoredData[key]['values']};
				 }
			}
			initialCollegeLoad(mapUnColoredData,[],countyData,fill1);
			showLegend(legendCounty,fill1,1);
		}
		else if($(this).attr("value")=="student"){
		     initialCollegeLoad(studentData,[],[],fill1);
		     showLegend(legendPopulation,fill1,1); 
		}
		else
		{
			 initialCollegeLoad(mapColoredData,[],[],fill1);
			 showLegend(legendState,fill1,1);
		}
	})
	
	function getColor(i){
		return parseInt(i/100+1);
	}

	$('#sizeCheckBox').on("click",function() {
		if( $('#radio_button').is(':checked')){
			if( $('#sizeCheckBox').prop('checked')){
				var i=0;
				if(individualSizedColleges.length<1){
					individualColleges.forEach(function(c){
						c=jQuery.extend({}, c)
						individualSizedColleges.push(c)
						individualSizedColleges[i].fillKey=c.fillKey==12?12:(parseInt(c.INSTSIZE)*2-2)
						i++;
					});
				}
				initialCollegeLoad(mapUnColoredData,individualSizedColleges,[],fill1);
				showLegend(legendinstSize,fill1,2,true); 
				
			}
			else{
				initialCollegeLoad(mapUnColoredData,individualColleges,[],fill3);
				showLegend("",fill1,2,true); 
			}
			
		}

	}); 
	
	$("#collegeSizesDropdown").change(function () {
		var val=this.value;
		var data=individualColleges.filter(function(d){ return d.INSTSIZE >=val; })
		initialCollegeLoad(mapUnColoredData,data,[],fill3);
		
	})
	
	
	function showLegend(data,fill,s,showBest){
		var str="";
		for (var i=0;i<data.length;i++){
			str+="<div><span class='legend' style='background:"+fill[i*s+1]+"'></span>"+data[i]+"<div>"
		}
		if(showBest){
			str+="<div><span class='legend' style='background:red'></span>Top 20 Colleges<div>"
		}
		$("#legendContainer").html(str);
	}
	

	$("input[name=budget]:radio").change(function () 
	{
		if($(this).attr("value")=="students"){
			createBudgetVColleges(studentData,"students","#budgetvpopulation","#sort")
		
		}
		else{
			createBudgetVColleges(mapColoredData,"Colleges","#budgetvpopulation","#sort")
		}
		
	})
	
	
	function createbudgetVliteracy(){
		var data={};
		var literacy=[]
		for(var key in studentData){
			if(statesData[key]){
				statesData[key]["literacyCal"]=Math.round((statesData[key]['budget']/statesData[key]['Population est.'])*1000000000)
				data[key]={"values": statesData[key]['Population est.']/1000000000}
				literacy.push(statesData[key])
				}
			}
		
		createBudgetVColleges(data,"people","#budgetvliteracy","#sort2")
		scatterLiteracy(literacy)
	}
	
	function createBudgetVColleges(keyData,keys,div,sorter){
		$(div).html("");
		var data=[]
		for(var key in keyData){
			if(statesData[key]){
				data.push({"letter":key,"frequency": statesData[key]['budget']/keyData[key]["values"]})
				}
			}
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 900 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10);

	var svg = d3.select(div).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  x.domain(data.map(function(d) { return d.letter; }));
	  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Budget($Bn.) in terms of No. of "+keys);

	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.letter); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.frequency); })
	      .attr("height", function(d) { return height - y(d.frequency); });
	
	function type(d) {
	  d.frequency = +d.frequency;
	  return d;
	}
	var dataSum = d3.sum(data, function(d) { return d.frequency; }); 

	 var line = d3.svg.line()
	    .x(function(d, i) { 
	      return x(d.letter) + i; })
	    .y(function(d, i) { return y(dataSum/data.length); }); 

	  svg.append("path")
	      .datum(data)
	      .attr("class", "line")
	      .attr("d", line);

	 d3.select(sorter).on("change", change);

	  var sortTimeout = setTimeout(function() {
	    
	  }, 2000);

	  function change() {
		  
		  times.reduce(function(a, b) { return a + b; });

	    // Copy-on-write since tweens are evaluated after a delay.
	    var x0 = x.domain(data.sort(this.checked
	        ? function(a, b) { return b.frequency - a.frequency; }
	        : function(a, b) { return d3.ascending(a.letter, b.letter); })
	        .map(function(d) { return d.letter; }))
	        .copy();

	    svg.selectAll(".bar")
	        .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

	    var transition = svg.transition().duration(750),
	        delay = function(d, i) { return i * 50; };

	    transition.selectAll(".bar")
	        .delay(delay)
	        .attr("x", function(d) { return x0(d.letter); });

	    transition.select(".x.axis")
	        .call(xAxis)
	      .selectAll("g")
	        .delay(delay);
	}
	}
	
	
	function scatterLiteracy(dataOrg){
		var data=[]
		for(var key in dataOrg){
				data.push(dataOrg[key])
			}
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 350 - margin.top - margin.bottom;

	var xValue = function(d) { return d.literacyCal;}, // data -> value
	    xScale = d3.scale.linear().range([0, width]), // value -> display
	    xMap = function(d) { return xScale(xValue(d));}, // data -> display
	    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	// setup y
	var yValue = function(d) { return d.education;}, // data -> value
	    yScale = d3.scale.linear().range([height, 0]), // value -> display
	    yMap = function(d) { return yScale(yValue(d));}, // data -> display
	    yAxis = d3.svg.axis().scale(yScale).orient("left");

	
	// add the graph canvas to the body of the webpage
	var svg = d3.select("#stateLiteracy").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// add the tooltip area to the webpage
	var tooltip = d3.select("#stateLiteracy").append("div")
	    .attr("class", "tooltip")
	    .style("opacity", 0);
	// load data

	  // change string (from CSV) into number format
	  data.forEach(function(d) {
	    d.education = +d.education;
	    d["literacyCal"] = +d["literacyCal"];
//	    console.log(d);
	  });

	  // don't want dots overlapping axis, so add in buffer to data domain
	  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
	  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

	  // x-axis
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("budget");

	  // y-axis
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("education");

	  // draw dots
	  svg.selectAll(".dot")
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("r", 3.5)
	      .attr("cx", xMap)
	      .attr("cy", yMap)
	      .on("mouseover", function(d) {
	          tooltip.transition()
	               .duration(200)
	               .style("opacity", .9);
	          tooltip.html("<strong>"+d["State"] + "</strong><br/> Budget/person :" + xValue(d) 
		        + "$ <br> Literacy: " + yValue(d) +"%")
	               .style("margin-left", (d3.event.offsetX + 5) + "px")
	               .style("margin-top", (-350+1*d3.event.offsetY ) + "px");
	      })
	      .on("mouseout", function(d) {
	          tooltip.transition()
	               .duration(500)
	               .style("opacity", 0);
	      });

	}

});
