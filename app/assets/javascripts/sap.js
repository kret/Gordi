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
			var bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			bg.setAttributeNS(null, 'x', 0);
			bg.setAttributeNS(null, 'y', 0);
			bg.setAttributeNS(null, 'width', 400);
			bg.setAttributeNS(null, 'height', 400);
			bg.setAttributeNS(null, 'style', 'fill: #ffffff;');
			this.$el.append(bg);
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
					C.setAttributeNS(null, 'fill', '#000000');
					start = [cx, cy];

					var E = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
					E.setAttributeNS(null, 'opacity', 0.3);
					E.setAttributeNS(null, 'cx', cx);
					E.setAttributeNS(null, 'cy', cy);
					E.setAttributeNS(null, 'r', 0);
					E.setAttributeNS(null, 'fill', getColor());
					E.setAttributeNS(null, 'stroke', '#000000');
					E.setAttributeNS(null, 'stroke-width', 1);
					current = 'circle' + (new Date()).getTime();
					E.setAttributeNS(null, 'id', current);

					this.appendChild(E);
					this.appendChild(C);

					x = tx;
					y = ty;
				} else {
					var endCircle = document.getElementById(current);
					groupsList.push(endCircle);
					gordi.util.groupCreated({
						coords: {
							x: Number(endCircle.getAttribute('cx')),
							y: Number(endCircle.getAttribute('cy'))
						},
						radius: Number(endCircle.getAttribute('r')),
						color: endCircle.getAttribute('fill')
					});
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
		};

		var colorsList = ['#ff0000', '#00ff00', '#0000ff'];
		var getColor = function() {
			var color = null;
			if (groupsList.length <= colorsList.length) {
				color = colorsList[groupsList.length];
			} else {
				color = '#' + (Math.random() * 0xffffff << 0).toString(16);
			}
			return color;
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
					el.setAttributeNS(null, 'cy', pointData.points[j][1]);
					el.setAttributeNS(null, 'r', 5);
					el.setAttributeNS(null, 'opacity', 0.3);
					el.setAttributeNS(null, 'fill', pointData.color);
					el.setAttributeNS(null, 'stroke', '#000000');
					el.setAttributeNS(null, 'stroke-width', 1);
					this.$el.append(el);
				}
			}
		};

		SAP.prototype.clear = function() {
			$('circle', this.$el).remove();
		};

		SAP.prototype.closeTrainingSet = function() {
			this.$el.off('click');
			this.$el.off('mousemove');
		};

		SAP.prototype.highlightGroup = function(no) {
			groupsList[no].setAttributeNS(null, 'opacity', 1);
		};

		SAP.prototype.dimGroup = function(no) {
			groupsList[no].setAttributeNS(null, 'opacity', 0.3);
		};

		return SAP;
	})();
}(jQuery));
