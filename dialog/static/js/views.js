$(document).ready(function(){

window.dialog.on("response", function(e, response) {
	 // deal with TTS
		// we want to stop recognising while the system is talking
		// and start listening once the tts has ended
		if (response.hasOwnProperty('tts')) {
				
				console.log(response.tts);
				window.tts.speak(response.tts);
				window.dialog.trigger("tts_start", [response.tts]);
				window.tts.onfinished = function() {
						startListening();
						window.dialog.trigger("tts_end");
				};
		}
		// deal with the system ending the dialog:
		if (response.hasOwnProperty('ended') && response.ended) {
				setTimeout(stopDialog, 1000); // stop the dialog in a second,
																		//gives a chance for the recording of the last utterance to be sent
		}

		// draw belief dist
		if (response.hasOwnProperty('belief')) {
			window.showBeliefFun(response.belief);
		}

		// clear asr results and result_onebest
		$("#results").empty();
		$("#result_onebest").empty();
});

});

function showBeliefFun(belief_pair_list) {
	var margin = {top: 20, right: 20, bottom: 150, left: 60},
			width = 1024 - margin.left - margin.right,
			height = 768 - margin.top - margin.bottom;

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
			.ticks(10, ".4f");

	d3.select("body").select(".chart").html("");
	var svg = d3.select("body").select(".chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var data = belief_pair_list

	x.domain(data.map(function(d) { return d.goal; }));
	y.domain([0, 1]);

	svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", function(d) {
				return "rotate(-45)"
			});

	svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Belief");

	svg.selectAll(".bar")
			.data(data)
		.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.goal); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.prob); })
			.attr("height", function(d) { return height - y(d.prob); });
}
