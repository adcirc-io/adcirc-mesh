import { dispatcher } from '../../adcirc-events/index'

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

    var _nodal_values = d3.map();
    var _elemental_values = d3.map();

    var _bounding_box;

    _mesh.bounding_box = function () {

        return _bounding_box;

    };

    _mesh.bounds = function ( value ) {

        var array = _mesh.nodal_value( value ) || _mesh.elemental_value( value );
        if ( array ) return calculate_bounding_box({
            array: array,
            dimensions: 1
        });

    };

    _mesh.elemental_value = function ( value, array ) {

        if ( arguments.length == 1 ) return _elemental_values.get( value );
        if ( arguments.length == 2 && array.length == _elements.array.length / 3 ) {
            _elemental_values.set( value, array );
            _mesh.dispatch( {
                type: 'elemental_value',
                name: value,
                array: array
            } );
        }
        return _mesh;

    };

    _mesh.elemental_values = function () {

        return _elemental_values.keys();

    };

    _mesh.elements = function ( _ ) {

        if ( !arguments.length ) return _elements;
        if ( _.array && _.map ) _elements = _;

        _mesh.dispatch( {
            type: 'num_elements',
            num_elements: _mesh.num_elements()
        } );

        return _mesh;

    };

    _mesh.nodal_value = function ( value, array ) {

        if ( arguments.length == 1 ) return _nodal_values.get( value );
        if ( arguments.length == 2 && array.length == _nodes.array.length / _nodes.dimensions ) {
            _nodal_values.set( value, array );
            _mesh.dispatch( {
                type: 'nodal_value',
                name: value,
                array: array
            } );
        }
        return _mesh;

    };

    _mesh.nodal_values = function () {

        return _nodal_values.keys();

    };

    _mesh.nodes = function ( _ ) {

        if ( !arguments.length ) return _nodes;
        if ( _.array && _.map && _.dimensions ) store_nodes( _ );

        _mesh.dispatch( {
            type: 'bounding_box',
            bounding_box: _bounding_box
        } );

        _mesh.dispatch( {
            type: 'num_nodes',
            num_nodes: _mesh.num_nodes()
        } );

        return _mesh;

    };

    _mesh.num_elements = function () {

        return _elements.array.length / 3;

    };

    _mesh.num_nodes = function () {

        return _nodes.array.length / _nodes.dimensions;

    };

    return _mesh;


    function store_nodes ( nodes ) {

        var extra_dimensions = nodes.names ? Math.min( nodes.names.length, nodes.dimensions ) - 2 : 0;
        var num_nodes = nodes.array.length / nodes.dimensions;
        var arrays = [ new Float32Array( 2 * num_nodes ) ];

        for ( var i=0; i<extra_dimensions; ++i ) {
            arrays.push( new Float32Array( num_nodes ) );
        }

        for ( var node=0; node<num_nodes; ++node ) {

            arrays[ 0 ][ 2 * node ] = nodes.array[ nodes.dimensions * node ];
            arrays[ 0 ][ 2 * node + 1 ] = nodes.array[ nodes.dimensions * node + 1 ];

            for ( var dimension = 0; dimension < extra_dimensions; ++dimension ) {

                arrays[ 1 + dimension ][ node ] = nodes.array[ nodes.dimensions * node + 2 + dimension ];

            }
        }

        _nodes = {
            array: arrays[0],
            map: nodes.map,
            dimensions: 2,
            names: ['x', 'y']
        };

        for ( var dimension = 0; dimension < extra_dimensions; ++dimension ) {

            var name = nodes.names[ 2 + dimension ];
            _mesh.nodal_value( name, arrays[ 1 + dimension ] );

        }

        _bounding_box = calculate_bounding_box( _nodes );

    }

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
            if ( array[ dims * node + dim ] !== -99999 ) {
                if ( array[ dims * node + dim ] < mins[ dim ] ) mins[ dim ] = array[ dims * node + dim ];
                if ( array[ dims * node + dim ] > maxs[ dim ] ) maxs[ dim ] = array[ dims * node + dim ];
            }
        }
    }

    return dims == 1 ? [ mins[0], maxs[0] ] : [ mins, maxs ];

}

export { mesh }