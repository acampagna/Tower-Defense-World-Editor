$(document).ready(function() {
	openCreateWorldDialog();
	
	$("#grid-tile-type").change(function() {
		selectTypeCallback(this);
	});
	
	$("#generate-world").click(function() {
		generateWorld();
	});
});

function openCreateWorldDialog() {
	$(function() {
		$( "#dialog-create-world" ).dialog({
			modal: true,
			resize: false,
			buttons: {
				Submit: function() {
					$( this ).dialog( "close" );
					createWorldSubmitCallback();
				}
			}
		});
	});
}

function openEditTileDialog(elem) {
	
	cur_id = $(elem).data('id');
	cur_x = $(elem).data('x');
	cur_y = $(elem).data('y');
	
	$("#edit-grid-tile-info-id").html("id: "+cur_id);
	$("#edit-grid-tile-info-x").html("x: "+cur_x);
	$("#edit-grid-tile-info-y").html("y: "+cur_y);
	
	edge = isTileOnEdge(cur_x,cur_y);
	populateTileTypes(edge);

	$(function() {
		$( "#dialog-edit-grid-tile" ).dialog({
			resize: false,
			buttons: {
				Submit: function() {
					$( this ).dialog( "close" );
					createEditTileSubmitCallback();
				}
			}
		});
	});
}

function createWorldSubmitCallback() {
	var width = $("#world-width").val();
	var height = $("#world-height").val();

	$("#world-editor-grid").html(generateGrid(width,height));
	$("#world-grid").css('width',width*32);
	$("#world-grid").css('height',height*32);
	
	setGridEvents();
	
	$("#world-editor-grid").show();
}

function createEditTileSubmitCallback() {
	elem = $("#tile-"+cur_id);
	type = $('#grid-tile-type').val();
	val = $('#grid-tile-value').val();
	dir = $('#grid-tile-direction').val();
	
	addOrEditTile(elem,type,val);
	
	if(type == "s") {
		spawns.push(cur_id);
		
		if(dir) {
			newWp = $('#tile-'+getTileInDirection(cur_x,cur_y,dir));
			addOrEditTile(newWp,"w",dir);
		}
	}
	
	if(type == "g") {
		goals.push(cur_id);
	}
	
	resetEditTileForm();
}

function addOrEditTile(elem,type,value) {
	elem.data('type',type);
	elem.data('value',value);
	elem.html(type + ":" + value);
}

function generateWorld() {
	//Get Adjacent Waypoint from Spawn
	turnTileIntoPath(spawns[0]);
	adj = getAdjacentWaypoint($('#tile-'+spawns[0]).data('x'),$('#tile-'+spawns[0]).data('y'));
	
	if(adj) {
		turnTileIntoPath(adj);
		goal = getNextWaypoint($('#tile-'+adj).data('x'),$('#tile-'+adj).data('y'),$('#tile-'+adj).data('value'));
	}
	
	exportGridToJavaArray();
}

function openAlertDialog(title,msg) {
	$("#dialog-alert").attr('title',title);
	$("#dialog-alert").html(msg);
	$(function() {
		$( "#dialog-alert" ).dialog({
			resize: false,
			buttons: {
				Ok: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	});
}

function generateGrid(width,height) {
	grid_width = width;
	grid_height = height;

	html = "<table id=\"world-grid\">";
	i = 0;
	
	for (j=0;j<height;j++) {
		grid[j] = Array();
		html += "<tr>";
		for(k=0;k<width;k++) {
			i++;
			grid[j][k] = i;
			html += "<td style=\"background:url('images/tiles.png') -32px 0;\" class=\"grid-tile\" id=\"tile-"+i+"\" data-id=\""+i+"\" data-x=\""+k+"\" data-y=\""+j+"\" data-type=\"\" data-value=\"\"></td>";
			
		}
		html+= "</tr>";
	}
	html += "</table>";
	
	return html;
}

function populateTileTypes(edge) {	
	elem_html = "<option value=\"\">Set Type</option>\
		<option value=\"w\">Waypoint</option>";
		
	if(edge) {
		elem_html += "<option value=\"s\">Spawn</option>\
			<option value=\"g\">Goal</option>";
	}
	
	$("#grid-tile-type").html(elem_html);
	
}

function selectTypeCallback(elem) {
	val = $(elem).val();
	
	if(val == "") {
		resetEditTileForm();
	}
	
	if(val == "g") {
		html = "";
		for(var i = 0; i < spawns.length; i++) {
			html += "<option value=\"" + (i+1) + "\">"+(i+1)+"</option>";
		}
		$("#grid-tile-value-list").show();
		$("#grid-tile-value").html(html);
	}
	
	if(val == "s") {
		html = "";
		for(var i = 0; i <= spawns.length; i++) {
			html += "<option value=\"" + (i+1) + "\">"+(i+1)+"</option>";
		}
		$("#grid-tile-value").html(html);
		$("#grid-tile-value-list").show();
		addDefaultDirectionDropdown();
	}
	
	if(val == "w") {
		$("#grid-tile-value-list").show();
		$("#grid-tile-value").html("<option value=\"n\">Up</option><option value=\"e\">Right</option><option value=\"s\">Down</option><option value=\"w\">Left</option>");
	}
}

function addDefaultDirectionDropdown() {
	html = "";
	
	adjTiles = findAdjacentTiles(cur_x,cur_y);
	for (var i = 0; i < adjTiles.length; i++) {
		if(adjTiles[i]) {
			switch(i) {
				case 0:
				  html += "<option value=\"n\">Up</option>";
				  break;
				case 1:
				  html += "<option value=\"e\">Right</option>";
				  break;
				case 2:
				  html += "<option value=\"s\">Down</option>";
				  break;
				case 3:
				  html += "<option value=\"w\">Left</option>";
				  break;
			}
		}
	}
	
	$("#grid-tile-direction").html(html);
	$("#grid-default-direction-list").show();
}

function resetEditTileForm() {
	$("#grid-default-direction-list").hide();
	$("#grid-tile-direction").html("");
	
	$("#grid-tile-value-list").hide();
	$("#grid-tile-value").html("");
}

function setGridEvents() {
	$(".grid-tile").mouseenter(function() {
		$(this).toggleClass('active',0);
	}).mouseleave(function(){
		$(this).toggleClass('active',0);
	});
	
	$(".grid-tile").click(function() {
		openEditTileDialog(this);
	});
}

