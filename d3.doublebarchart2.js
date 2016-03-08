d3.doublebarchart = function() {
    //defaults
    var threshold = false,
        data = [],
        color = 'gray',
        size = {"width": 300, "height": 300}
        
    
    
    function doublebarchart(selection) {
        selection.each(function(d,i) {
            var datav = (typeof(data) === "function" ? data(d) : data),
                sizev = (typeof(size) === "function" ? size(d) : size),
                thresholdv = (typeof(threshold) === "function" ? threshold(d) : threshold);
            
            
            var names = [],
                ymax = 0;
            for (i = 0; i < datav.length; i++) {
                names.push(datav[i].name);
//                if ((typeof(datav[i]['value_hi']) != 'undefined') && (datav[i]['value_hi'] > ymax)) {
//                    ymax = datav[i]['value_hi'];
//                } else if (datav[i]['value'] > ymax)
//                    ymax = datav[i]['value'];
//                if ((typeof(datav[i]['value_old']) != 'undefined') && (datav[i]['value_old'] > ymax))
//                    ymax = datav[i]['value_old'];
                if (2*CalcBinU(datav[i]['value']*666,666)-(2-1)*datav[i]['value'] > ymax)
                    ymax = 2*CalcBinU(datav[i]['value']*666,666)-(2-1)*datav[i]['value'];
            }
            ymax = ymax * 1.1;
            //scales
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, sizev['width']], .25)
                .domain(names);
            var y = d3.scale.linear()
                .range([sizev['height'], 0])
                .domain([0,ymax])
                .nice();
            //axes
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(5, "%");
            //get this element
            var element = d3.select(this);
            
            //Create X axis
            element.append("g")
		        .attr("class", "axis x-axis")
		        .attr("transform", "translate(0," + height + ")")
		        .call(xAxis);
		
		    //Create Y axis
            //element.append("g")
		        //.attr("class", "axis y-axis")
		        //.call(yAxis);

            //link
            var link = element.append("a")
                .attr("xlink:href","http://pollster.eu")
              .append("text")
                .attr("fill","#abc")
                .attr("fill-opacity",1)
                .attr("font-family","sans-serif")
                .attr("font-weight","bold")
                .attr("font-size",height/2)
                .attr("font-size","0.66em")
                .attr("x",function(d) {return width*0.8})
                .attr("y",function(d) {return height*0.05});
          
            link.append("tspan")   
               .text("pollster.eu")
               .attr("fill","blue");
            link.append("tspan")
                .text("rope")
                .attr("fill","#abc");
                
		   
		    
//		    element.selectAll(".value-old")
//              .data(datav)
//            .enter().append("rect")
//              .attr("class", function(d) {return "bar old " + d.id})
//              .attr("x", function(d) { return x(d.name) - x.rangeBand()/5; })
//              .attr("width", x.rangeBand())
//              .attr("y", function(d) { if (typeof(d.value_old) != "undefined") return y(d.value_old); else return y(0); })
//              .attr("height", function(d) { if (typeof(d.value_old) != "undefined") return height - y(d.value_old); else return height - y(0) })
//              .attr("title",function(d) {title =  Math.round(100*d.value_old) + " %"; return title;})
//              .attr("fill",function(d) {return d.color})
//              .attr("fill-opacity",0.2);
              
            element.selectAll(".value")
              .data(datav)
            .enter().append("rect")
              .attr("class", function(d) {return "bar " + d.id})
              .attr("x", function(d) { return x(d.name)})
              .attr("width", x.rangeBand())
              .attr("y", function(d) { 
                coef = 2;
                return y(coef*CalcBinL(d.value*666,666)-(coef-1)*d.value); 
              })
              .attr("height", function(d) {
                coef = 2;
                return height - y(coef*CalcBinL(d.value*666,666)-(coef-1)*d.value)
              })
              .attr("title",function(d) {title =  Math.round(100*d.value) + " %"; return title;})
              .attr("fill",function(d) {return d.color})
              .attr("fill-opacity",1);

            element.selectAll(".half-value")
              .data(datav)
            .enter().append("rect")
              .attr("class", function(d) {return "bar " + d.id})
              .attr("x", function(d) { return x(d.name)})
              .attr("width", x.rangeBand())
              .attr("y", function(d) { 
                coef = 2;
                return y(coef*CalcBinU(d.value*666,666)-(coef-1)*d.value); 
              })
              .attr("height", function(d) {
                coef = 2;
                return height - y(coef*CalcBinU(d.value*666,666)-(coef-1)*d.value)
              })
              .attr("title",function(d) {title =  Math.round(100*d.value) + " %"; return title;})
              .attr("fill",function(d) {return d.color})
              .attr("fill-opacity",0.4)
            
            element.selectAll(".half-value")
              .data(datav)
            .enter().append("line")
              .attr("x1", function(d) { return x(d.name)})
              .attr("y1", function(d) {return y(d.value)})
              .attr("x2", function(d) { return x(d.name) + x.rangeBand(); })
              .attr("y2", function(d) {return y(d.value)})
              .attr("stroke",function(d) { return d.color});
            
          
            //threshold
            if (thresholdv) {
              element.append("line")
                .attr("x1", 0)
                .attr("y1", function() { return y(thresholdv) })
                .attr("x2", width)
                .attr("y2", function() { return y(thresholdv) })
                .attr("stroke","darkred")
                .attr("stroke-dasharray","10,10");
           }
           //text
           var legend = element.selectAll(".text")
                .data(datav)
            .enter()
               .append("text")
               .attr("text-anchor", "middle")
               .attr("x", function(d, i) { return x(d.name) + x.rangeBand()/2; })
	           .attr("y", function(d) { 
	                coef = 2;
	                return y(coef*CalcBinU(d.value*666,666)-(coef-1)*d.value) - sizev['height']/10;
	            })
	           .attr("font-family","sans-serif");
           
           legend.append("tspan")   
               .text(function(d){return  Math.round(10000*d.value)/100 + "%";})
               .attr("font-weight","bold")
               ;
	      
	      var legend2 = element.selectAll(".text")
                .data(datav)
            .enter()
               .append("text")
               .attr("text-anchor", "middle")
               .attr("x", function(d, i) { return x(d.name) + x.rangeBand()/2; })
	           .attr("y", function(d) { 
	                coef = 2;
	                return y(coef*CalcBinU(d.value*666,666)-(coef-1)*d.value) - sizev['height']/30;
	            })
	           .attr("font-family","sans-serif");
	            
	      legend2.append("tspan")   
               .text(function(d){
	                coef = 2;
	                v = Math.round((coef*CalcBinU(d.value*666,666)-(coef)*d.value)*200)/2;
                    return "±" + String(v) + "%";
               })
               .attr("font-size","0.66em");

	    
//	      element.selectAll(".text")
//                .data(data)
//           .enter()
//               .append("text")
//               .text(function(d){
//                    if (typeof(d.value_old) != "undefined")
//                        return  "(" + Math.round(10000*d.value_old)/100 + "%)";
//                    else
//                        return "";
//                })
//               .attr("text-anchor", "middle")
//	           .attr("x", function(d, i) { return x(d.name) + x.rangeBand()/2; })
//	           .attr("y", function(d) { 
//	                if (typeof(d.value_old) != "undefined") 
//	                    return y(Math.max(d.value_old,d.value)) - 5; 
//	                else
//	                    return y(0);
//	            })
//	            .attr("font-size","0.66em")
//	           .attr("class","label2");

        });

    }
                
    doublebarchart.data = function(value) {
        if (!arguments.length) return value;
        data = value;
        return doublebarchart;
    };
    doublebarchart.size = function(value) {
        if (!arguments.length) return value;
        size = value;
        return doublebarchart;
    };
    doublebarchart.threshold = function(value) {
        if (!arguments.length) return value;
        threshold = value;
        return doublebarchart;
    };
    
    return doublebarchart;  
    
}
