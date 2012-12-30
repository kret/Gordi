var gordi = {
	network: {
		training_set: [],
		history: []
	},
	util: {}
};

gordi.recordTraining = function(data) {
	gordi.network.history.push(data.current_state);
};

gordi.initNetwork = function(data) {
	gordi.network.history.push(data.initial_state);
	jQuery('#tabs a[href="#tabPanel"]').tab('show');
	var panel = jQuery('#tabPanel');
	// panel.prepend(jQuery('<input type="number" id="a" value="0">'));
	var b = jQuery('<button type="submit" class="btn">Go A</button>');
	panel.prepend(b);
	b.on('click', function() {
		// var a = Number(jQuery('#a').val());
		jQuery.ajax({
			type: 'GET',
			url: '/train/' + gordi.network.history.length + '.json',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: gordi.recordTraining
		});
	});
};

gordi.sendParameters = function() {
	var hlp = JSON.parse(jQuery('#hlp').val());
	if (gordi.util.isArrayOfNumbers(hlp)) {
		var lr = Number(jQuery('#lr').val());
		var m = Number(jQuery('#m').val());
		var db = jQuery('#db').val() === 'true';
		var ts = [
			[[0, 0], [1, 1], [0.5, 0.5]],
			[[10, 10], [11, 11], [10.5, 10.5]],
			[[20, 20], [21, 21], [20.5, 20.5]]
		];
		gordi.network.training_set = ts;
		jQuery.ajax({
			type: 'POST',
			url: '/simulation.json',
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

jQuery(function() {
	jQuery('#sim_form').on('submit', function(e) {
		e.preventDefault();
		gordi.sendParameters();
	});
});