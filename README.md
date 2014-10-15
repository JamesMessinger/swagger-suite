Swagger-Suite
============================
#### The complete suite of Swagger tools, packaged together seamlessly and ready to use. 

_Edit your API spec, mock it, test it, and document it, all from one app._


Features
--------------------------
* __Experience "design-first" API development__ - 
Design your REST API spec in [Swagger Editor](http://editor.swagger.wordnik.com#/edit), and Swagger-Suite will make sure your documentation, tests, and mocks are all kept in sync with your design.

* __Use your favorite code editor__ -
Prefer using Sublime Text or some other editor instead of the WYSIWYG tool?  That's fine.  Swagger-Suite will still detect your changes and keep the docs, tests, and mocks in sync with your spec.

* __Don't waste time writing boilerplate code__ - 
The built-in [Swagger-Server](https://github.com/BigstickCarpet/swagger-server) automatically and intelligently mocks your API _in real time_ as you design it.  So you can instantly interact with your API and get valid responses back _without writing any code_.

* __Simple extensibility via [Express.js](http://expressjs.com)__ - 
Suppliment Swagger-Server's mocks with your own custom logic, or replace the mocks entirely with your real API implementation.  It's as easy as `function(req, res, next)`

* __Test your API in any browser__ - 
Swagger-Suite includes [Swagger-UI](http://petstore.swagger.wordnik.com/), which lets you easily test your API in any browser.

* __Test your API in Postman__ - 
If you prefer to use [Postman](http://www.getpostman.com/) to test your REST APIs, then Swagger-Suite's got you covered.  It exposes your API as a Postman collection. 

* __Beautiful API Documentation__ - 
Your API is only as good as its documentation, and [Swagger Editor](http://editor.swagger.wordnik.com#/preview) makes it simple to provide clear, comprehensive, and beautiful HTML docs.


Supported Swagger Versions
--------------------------
* [2.0](http://github.com/reverb/swagger-spec/blob/master/versions/2.0.md)


Installation
--------------------------

### Prerequisites

* __[Node.js](http://nodejs.org)__ - This one probably goes without saying, but...

* __[Bower](http://bower.io)__ - Swagger-Suite uses Bower to manage all of its frontend packages.

### Install Steps
Once you have the prerequisites installed, run the following commands.  This installs Swagger-Suite and all of its frontend packages.

    npm install swagger-suite
    
    cd node_modules/swagger-suite
    bower install

That's all there is to it!  See your `node_modules/swagger-suite/samples` directory for sample Swagger files and two complete sample APIs to get you started.  

### Running It
The following command will run a sample "User Manager" app.  The app will run in debug mode, so you can see everything it's doing in the console window.  

    npm run-script debug

To run it in normal (non-debug) mode, use this command instead:

    npm run-script start

Either way, once Swagger-Suite is running, you can open your web browser and go to __[http://localhost:3000](http://localhost:3000)__.   Why port 3000?  Because that's what's specified in the sample Swagger file.  If you use a different port number in your Swagger file, then Swagger-Suite will run on that port instead.


Walkthrough
--------------------------
TODO


Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/BigstickCarpet/swagger-suite/issues) on GitHub and [submit a pull request](https://github.com/BigstickCarpet/swagger-suite/pulls).  Use JSHint to make sure your code passes muster.  (see [.jshintrc](.jshintrc)).

Here are some things currently on the to-do list:

* __Unit tests__ - Need lots of 'em! Planning to use Mocha and Chai

* __Gulp build script__ - Automate SASS, JSHint, and unit tests

* __Postman support__ - This is coming very soon.


License
--------------------------
Swagger-Suite is 100% free and open-source, under the [MIT license](LICENSE). 
Parts of this software were created by third-parties and are subject to other software licenses. [Click here for details](LICENSES.md)
