/**
 * SVG Axis & Points mini library
 */
var util = {
    drawing : {}
};
//http://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html
//http://www.w3.org/TR/compositing/
//http://www.w3.org/Graphics/SVG/
!(function($){
    util.drawing.SAP = (function() {
        var defaults = {
                        axis : false,
                        interactive : false,
                        x : 50,
                        y : 50,
                        backgroundcolor: '#AAAAAA'
        };
var second = false;
var current = null;
var current2 = null;
var x = 0, y = 0;
        function SAP(parent, _parameters) {
            this.parameters = _parameters;
            this.$el = $('<svg xmlns="http://www.w3.org/2000/svg" id=svg'+((new Date()).getTime())+' width="400px" height="400px">');
            parent.append(this.$el);
            this.$el.on('click', function(evt) {
                if (!second) {
                        var C = document.createElementNS("http://www.w3.org/2000/svg","circle");
                        C.setAttributeNS(null, "cx", evt.clientX-6);
                        C.setAttributeNS(null, "cy", evt.clientY-6);
                        C.setAttributeNS(null, "r", 6);
                        this.appendChild(C);
                        current = [evt.clientX-6,evt.clientY-6];


                        var Eee = document.createElementNS("http://www.w3.org/2000/svg","circle");
                        Eee.setAttributeNS(null, "opacity", 0.3);
                        Eee.setAttributeNS(null, "cx", evt.clientX-6);
                        Eee.setAttributeNS(null, "cy", evt.clientY-6);
                        Eee.setAttributeNS(null, "r", 0);
                        current2 = 'circle'+(new Date()).getTime();
                        Eee.setAttributeNS(null, 'id', current2);
                        this.appendChild(Eee);

                        x = evt.clientX;
                        y = evt.clientY;
                }
                second = !second;
            });
            this.$el.on('mousemove', function(evt) {
                if (second) {
                    var Eee = document.getElementById(current2);
                        Eee.setAttributeNS(null, "r", Math.ceil(Math.sqrt(Math.pow(evt.clientX-x,2)+Math.pow(evt.clientY-y,2))));
                }

            });
        }

        //var

        SAP.prototype.addPoints = function(_points) {
            console.log('points ---', _points);
            this.points = _points;

        };

        return SAP;
    })();
}(jQuery));



var board = new util.drawing.SAP($('body'), {

            });

board.addPoints([
        {color: "#eeffaa", points: [[2,4], [7,8], [12,1]]},
        {color: "#aadd33", points: [[5,6], [1,2], [4,6]]}
    ]);