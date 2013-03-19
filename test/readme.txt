Test Environment
----------------

----
1. Test Implementation
----

Tests for JavaScript sources are written, using the Jasmine framework
http://pivotal.github.com/jasmine/

These tests are located at
/test/cases/

Each test unit (~ JavaScript file / class) should have its own Jasmine test spec (= JavaScript test file).

----
2. Test Execution
----

By default, the tests are setup to be run by the JsTestDriver framework
http://code.google.com/p/js-test-driver/

JsTestDriver allows to run the tests in several/multiple browsers at once.
Alternatively, the test could be run, using the default Jasmine web page definition directly (see Jasmine doc for more information).

JsTestDriver can be run using the Java library (/test/lib/jstestdriver/JsTestDriver-x.x.x.jar).

There also exists an Eclipse plugin
http://js-test-driver.googlecode.com/svn/update/

In general, JsTestDriver requires
 (a) a driver definition (see for example /jsTestDriver.conf) that specifies, which JavaScript files need to be loaded, i.e. the JavaScript files under test and required libraries, as well as the JavaScript files containing the tests.
 (b) information in which JavaScript environments (e.g. Web Browsers) to run the test, e.g. running the tests against Firefox, Chrome, and Internet Explorer. 

COMMAND LINE EXAMPLE:
java -jar JsTestDriver.jar --port 9876 --browser firefoxpath,chromepath
java -jar JsTestDriver.jar --config testdriverconfigfile --tests ALL

The default driver definition file is /jsTestDriver.conf.
More specific driver definitions can be found in /test/drivers/

----
3. Executing tests using Ant-Script "test.xml"
----

The settings file 'test.settings' has to be adapted:
- Path to at least one browser must be valid! (browser.*)
- If the JSTestdriver is updated the 'jstestdriver.bin'-property must be adapted accordingly

This script automatically finds all config files in the directory specified by "jstestdriver.config.dir".
And then it performs a seperate test for each config file.