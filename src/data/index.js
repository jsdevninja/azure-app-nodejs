// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/data
@description Exposes data access operations for tables
*/

var types = require('../utilities/types');

/**
Create an instance of the data provider specified in the configuration.
@param {dataConfiguration} configuration - The data provider configuration
@returns A function that accepts either a {@link tableDefinition} or
{@link module:azure-mobile-apps/express/tables/table table object} and returns an
object with the members described below.
*/
module.exports = function (configuration) {
    var provider = (configuration && configuration.data && configuration.data.provider) || 'memory';
    return (types.isFunction(provider) ? provider : require('./' + provider))(configuration.data);
}

/**
@function read
@description Execute a query against the table.
@param {module:queryjs/Query} query The query to execute
@returns A promise that yields the results of the query, as expected by the Mobile Apps client.
If the query has a single property specified, the result should be a single object.
If the query has a includeTotalCount property specified, the result should be an object
containing a results property and a count property. */
/**
@function update
@description Update a row in the table.
@param {object} item The item to update
@returns A promise that yields the updated object
*/
/**
@function insert
@description Insert a row in the table.
@param {object} item The item to insert
@returns A promise that yields the inserted object.
*/
/**
@function delete
@description Delete an item from the table
@param {string|number} id The id of the item to delete
@param {string} version Base64 encoded row version
@returns A promise that yields the deleted object
*/
/**
@function undelete
@description Undelete an item from the table
@param {string|number} id The id of the item to delete
@param {string} version Base64 encoded row version
@returns A promise that yields the undeleted object
*/
/**
@function truncate
@description Clear all rows from the table
@returns A promise.
*/
/**
@function initialize
@description Create or update the underlying database table with the columns specified in the table configuration.
@returns A promise that resolves when the table schema has been created or updated.
*/
