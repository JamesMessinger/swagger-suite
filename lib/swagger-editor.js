(function() {
  'use strict';

  var debug = require('./debug');
  var format = require('util').format;
  var express = require('express');
  var fs = require('fs');
  var path = require('path');
  var _ = require('lodash');
  var yaml = require('js-yaml');
  var bodyParser = require('body-parser');
  var util = require('swagger-server/lib/helpers/util');


  /**
   * Serves Swagger-Editor files.
   *
   * @param {SwaggerServer} server
   * @param {settings} settings
   */
  module.exports = function swaggerEditor(server, settings) {
    var router = express.Router();
    var staticFiles = path.join(__dirname, '../static');


    if (settings.editor.enabled) {
      // Serve "/static/editor" content
      router.use(settings.editor.route, express.static(staticFiles + '/editor'));

      // When the server starts, display the path to the editor
      server.once(server.events.start, function() {
        debug('Swagger-Editor is now running at %s%s', util.normalizePath(server.metadata.url.href), settings.editor.route);
      });
    }


    if (settings.docs.enabled) {
      // Serve "/static/docs" content
      router.use(settings.docs.route, express.static(staticFiles + '/docs'));

      // Redirect "GET /" to "GET /Docs"
      router.get('/', function redirectRootToDocs(req, res, next) {
        var swagger = server.swaggerObject;

        // Determine if the API includes a root GET operation
        if (!(_.isEmpty(swagger.basePath) || swagger.basePath === '/')    // API basePath is not at the root
        || !_.isPlainObject(swagger.paths['/'])                           // API does not have a root path
        || !_.isPlainObject(swagger.paths['/'].get)) {                    // root path does not have a GET operation

          // The API doesn't have a GET operation at the root, so redirect them to the HTML docs page
          debug('Redirecting the browser to the HTML docs');
          return res.redirect(307, settings.docs.route);
        }

        next();
      });

      // When the server starts, display the path to the docs
      server.once(server.events.start, function() {
        debug('HTML documentation is now available at %s%s', util.normalizePath(server.metadata.url.href), settings.docs.route);
      });
    }


    if (settings.editor.enabled || settings.docs.enabled) {
      // NOTE: We don't use `settings.editor.route` here because this path is hard-coded in Swagger-Editor
      var editorYamlRoute = '/editor/spec';

      // Serve the Swagger file as JSON
      router.get('/schema/swagger.json', function getSwaggerYAML(req, res, next) {
        debug('Sending the YAML Swagger spec');
        sendFileAsYaml(res, server.swaggerFile);
      });

      // Serve the Swagger file as YAML
      router.get(editorYamlRoute, function getSwaggerYAML(req, res, next) {
        debug('Sending the YAML Swagger spec');
        sendFileAsYaml(res, server.swaggerFile);
      });

      // Parse the YAML content as plain-text
      router.put(editorYamlRoute, bodyParser.text({ type: ['application/*', 'text/*'] }));

      // Update the Swagger file
      router.put(editorYamlRoute, function putSwaggerFile(req, res, next) {
        // If the editor is read-only, then don't save updates to the Swagger file
        if (settings.editor.readOnly) {
          return res.sendStatus(403); // Forbidden
        }

        debug('Updating %s', server.swaggerFile);

        try {
          // Validate the YAML content
          var data = req.body;
          yaml.safeLoad(data || 'invalid!!');

          // Convert it to JSON, if necessary
          if (path.extname(server.swaggerFile) === '.json') {
            data = JSON.stringify(data);
          }

          // Update the source file
          fs.writeFileSync(server.swaggerFile, data);
        }
        catch (e) {
          var error = new SyntaxError(format(
            'WARNING! Unable to save changes to the Swagger file. An error occurred: \n%s', e.message));
          console.warn(error.message);
          throw error;
        }

        // Send a successful response
        res.sendStatus(204);
      });


      // Serve other JSON/YAML files that are referenced via "$ref"
      router.use(function(req, res, next) {
        // Only allow GET and HEAD
        if (!(req.method === 'GET' || req.method === 'HEAD')) return next();

        // Only allow JSON and YAML files to be requested
        var requestedExtension = path.extname(req.path);
        var allowedExtensions = ['.yaml', '.json'];
        if (allowedExtensions.indexOf(requestedExtension) === -1) return next();

        // Get the full path to the file WITHOUT the extension
        var baseFilePath = path.join(path.dirname(server.swaggerFile), path.dirname(req.path), path.basename(req.path, requestedExtension));

        // Try to find the file with either extension
        for (var i = 0; i < allowedExtensions.length; i++) {
          var ext = allowedExtensions[i];
          if (fs.existsSync(baseFilePath + ext)) {
            switch (requestedExtension) {
              case '.json':
                return sendFileAsJson(res, baseFilePath + ext);
              case '.yaml':
                return sendFileAsYaml(res, baseFilePath + ext);
            }

            break;
          }
        }

        // If we didn't find the file, then maybe some other middleware will.
        // If not, then it'll end up 404'ing
        next();
      });
    }

    return router;
  };


  function sendFileAsJson(res, filePath) {
    if (path.extname(filePath) === '.yaml') {
      // The source file is YAML, so convert it to JSON
      res.json(yaml.safeLoad(util.openFile(filePath)));
    }
    else {
      // The source file is JSON, so just send it
      res.json(util.openFile(filePath));
    }
  }


  function sendFileAsYaml(res, filePath) {
    // Set the response type, since YAML isn't natively understood by Express
    res.type('text/yaml');

    if (path.extname(filePath) === '.yaml') {
      // The source file is YAML, so just send it
      res.send(util.openFile(filePath));
    }
    else {
      // The source file is JSON, so convert it to YAML
      res.send(yaml.safeDump(filePath, { skipInvalid: true }));
    }
  }

})();
