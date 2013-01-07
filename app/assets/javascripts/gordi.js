var gordi = {
	network: {
		training_set: [],
		flat_training_set: [],
		history: []
	},
	util: {
		groups: []
	}
};

gordi.showClassification = function(data) {
	console.log(data.classification);
};

gordi.initNetwork = function(data) {
	gordi.network.history = data.training_history;
	jQuery('#tabs a[href="#tabPanel"]').tab('show');

	var state_panel = jQuery('#network_state');
	var eval_panel = jQuery('#network_eval');

	network_state_board = util.drawing.SAP(state_panel, {});
	network_eval_board = util.drawing.SAP(eval_panel, {});

	/*
	panel.append(jQuery('<input type="number" id="a" value="0">'));
	var c = jQuery('<button type="submit" id="c" class="btn">Classify</button>');
	panel.append(c);
	c.on('click', function() {
		var i = Number(jQuery('#a').val());
		var point = gordi.network.flat_training_set[i];
		var x = point[0];
		var y = point[1];
		jQuery.ajax({
			type: 'GET',
			url: '/classify/' + x + ',' + y + '.json',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: gordi.showClassification
		});
	});
	*/
};

gordi.sendParameters = function() {
	var hlp = JSON.parse(jQuery('#hlp').val());
	if (gordi.util.isArrayOfNumbers(hlp)) {
		var lr = Number(jQuery('#lr').val());
		var m = Number(jQuery('#m').val());
		var db = jQuery('#db').val() === 'true';
		var ts = gordi.trainingSet();
		training_set_board.drawPoints(ts);
		ts = jQuery.map(ts, function(e) {
			return [e.points];
		});
		gordi.network.training_set = ts;
		gordi.network.flat_training_set = jQuery.map(ts, function(n) {
			return n;
		});
		jQuery.ajax({
			type: 'POST',
			url: '/train.json',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({
				'classifier': {
					'hidden_layers_params': hlp,
					'learning_rate': lr,
					'momentum': m,
					'disable_bias': db,
					'training_set': ts
				}
			}),
			dataType: 'json',
			success: gordi.initNetwork
		});
		jQuery('#sim_form').off('submit');
		jQuery('#sim_form').on('submit', false);
		training_set_board.closeTrainingSet();
	}
};

gordi.util.isArrayOfNumbers = function(ary) {
	if (!jQuery.isArray(ary)) {
		return false;
	}
	for (var i = 0; i < ary.length; i += 1) {
		if (ary[i] !== Number(ary[i])) {
			return false;
		}
	}
	return true;
};

gordi.trainingSet = function() {
	var ts = [];
	var groups = gordi.util.groups;
	for (var i = 1; i <= groups.length; i += 1) {
		var vr = Number(jQuery('#gr' + i + 'var').val());
		var count = Number(jQuery('#gr' + i + 'count').val());
		var radius = groups[i-1].radius;
		var center_coords = groups[i-1].coords;
		var group_points = [];
		for (var j = 0; j < count; j += 1) {
			var d = gordi.util.gaussRandom(0, 0.334 * vr * radius, 0, vr * radius);
			var b = Math.random() * 2 * Math.PI;
			var x = Math.round(center_coords.x - d * Math.cos(b));
			var y = Math.round(center_coords.y + d * Math.sin(b));
			group_points.push([x ,y]);
		}
		ts.push({ color: groups[i-1].color, points: group_points });
	}
	return ts;
};

gordi.util.gaussRandom = function(E, D, min, max) {
	var x, y, r2, ret;
	do {
		do {
			x = -1 + 2 * Math.random();
			y = -1 + 2 * Math.random();
			r2 = x * x + y * y;
		} while (r2 > 1.0 || r2 === 0);
		ret = Math.round(D * y * Math.sqrt(-2.0 * Math.log(r2) / r2) + E);
	} while (ret < min || (max !== null && ret > max));
	return ret;
};

gordi.util.groupCreated = function(group) {
	if (group) {
		gordi.util.groups.push(group);
		var panel = null;
		var groupCount = gordi.util.groups.length;
		if (groupCount === 1) {
			panel = jQuery('<form id="tsp_form"></form>');
		} else {
			panel = jQuery('#tsp_form');
		}
		var fs = jQuery('<fieldset></fieldset>');
		fs.on('mouseover', function() {
			training_set_board.highlightGroup(groupCount - 1);
		});
		fs.on('mouseout', function() {
			training_set_board.dimGroup(groupCount - 1);
		});
		fs.append(jQuery('<legend>Group ' + groupCount + '</legend>'));
		fs.append(jQuery('<label for="gr' + groupCount + 'var">Variance</label>'));
		fs.append(jQuery('<input type="number" id="gr' + groupCount + 'var" min="0" step="0.1" value="1">'));
		fs.append(jQuery('<label for="gr' + groupCount + 'count">Count</label>'));
		fs.append(jQuery('<input type="number" id="gr' + groupCount + 'count" min="1" step="1" value="10">'));
		panel.append(fs);
		jQuery('#training_set_params').append(panel);
	}
};

var training_set_board = null;
var network_state_board = null;
var network_eval_board = null;

jQuery(function() {
	jQuery('#sim_form').on('submit', function(e) {
		e.preventDefault();
		gordi.sendParameters();
	});

	training_set_board = new util.drawing.SAP(jQuery('#training_set'), {});
	training_set_board.actsAsTrainingSet();
});
