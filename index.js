(function() {
  'use strict';

  var _ = require('lodash');
  var morgan = require('morgan');
  var SwaggerServer = require('swagger-server');
  var errors = require('./lib/errors');
  var swaggerSuiteFiles = require('./lib/swagger-suite');
  var swaggerEditorFiles = require('./lib/swagger-editor');
  var swaggerUIFiles = require('./lib/swagger-ui');


  /**
   * This function creates a {@link SwaggerServer} instance and adds several extra
   * features to it, including Swagger-Editor and Swagger-UI.
   *
   * @param {string} swaggerFile
   * the path of a Swagger spec file (JSON or YAML)
   *
   * @param {swaggerSuite#settings} [settings]
   * settings that determine how Swagger-Suite behaves and which features are enabled.
   * You can edit {@link swaggerSuite#settings} directly rather than passing this property if you prefer.
   *
   * @returns {SwaggerServer}
   */
  function swaggerSuite(swaggerFile, settings) {
    settings = _.merge({}, settings, swaggerSuite.settings);

    // Create a Swagger-Server instance
    var server = new SwaggerServer(swaggerFile, settings.server);

    // Add extra middleware
    server.use(morgan('dev', { skip: dontLogPollingRequests}));
    server.use(swaggerSuiteFiles(server, settings));
    server.use(swaggerEditorFiles(server, settings));
    server.use(swaggerUIFiles(server, settings));
    server.use(errors(server, settings));

    return server;
  }


  /**
   * Settings that determine how the Swagger-Suite behaves and which features are enabled.
   *
   * @type {{docs: {enabled: boolean, route: string}, editor: {enabled: boolean, readOnly: boolean, route: string}, swaggerUI: {enabled: boolean, route: string}, api: {enabled: boolean, enableCORS: boolean, enableMocks: boolean}}}
   * @name settings
   */
  swaggerSuite.settings = {
    /**
     * Swagger-Suite uses Swagger-Editor to provide HTML documentation of your RESTful API.
     * You can disable this, or change the documentation URL here.
     */
    docs: {
      /**
       * Determines whether HTML docs are enabled.
       * @type {boolean}
       */
      enabled: true,

      /**
       * The route to the HTML documentation. The default route is "/docs".
       *
       * For convenience, and to avoid confusion, if your API doesn't
       * have a GET operation at the root path (i.e. `GET /`), then Swagger-Server
       * will respond to this request with an HTTP 307 and a `Location` header
       * that redirects the browser to your HTML docs.
       *
       * @type {string}
       */
      route: '/docs'
    },

    /**
     * Swagger-Suite uses Swagger-Editor to provide a WYSIWYG editor for your API spec.
     * You can disable the editor, or adjust its behavior here.
     */
    editor: {
      /**
       * Determines whether the Swagger-Editor WYSIWYG is enabled.
       * Disabling this will NOT disable the HTML documentation, which is also provided by Swagger-Editor.
       * @type {boolean}
       */
      enabled: true,

      /**
       * Allows you to enable the editor in read-only mode.  The editor will
       * still allow changes to the spec and will show instant previews of those changes,
       * but the actual Swagger file on the server will remain unchanged.
       * @type {boolean}
       */
      readOnly: false,

      /**
       * The route to the Swagger spec editor. The default route is "/editor".
       * @type {string}
       */
      route: '/editor'
    },

    /**
     * Swagger-Suite includes Swagger-UI, which lets you test your API in any browser.
     * You can disable Swagger-UI, or change the URL here.
     */
    swaggerUI: {
      /**
       * Determines whether Swagger-UI is enabled.
       * @type {boolean}
       */
      enabled: true,

      /**
       * The route to Swagger-UI. The default route is "/ui".
       * @type {string}
       */
      route: '/ui'
    },

    /**
     * Swagger-Suite uses Swagger-Server to host your API and provide mocks for each of your operations.
     * You can disable this, or adjust its behavior here.
     */
    server: {
      /**
       * Determines whether Swagger-Server is enabled.
       * @type {boolean}
       */
      enabled: true,

      /**
       * By default, Swagger-Server will automatically handle all CORS preflight requests,
       * and will add the appropriate CORS headers to every HTTP response.
       * You can fully customize this behavior using your Swagger spec. See "CORS.js" for more details.
       * Or you can completely disable Swagger-Server's CORS functionality by setting this property to false.
       * @type {boolean}
       */
      enableCORS: true,

      /**
       * Swagger-Server automatically provides mock implementations for
       * each operation defined in your Swagger spec.  This is useful for
       * development and testing purposes, but when you're ready to provide
       * the real implementation for your API, you can disable the mocks.
       *
       * NOTE: Swagger-Server's mock implementations are always executed last,
       * so you can add your own implementation middleware (real or mock) and
       * then call Swagger-Server's mock via `next()`, or you can bypass
       * Swagger-Server's mock by not calling `next()` and sending your own
       * response instead.
       *
       * @type {boolean}
       */
      enableMocks: true
    }
  };


  // Don't logging polling requests from Swagger-Editor or Swagger-Suite's UI.  They quickly clutter-up the log.
  function dontLogPollingRequests(req, res) {
    return req.originalUrl === '/static/bower_components/swagger-suite-editor/dist/index.html'
        || req.originalUrl === '/static/bower_components/swagger-suite-editor/dist/'
        || req.originalUrl === '/static/metadata.json';
  }

  module.exports = swaggerSuite;

})();
