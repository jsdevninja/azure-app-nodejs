// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/express/tables
@description This module contains functionality for adding tables to an Azure
Mobile App. It returns a router that can be attached to an express app with
some additional functions for registering tables.
*/
var express = require('express'),
    importDefinition = require('../../configuration/importDefinition'),
    table = require('./table'),
    logger = require('../../logger'),
    tableRouter = require('./tableRouter'),
    assert = require('../../utilities/assert').argument;

/**
Create an instance of an express router for routing and handling table requests.
@param {configuration} configuration
@returns An express router with additional members described below.
*/
module.exports = function (configuration) {
    configuration.tables = configuration.tables || {};

    var router = express.Router();

    /**
    Register a single table with the specified definition.
    @function add
    @param {string} name - The name of the table. HTTP operations will be exposed on this route.
    @param {tableDefinition|module:azure-mobile-apps/express/tables/table} definition - The definition for the table.
    */
    router.add = function (name, definition) {
        assert(name, 'A table name was not specified');
        logger.debug("Adding table definition for " + name);
        definition = buildTableDefinition(name, definition);
        configuration.tables[name] = definition;
        router.use('/' + name, tableRouter(definition));
    };

    /**
    Import a file or folder of modules containing table definitions
    @function import
    @param {string} path Path to a file or folder containing modules that export either a {@link tableDefinition} or
    {@link module:azure-mobile-apps/express/tables/table table object}.
    The path is relative to configuration.basePath that defaults to the location of your startup module.
    The table name will be derived from the physical file name.
    */
    router.import = importDefinition.import(configuration.basePath, router.add);

    // expose configuration through zumoInstance.tables.configuration
    router.configuration = configuration.tables;

    return router;

    function buildTableDefinition(name, definition) {
        // if the definition doesn't have a router function, wrap it in a table definition object
        if(!definition || typeof definition.execute !== 'function')
            definition = table(definition);

        definition.name = definition.databaseTableName || definition.name || name;
        if (configuration.data && !definition.hasOwnProperty('dynamicSchema'))
            definition.dynamicSchema = configuration.data.dynamicSchema;
        if (configuration.data && !definition.hasOwnProperty('schema'))
            definition.schema = configuration.data.schema;
        if (!definition.hasOwnProperty('maxTop'))
            definition.maxTop = configuration.maxTop;

        return definition;
    }
}
