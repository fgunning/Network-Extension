var employeeTier, dashSheet, name, manager, managerIndex, personName, managerName, graph, columnHeader, link, node, label, simulation;
var peopleList = [];
var nodesList = [];
var linksList = [];
var dict = {};
var finalData = {};
var graph;
var nonNames = [];
var svg = d3.select("svg"),	width = svg.attr("width"),	height = svg.attr("height");
var tier = {};
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
var levels = {'Assoc PC' : 5, 'PC' : 6, 'Senior PC' : 7, 'Principal PC' : 8};
positions = {};
var e = 0;
var q = 0;

$(document).ready(function() {
	//$("#initializeButton").click( () => {
	console.log('initialized');
	tableau.extensions.initializeAsync().then( () => {
		const dashboard = tableau.extensions.dashboardContent.dashboard;
		const dashSheet = dashboard.worksheets[0];
		dashSheet.addEventListener('filter-changed', function() { renderViz('filter event')});
		dashSheet.addEventListener('mark-selection-changed', function() { renderViz('mark event')});	
	});
//});
});


function renderViz(arg1) {
	e++
	console.log(arg1)
	if (e == q+1){
	resetVariables();
	const dashboard = tableau.extensions.dashboardContent.dashboard;
	const dashSheet = dashboard.worksheets[0];
	
	dashSheet.getSummaryDataAsync().then( dataTable => {
		for (i = 0; i < dataTable.data.length; i++){
			positions[dataTable.data[i][0].value] =  levels[dataTable.data[i][3].value];
			};
		console.log(positions);
		for (i = 0; i < dataTable.columns.length; i ++){
			columnHeader = dataTable.columns[i].fieldName;
			if (columnHeader.indexOf("Name") == -1) {
				nonNames.push(i);
			}
		};
		for (i of nonNames) {
			dataTable.columns.splice(i,1);
			for (n of dataTable.data)
			n.splice(i,1);
		};
		for (i=0; i<dataTable.data.length; i++) {
			for (n = 0; n < dataTable.data[i].length; n++) {
				name = dataTable.data[i][n].formattedValue;
				peopleList.push(name);
				tier[name] = n;
				if (n < (dataTable.data[i].length - 1)) {
					manager = dataTable.data[i][n+1].formattedValue;
					dict[name] = manager;
					} else {
					manager = 'no manager';
					dict[name] = manager;
					}
			}
		};
		
		peopleList = Array.from(new Set(peopleList));
		
		for (i = 0; i < peopleList.length; i++) {
			personName = peopleList[i];
			managerName = dict[personName];
			managerIndex = peopleList.indexOf(managerName);
			employeeTier = tier[personName];
			if (employeeTier == 0) {
				employeeTier = positions[peopleList[i]];
				}
			nodesList.push({id : i, name : personName, group : employeeTier});
			if (managerIndex != -1) {
				linksList.push({source_id: i, target_id:managerIndex});
			}
		}
		finalData['nodes'] = nodesList;
		console.log(nodesList);
		finalData['links'] = linksList;
		viz(finalData);
	});
	}
};

function resetVariables() {
	peopleList = [];
	linksList = [];
	nodesList = [];
	dict = {};
	finalData = {};
	d3.selectAll("g").remove();

}

function viz(arg1){
	console.log('render ran');
	q=e
	//console.log("q=" + q)
	graph = arg1;
	graph.links.forEach(function(d){
		d.source = d.source_id;    
		d.target = d.target_id;
	});           
	
	let palette = {1 : '#dc143c', 2 : '#ff8c00', 5 : '#c7dcdd', 6 : '#6a9a9e', 7 : '#325c6c', 8 : '#28345a'}
	simulation = d3.forceSimulation().force("link", d3.forceLink().id(function(d) { return d.id; })).force("charge", d3.forceManyBody().strength(-100)).force("center", d3.forceCenter(svg.attr("width")/2, svg.attr("height")/2));
	
	link = svg.append("g")
	.style("stroke", "#aaa")
	.selectAll("line")
	.data(graph.links)
	.enter().append("line");
	
	node = svg.append("g")
	.attr("class", "nodes")
	.selectAll("circle")
	.data(graph.nodes)
	.enter().append("circle")
	.attr("r", 6)
	.attr("fill", function(d) { return (palette[d.group])})
	.call(d3.drag()
	.on("start", dragstarted)
	.on("drag", dragged)
	.on("end", dragended))
	.on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html(d.name)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })			
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);
		});
	
	simulation
	.nodes(graph.nodes)
	.on("tick", ticked);
	
	simulation.force("link")
	.links(graph.links);
	
	function ticked() {
		link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
		
		node
		.attr("r", 10)
		.style("fill", function(d) {return palette[d.group]})
		.style("stroke", "#969696")
		.style("stroke-width", "1px")
		.attr("cx", function (d) { return d.x+6; })
		.attr("cy", function(d) { return d.y-6; })
	}
}


function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart()
	d.fx = d.x;
	d.fy = d.y;
}

function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}

function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
	}			