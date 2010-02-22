/*
    Copyright 2008,2009
        Matthias Ehmann,
        Michael Gerhaeuser,
        Carsten Miller,
        Bianca Valentin,
        Alfred Wassermann,
        Peter Wilfahrt

    This file is part of JSXGraph.

    JSXGraph is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    JSXGraph is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with JSXGraph.  If not, see <http://www.gnu.org/licenses/>.
*/

/** 
 * @fileoverview This file contains the class definition of JXG.Angle and the JXG.createAngle
 * element wrapper.
 * @author graphjs
 */
 
/**
 * Creates a new instance of Angle.
 * @class JXG.Angle holds properties and methods for creating and modifying the geometry
 * element angle which is visualized with a sector.
 * @param {JXG.Board} board The board the angle is associated with.
 * @param {JXG.Point} p1 First point A defining the angle ABC.
 * @param {JXG.Point} p2 Second point B defining the angle ABC.
 * @param {JXG.Point} p3 Third point C defining the angle ABC.
 * @param {number} radius Radius of the angle.
 * @param {String} text A text drawn beside the angle.
 * @param {String} id Unique identifier for this object. If null or an empty string is given,
 * an unique id will be generated by Board
 * @param {String} name Not necessarily unique name, displayed on the board. If null or an
 * empty string is given, an unique name will be generated.
 * @constructor
 * @extends JXG.GeometryElement
 */
JXG.Angle = function (board, p1, p2, p3, radius, text, id, name, withLabel, layer) {
    /* Call the constructor of GeometryElement */
    this.constructor();
    /**
     * Type of GeometryElement, value is OBJECT_TYPE_ANGLE.
     * @constant
     * @type number
     */    
    this.type = JXG.OBJECT_TYPE_ANGLE;
    
    /**
     * Class of the element, value is OBJECT_CLASS_AREA.
     * @constant
     * @type number
     */
    this.elementClass = JXG.OBJECT_CLASS_AREA;
    
    this.init(board, id, name);

    /**
     * Set the display layer.
     */
    if (layer == null) layer = board.options.layer['angle'];
    this.layer = layer;

    /**
     * First point A defining the angle ABC. Do no set this property directly as it
     * will break JSXGraph's dependency tree.
     * @type JXG.Point
     * @private
     */
    this.point1 = JXG.getReference(this.board, p1);

    /**
     * Second point B defining the angle ABC. Do no set this property directly as it
     * will break JSXGraph's dependency tree.
     * @type JXG.Point
     * @private
     */    
    this.point2 = JXG.getReference(this.board, p2);
    
    /**
     * Third point C defining the angle ABC. Do no set this property directly as it
     * will break JSXGraph's dependency tree.
     * @type JXG.Point
     * @private
     */
    this.point3 = JXG.getReference(this.board, p3);    

    /**
    * Determines the radius of the sector that visualizes the angle.
    * @type number
    */
    this.radius = this.board.options.angle.radius;
    if(radius != undefined && radius != null) {
        this.radius = radius;
    }

    this.visProp['fillColor'] = this.board.options.angle.fillColor;
    this.visProp['highlightFillColor'] = this.board.options.angle.highlightFillColor;
    this.visProp['fillOpacity'] = this.board.options.angle.fillOpacity;
    this.visProp['highlightFillOpacity'] = this.board.options.angle.highlightFillOpacity;
    this.visProp['strokeColor'] = this.board.options.angle.strokeColor;    


    /* TODO Why is this here and not in board.generateName? --michael */
    if(text == '') {
        var possibleNames = ['&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;', '&zeta;', '&eta', '&theta;',
                                '&iota;', '&kappa;', '&lambda;', '&mu;', '&nu;', '&xi;', '&omicron;', '&pi;', '&rho;', 
                                '&sigmaf;', '&sigma;', '&tau;', '&upsilon;', '&phi;', '&chi;', '&psi;', '&omega;'],
            i = 0,
            j, x, el, pre, post, found;
        while(i < possibleNames.length) {
            j=i;
            x = possibleNames[i];
            for(el in board.objects) {
                if(board.objects[el].type == JXG.OBJECT_TYPE_ANGLE) {
                    if(board.objects[el].text == x) {
                        i++;
                        break;
                    }
                }
            }
            if(i==j) {
                text = x;
                i = possibleNames.length+1;
            }
        }
        if(i == possibleNames.length) {
            pre = '&alpha;_{';
            post = '}';
            found = false;
            j=0;
            while(!found) {
                for(el in board.objects) {
                    if(board.objects[el].type == JXG.OBJECT_TYPE_ANGLE) {
                        if(board.objects[el].text == (pre+j+post)) {
                            found = true;
                            break;
                        }
                    }
                }
                if(found) {
                    found= false;
                }
                else {
                    found = true;
                    text = (pre+j+post);
                }
            }
        }
    }

    /** 
    * Text (i.e. name) of the Angle.
    * @type String
    * @private
    */    
    this.text = text;

    // create Label
    var tmp = this.name;
    this.name = this.text;
    this.createLabel(withLabel);    
    this.name = tmp;
    
    this.id = this.board.addAngle(this);
    
    /* Add sector as child to defining points */
    this.point1.addChild(this);
    this.point2.addChild(this);
    this.point3.addChild(this);    
};

JXG.Angle.prototype = new JXG.GeometryElement;

/**
 * Checks whether (x,y) is near the angle. This method is a stub always returning
 * false.
 * @param {int} x Coordinate in x direction, screen coordinates.
 * @param {int} y Coordinate in y direction, screen coordinates.
 * @return {bool} Always false, because the angles interior shall not be highlighted
 */
JXG.Angle.prototype.hasPoint = function (x, y) { 
    return false; 
};

/**
 * Uses the boards renderer to update the angle and all of its children.
 */
 JXG.Angle.prototype.updateRenderer = function () {
    if (this.needsUpdate) {
        this.board.renderer.updateAngle(this);
        this.needsUpdate = false;
    }
    
    /* Update the label if visible. */
    if(this.hasLabel && this.label.content.visProp['visible'] && this.isReal) {
        //this.label.setCoordinates(this.coords);
        this.label.content.update();
        //this.board.renderer.updateLabel(this.label);
        this.board.renderer.updateText(this.label.content);
    }      
};

/**
 * return LabelAnchor
 */
JXG.Angle.prototype.getLabelAnchor = function() {
    var angle = this.board.algebra.trueAngle(this.point1, this.point2, this.point3);
    var dist = this.point1.coords.distance(JXG.COORDS_BY_USER,this.point2.coords);
    var bxminusax = (this.point1.coords.usrCoords[1] - this.point2.coords.usrCoords[1])*(this.radius/2)/dist;
    var byminusay = (this.point1.coords.usrCoords[2] - this.point2.coords.usrCoords[2])*(this.radius/2)/dist;
    var c = new JXG.Coords(JXG.COORDS_BY_USER, 
                          [this.point2.coords.usrCoords[1]+ Math.cos(angle*Math.PI/(2*160))*bxminusax - Math.sin(angle*Math.PI/(2*160))*byminusay, 
                           this.point2.coords.usrCoords[2]+ Math.sin(angle*Math.PI/(2*160))*bxminusax + Math.cos(angle*Math.PI/(2*160))*byminusay], 
                          this.board);
    if(this.label.content != null) {                          
        this.label.content.relativeCoords = new JXG.Coords(JXG.COORDS_BY_USER, [0/(this.board.stretchX),0/(this.board.stretchY)],this.board);                      
    }
    return c;
};

/**
 * Creates a new angle.
 * @param {JXG.Board} board The board the angle is put on.
 * @param {Array} parents Array of three points defining the angle.
 * @param {Object} attributs Object containing properties for the element such as stroke-color and visibility. @see JXG.GeometryElement#setProperty
 * @type JXG.Angle
 * @return Reference to the created angle object.
 */
JXG.createAngle = function(board, parents, attributes) {
    var el;
    
    attributes = JXG.checkAttributes(attributes,{withLabel:JXG.readOption(board.options,'angle','withLabel'), text:'', layer:null});
    
    // Alles 3 Punkte?
    if ( (JXG.isPoint(parents[0])) && (JXG.isPoint(parents[1])) && (JXG.isPoint(parents[2]))) {
        el = new JXG.Angle(board, parents[0], parents[1], parents[2], attributes['radius'], attributes['text'], attributes['id'], attributes['name'],attributes['withLabel'],attributes['layer']);
    } // Ansonsten eine fette Exception um die Ohren hauen
    else
        throw new Error("JSXGraph: Can't create angle with parent types '" + (typeof parents[0]) + "' and '" + (typeof parents[1]) + "' and '" + (typeof parents[2]) + "'.");

    return el;
};

JXG.JSXGraph.registerElement('angle', JXG.createAngle);
