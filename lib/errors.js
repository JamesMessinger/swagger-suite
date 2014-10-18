(function() {
  'use strict';

  var path = require('path');
  var util = require('swagger-server/lib/helpers/util');


  /**
   * Error handlers
   *
   * @param {SwaggerServer} server
   * @param {settings} settings
   */
  module.exports = function errors(server, settings) {
    // Adds the error to Swagger-Suite's metadata, so it can be reported to the client
    function metadataError(err, req, res, next) {
      try {
        // We only want to report server-side errors
        if (err instanceof SyntaxError || err.status >= 500) {
          if (!server.metadata.error) {
            server.metadata.error = err;
            server.metadata.specDate = new Date();
          }
        }
      }
      catch (e) {
        // Ignore any errors that happen inside this error handler
      }
      finally {
        next(err);
      }
    }

    // Attempts to return an HTML error page, if possible
    function htmlError(err, req, res, next) {
      // Set the response status code
      var statusCode = err.status || 500;
      res.status(statusCode);

      // Get the error message
      var errorMessage;
      if (statusCode >= 500 && util.isDevelopmentEnvironment())
        errorMessage = err.stack;
      else
        errorMessage = err.message;
      errorMessage = errorMessage || 'Internal Server Error';

      try {
        // Determine the format to send the error back in
        var accept = req.get('Accept');
        var acceptsHTML = false;
        if (accept) {
          acceptsHTML = accept.indexOf('text/html') >= 0
            || accept.indexOf('*/*') >= 0
            || accept.indexOf('* / *') >= 0;
        }

        // If the request came from Swagger-Editor, then DON'T return HTML.  It messes up the UI.
        if (req.headers.referer && req.headers.referer.indexOf('/swagger-suite-editor/') >= 0) {
          acceptsHTML = false;
        }

        if (acceptsHTML) {
          // Super simple mustache-like template
          var html = util.openFile(path.join(__dirname, '../static/error.html'));
          html = html.replace(/\{\{ statusCode \}\}/g, statusCode.toString());
          html = html.replace(/\{\{ errorMessage \}\}/g, errorMessage.replace(/\n/g, '<br>'));
          res.type('html');
          res.send(html);
        }
        else {
          // HTML isn't allowed, so let the next error handler take over
          next(err);
        }
      }
      catch (e) {
        // Something went wrong while trying to send as HTML,
        // so just let the next error handler take over
        next(err);
      }
    }

    return [metadataError, htmlError];
  };

})();

