jQuery(function() {
	function init(data) {
		console.log(data);
	}

	jQuery('#sim_form').submit(function(e) {
		e.preventDefault();

		var hlp = JSON.parse(jQuery('#hlp').val());
		var lr = Number(jQuery('#lr').val());
		var m = Number(jQuery('#m').val());
		var db = jQuery('#db').val() === 'true';
		var ts = [
			[[0, 0], [1, 1], [0.5, 0.5]],
			[[10, 10], [11, 11], [10.5, 10.5]],
			[[20, 20], [21, 21], [20.5, 20.5]]
		];
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
			success: init
		});
		jQuery('.dropdown-toggle').dropdown('toggle');
	});
});