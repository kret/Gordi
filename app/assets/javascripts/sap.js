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
		var groupsList = [];

		function SAP(parent, _parameters) {
			this.parameters = _parameters;
			this.$el = $('<svg xmlns="http://www.w3.org/2000/svg" id="svg' + (new Date()).getTime() + '" width="400px" height="400px">');
			parent.append(this.$el);
		}

		SAP.prototype.actsAsTrainingSet = function() {
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
					groupsList.push(E);
				}
			});
		};

		SAP.prototype.drawPoints = function(_points) {
			this.points = _points;
			var el = null;
			var pointData = null;
			for (var i = 0; i < this.points.length; i += 1) {
				pointData = this.points[i];
				for (var j = 0; j < pointData.points.length; j += 1) {
					el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
					el.setAttributeNS(null, 'cx', pointData.points[j][0]);
					el.setAttributeNS(null, 'cy', pointData.points[j][0]);
					el.setAttributeNS(null, 'r', 3);
					el.setAttributeNS(null, 'fill', pointData.color);
					el.setAttributeNS(null, 'stroke', '#000000');
					el.setAttributeNS(null, 'stroke-width', 2);
					this.$el.append(el);
				}
			}
		};

		SAP.prototype.closeTrainingSet = function() {
			this.$el.off('click');
			this.$el.off('mousemove');
		};

		return SAP;
	})();
}(jQuery));

var training_set_board = new util.drawing.SAP(jQuery('#training_set'), {});
training_set_board.actsAsTrainingSet();

/*
training_set_board.drawPoints([
	{ color: '#eeffaa', points: [[2,4], [17,18], [22,21]] },
	{ color: '#aadd33', points: [[35,36], [41,42], [54,56]] }
]);
*/
