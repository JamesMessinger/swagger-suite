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
Once you have the prerequisites installed, run the following commands.

    npm install swagger-suite
    
    cd node_modules/swagger-suite
    bower install

The `cd` and `bower install` commands are necessry to install frontend packages like [Swagger-UI](http://petstore.swagger.wordnik.com/) and [Swagger Editor](http://editor.swagger.wordnik.com#/edit).  These frontend packages __are not__ included in Swagger-Suite's NPM package so that they can be updated independently.

#### Running the samples
Swagger-Suite comes with two sample apps: the ubiquitous "Swagger Petstore" is a simple example, and the "User Manager" demonstrates more advanced concepts.  To run the petstore sample, just `cd` into the `node_modules/swagger-suite` folder and run the following command:

    cd node_modules/swagger-suite
    npm run-script petstore

Or, on Windows:

    cd node_modules\swagger-suite
    npm run-script petstore-windows
    
Similarly, to run the "User Manager" sample insead, run:

    cd node_modules/swagger-suite
    npm run-script users
    
Or, on Windows: 

    cd node_modules\swagger-suite
    npm run-script users-windows

__Note:__ All of the above commands run the sample apps in DEBUG mode, which produces _a lot_ of output in the console window.  

#### Now open your browser
Both of the sample apps are configured to run at __[http://localhost:3000](http://localhost:3000)__, so open your browser and go check 'em out!


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
