/**
 * SVG Axis & Points mini library
 */
var util = {
	drawing: {}
};
// http://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html
// http://www.w3.org/TR/compositing/
// http://www.w3.org/Graphics/SVG/
!(function($) {
	util.drawing.SAP = (function() {
		var defaults = {
			axis: false,
			interactive: false,
			x: 50,
			y: 50,
			backgroundcolor: '#aaaaaa'
		};
		var second = false;
		var start = null;
		var current = null;
		var x = 0, y = 0;

		function SAP(parent, _parameters) {
			this.parameters = _parameters;
			this.$el = $('<svg xmlns="http://www.w3.org/2000/svg" id="svg' + (new Date()).getTime() + '" width="400px" height="400px">');
			parent.append(this.$el);
			this.$el.on('click', function(evt) {
				if (!second) {
					var dotr = 6;
					var tx = evt.offsetX;
					var ty = evt.offsetY;
					var cx = tx - dotr / 2;
					var cy = ty - dotr / 2;
					var C = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
					C.setAttributeNS(null, 'cx', cx);
					C.setAttributeNS(null, 'cy', cy);
					C.setAttributeNS(null, 'r', dotr);
					this.appendChild(C);
					start = [cx, cy];

					var E = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
					E.setAttributeNS(null, 'opacity', 0.3);
					E.setAttributeNS(null, 'cx', cx);
					E.setAttributeNS(null, 'cy', cy);
					E.setAttributeNS(null, 'r', 0);
					current = 'circle' + (new Date()).getTime();
					E.setAttributeNS(null, 'id', current);
					this.appendChild(E);

					x = tx;
					y = ty;
				}
				second = !second;
			});
			this.$el.on('mousemove', function(evt) {
				if (second) {
					var tx = evt.offsetX;
					var ty = evt.offsetY;
					var E = document.getElementById(current);
					E.setAttributeNS(null, 'r', Math.ceil(Math.sqrt(Math.pow(tx - x, 2) + Math.pow(ty - y, 2))));
				}
			});
		}

		SAP.prototype.addPoints = function(_points) {
			this.points = _points;
		};

		return SAP;
	})();
}(jQuery));

var training_set_board = new util.drawing.SAP(jQuery('#training_set'), {});
/*
training_set_board.addPoints([
	{ color: '#eeffaa', points: [[2,4], [7,8], [12,1]] },
	{ color: '#aadd33', points: [[5,6], [1,2], [4,6]] }
]);
*/
