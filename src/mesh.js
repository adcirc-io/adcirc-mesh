import { dispatcher } from '../../adcirc-events/index'

function mesh () {

    var _mesh = Object.create( null );

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
        if ( arguments.length == 2 && array.length == _elements.array.length ) {
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

    return dispatcher( _mesh );

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

    for ( var node=0; i<numnodes; ++node ) {
        for ( var dim=0; dim<dims; ++dim ) {
            if ( array[ dims*node + dim ] < mins[ dim ] ) mins[ dim ] = array[ dims*node + dim ];
            if ( array[ dims*node + dim ] > maxs[ dim ] ) maxs[ dim ] = array[ dims*node + dim ];
        }
    }

    return [ mins, maxs ];

}

export { mesh }