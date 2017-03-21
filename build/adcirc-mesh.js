// https://github.com/atdyer/adcirc-mesh Version 0.0.1. Copyright 2017 Tristan Dyer.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.adcirc = global.adcirc || {})));
}(this, (function (exports) { 'use strict';

function dispatcher ( object ) {

    object = object || Object.create( null );

    var _listeners = {};
    var _oneoffs = {};

    object.on = function ( type, listener ) {

        if ( !arguments.length ) return object;
        if ( arguments.length == 1 ) return _listeners[ type ];

        if ( _listeners[ type ] === undefined ) {

            _listeners[ type ] = [];

        }

        if ( _listeners[ type ].indexOf( listener ) === - 1 ) {

            _listeners[ type ].push( listener );

        }

        return object;

    };

    object.once = function ( type, listener ) {

        if ( !arguments.length ) return object;
        if ( arguments.length == 1 ) return _oneoffs[ type ];

        if ( _oneoffs[ type ] === undefined ) {

            _oneoffs[ type ] = [];

        }

        if ( _oneoffs[ type ].indexOf( listener ) === - 1 ) {

            _oneoffs[ type ].push( listener );

        }

        return object;

    };

    object.off = function ( type, listener ) {

        var listenerArray = _listeners[ type ];
        var oneoffArray = _oneoffs[ type ];
        var index;

        if ( listenerArray !== undefined ) {

            index = listenerArray.indexOf( listener );

            if ( index !== - 1 ) {

                listenerArray.splice( index, 1 );

            }

        }

        if ( oneoffArray !== undefined ) {

            index = oneoffArray.indexOf( listener );

            if ( index !== -1 ) {

                oneoffArray.splice( index, 1 );

            }

        }

        return object;

    };

    object.dispatch = function ( event ) {

        var listenerArray = _listeners[ event.type ];
        var oneoffArray = _oneoffs[ event.type ];

        var array = [], i, length;

        if ( listenerArray !== undefined ) {

            event.target = object;

            length = listenerArray.length;

            for ( i = 0; i < length; i ++ ) {

                array[ i ] = listenerArray[ i ];

            }

            for ( i = 0; i < length; i ++ ) {

                array[ i ].call( object, event );

            }

        }

        if ( oneoffArray !== undefined ) {

            event.target = object;

            length = oneoffArray.length;

            for ( i = 0; i < length; i ++ ) {

                array[ i ] = oneoffArray[ i ];

            }

            for ( i = 0; i < length; i ++ ) {

                array[ i ].call( object, event );

            }

            _oneoffs[ event.type ] = [];

        }

        return object;

    };

    return object;

}

function mesh () {

    var _mesh = dispatcher();

    var _nodes = Object.create({
        array: [],
        map: d3.map(),
        dimensions: 2
    });
    var _elements = Object.create({
        array: [],
        map: d3.map()
    });

    var _nodal_values = Object.create( null );
    var _elemental_values = Object.create( null );

    var _bounding_box;

    _mesh.bounding_box = function () {

        return _bounding_box;

    };

    _mesh.elemental_value = function ( value, array ) {

        if ( arguments.length == 1 ) return _elemental_values[ value ];
        if ( arguments.length == 2 && array.length == _elements.array.length / 3 ) {
            _elemental_values[ value ] = array;
            _mesh.dispatch( {
                'type': 'elemental_value',
                'name': value,
                'array': array
            } );
        }
        return _mesh;

    };

    _mesh.elements = function ( _ ) {

        if ( !arguments.length ) return _elements;
        if ( _.array && _.map ) _elements = _;
        return _mesh;

    };

    _mesh.nodal_value = function ( value, array ) {

        if ( arguments.length == 1 ) return _nodal_values[ value ];
        if ( arguments.length == 2 && array.length == _nodes.array.length ) {
            _nodal_values[ value ] = array;
            _mesh.dispatch( {
                'type': 'nodal_value',
                'name': value,
                'array': array
            } );
        }
        return _mesh;

    };

    _mesh.nodes = function ( _ ) {

        if ( !arguments.length ) return _nodes;
        if ( _.array && _.map && _.dimensions ) {
            _nodes = _;
            _bounding_box = calculate_bounding_box( _nodes );
        }
        return _mesh;

    };

    return _mesh;

}

function calculate_bounding_box ( nodes ) {

    var array = nodes.array;
    var dims = nodes.dimensions;
    var numnodes = array.length / dims;
    var mins = [], maxs = [];
    for ( var i=0; i<dims; ++i ) {
        mins.push( Infinity );
        maxs.push( -Infinity );
    }

    for ( var node=0; node<numnodes; ++node ) {
        for ( var dim=0; dim<dims; ++dim ) {
            if ( array[ dims*node + dim ] < mins[ dim ] ) mins[ dim ] = array[ dims*node + dim ];
            if ( array[ dims*node + dim ] > maxs[ dim ] ) maxs[ dim ] = array[ dims*node + dim ];
        }
    }

    return [ mins, maxs ];

}

exports.mesh = mesh;

Object.defineProperty(exports, '__esModule', { value: true });

})));
