(function() {
  'use strict';

  var debug = require('./debug');
  var express = require('express');
  var path = require('path');
  var favicon = require('serve-favicon');
  var _ = require('lodash');
  var util = require('swagger-server/lib/helpers/util');


  /**
   * Serves Swagger-Suite's own UI.
   *
   * @param {SwaggerServer} server
   * @param {settings} settings
   */
  module.exports = function fileServer(server, settings) {
    var router = express.Router();
    var staticFiles = path.join(__dirname, '../static');


    // Favicon
    router.use(favicon(staticFiles + '/favicon.ico'));


    // Metadata.json (used by Swagger-Suite's UI)
    router.get('/static/metadata.json', function getSwaggerServerJSON(req, res, next) {
      if (!http304(req, res, server.metadata.specDate)) {
        debug('Sending the Swagger-Suite metadata (if you\'re seeing a bunch of this message, then your browser isn\'t caching the responses)');

        var metadata = _.clone(server.metadata);
        metadata.settings = settings;
        metadata.info = server.swaggerObject ? server.swaggerObject.info : {};

        // The Error object doesn't serialize well to JSON, so convert it to a POJO
        if (metadata.error) {
          metadata.error = {
            type: metadata.error.constructor.name,
            status: metadata.error.status,
            message: metadata.error.message
          };
        }

        res.json(metadata);
      }
    });


    // Serve "/static" content
    router.use('/static', express.static(staticFiles));


    return router;
  };


  function http304(req, res, lastModifiedDate) {
    // Set cache headers, so we can possibly return a 304 next time
    res.set('Cache-Control', 'public, max-age=0');
    res.set('Last-Modified', util.rfc7231(lastModifiedDate));
    res.set('ETag', 'W/"' + lastModifiedDate.getTime() + '"');

    // If the "If-Modified-Since" header is specified, then we can possibly just return a 304
    var ifModified = new Date(req.get('If-Modified-Since'));
    if (!isNaN(ifModified.getTime())) {
      // Convert the Last-Modified date to RFC 7231 and back, so we're comparing apples-to-apples
      lastModifiedDate = new Date(util.rfc7231(lastModifiedDate));

      if (ifModified >= lastModifiedDate) {
        res.status(304);
        res.end();
        return true;
      }
    }

    // False = we did NOT send an HTTP 304
    return false;
  }

})();
