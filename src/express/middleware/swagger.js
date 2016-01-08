// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var swaggerui = require('./swagger-ui'),
    swagger = require('../../swagger'),
    promises = require('../../utilities/promises')
    express = require('express');

module.exports = function(configuration) {
    var router = express.Router();

    router.use('/ui', swaggerui(configuration));
    router.use('/', metadata);

    return router;

    function metadata(req, res, next) {
        var data = req.azureMobile.data;

        getTableSchemas()
            .then(function (schemas) {
                res.json(swagger(configuration)(baseUrl(), schemas));
            })
            .catch(next);

        function baseUrl() {
            return req.protocol + '://' + req.hostname + '/' + req.baseUrl;
        }

        function getTableSchemas() {
            var tables = configuration.tables;
            return promises.all(Object.keys(tables).map(function (tableName) {
                return data(tables[tableName]).schema();
            }));
        }
    }
};
