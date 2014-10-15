(function() {
  'use strict';

  var debug = require('./debug');
  var express = require('express');
  var path = require('path');
  var util = require('swagger-server/lib/helpers/util');


  /**
   * Serves Swagger-UI files.
   *
   * @param {SwaggerServer} server
   * @param {settings} settings
   */
  module.exports = function swaggerUI(server, settings) {
    var router = express.Router();
    var staticFiles = path.join(__dirname, '../static');


    if (settings.swaggerUI.enabled) {
      // Serve "/static/ui" content
      router.use(settings.swaggerUI.route, express.static(staticFiles + '/ui'));

      // Serve the Swagger spec as JSON
      router.get(settings.swaggerUI.route + '/api-docs', function getSwaggerJSON(req, res, next) {
        debug('Sending the JSON Swagger spec');
        res.json(server.swaggerObject);
      });

      // When the server starts, display the path to Swagger-UI
      server.once(server.events.start, function() {
        debug('Swagger-UI is now running at %s%s', util.normalizePath(server.metadata.url.href), settings.swaggerUI.route);
      });
    }


    return router;
  };

})();
