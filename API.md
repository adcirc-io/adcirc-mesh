# adcirc-mesh API

## Mesh

<a name="adcirc-mesh" href="#adcirc-mesh">#</a> *adcirc*.**mesh**()

Creates a new mesh object. The mesh object is an event dispatcher with the following events:

* 'elemental_value' - Fired when an elemental value is set using *mesh*.<a href="#mesh-elemental-value">**elemental_value**()</a>
* 'nodal_value' - Fired when a nodal value is set using *mesh*.<a href="#mesh-nodal-value">**nodal_value**()</a>

<a name="mesh-bounding-box" href="#mesh-bounding-box">#</a> *mesh*.**bounding_box**()

Returns the bounding box of all nodes in the mesh

<a name="mesh-elemental-value" href="#mesh-elemental-value">#</a> *mesh*.**elemental_value**(*name*[, *array*])

Gets or sets an elemental value. Elemental values are mesh properties that are quantified by a single value per element in the mesh, so when setting an elemental value the length of *array* must be equal to the number of elements in the mesh. Elemental values are retrieved by passing only the *name* of the elemental value, which returns the entire array of values. Returns undefined if the mesh does not contain the *name*. Passing the *name* and *array* parameters will set the elemental value if *array* is the correct length, and returns the mesh object.

When an elemental value is set, the following event is dispatched

```javascript
{
    'type': 'elemental_value',
    'value': name,
    'array': array
}
```

<a name="mesh-elemental-values" href="#mesh-elemental-values">#</a> *mesh*.**elemental_values**()

Returns a list of available elemental values.

<a name="mesh-elements" href="#mesh-elements">#</a> *mesh*.**elements**([*elements*])

Gets or sets the elements in the mesh. If setting, *elements* must be an object containing the following properties:

* *array* - A Uint32Array containing flattened elemental node numbers, e.g. `[ 1, 2, 3, 2, 3, 4, 1, 3, 4, ... ]`
* *map* - A d3 map that maps element numbers to element indices, e.g. `{ 1: 0, 2: 1, 3: 2, ... }`

Setting the elements returns the mesh object.

<a name="mesh-nodal-value" href="#mesh-nodal-value">#</a> *mesh*.**nodal_value**(*name*[, *array*])

Gets or sets a nodal value. Nodal values are mesh properties that are quantified by a single value per node in the mesh, so when setting a nodal value the length of *array* must be equal to the number of nodes in the mesh. Nodal values are retrieved by passing only the *name* of the nodal value, which returns the entire array of values. Returns undefined if the mesh does not contain the *name*. Passing the *name* and *array* parameters will set the nodal values if *array* is the correct length, and returns the mesh object.

When a nodal value is set, the following event is dispatched

```javascript
{
    'type': 'nodal_value',
    'value': name,
    'array': array
}
```

<a name="mesh-nodal-values" href="#mesh-nodal-values">#</a> *mesh*.**nodal_values**()

Returns a list of available nodal values.

<a name="mesh-nodes" href="#mesh-nodes">#</a> *mesh*.**nodes**([*nodes*])

Gets or sets the nodes in the mesh. If setting, *nodes* must be an object containing the following properties:

* *array* - A Float32Array containing flattened nodal values, e.g. `[ x1, y1, z1, x2, y2, z2, ... ]`
* *map* - A d3 map that maps from node number to node index, e.g. `{ 1: 0, 2: 1, 3: 2, ... }`
* *dimensions* - The number of values per node in *array*, which would be 3 for this example (x, y, and z).
* *names* [optional] - The name associated with each dimension. If included, the first two must always be 'x' and 'y'. Additional names will be used to as nodal values.

If the *names* property is included and *dimensions* is greater than two, each additional dimension will be included as a nodal value with the associated name. If there are more than two dimensions but the *names* property is not included, the additional dimensions will not be included as nodal values.

Setting the nodes returns the mesh object.